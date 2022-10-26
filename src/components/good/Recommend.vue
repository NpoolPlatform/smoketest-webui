<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedGood'
  />

  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_RECOMMENDS")'
    :rows='recommends'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Recommend)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          :disable='selectedGood.length === 0'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_RECOMMEND') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ updating? target.GoodName : selectedGood[0]?.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.RecommendIndex' :label='$t("MSG_RECOMMEND_INDEX")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, useLocalUserStore } from 'npool-cli-v4'
import { useAdminRecommendStore } from 'src/teststore/good/recommend'
import { AppGood } from 'src/teststore/good/appgood/types'
import { Recommend } from 'src/teststore/good/recommend/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdminAppGoodStore } from 'src/teststore/good/appgood'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const appGood = useAdminAppGoodStore()
const appGoods = computed(() => appGood.AppGoods.AppGoods)
const selectedGood = ref([] as Array<AppGood>)

const recommend = useAdminRecommendStore()
const recommends = computed(() => recommend.Recommends.Recommends)

const logined = useLocalUserStore()
const target = ref({
  RecommenderID: logined.User?.ID
} as Recommend)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
  target.value.GoodID = selectedGood.value[0]?.ID
}

const onRowClick = (row: Recommend) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  target.value = {
    RecommenderID: logined.User?.ID
  } as Recommend
  showing.value = false
}

const onSubmit = (done: () => void) => {
  updating.value ? updateRecommend(done) : createRecommend(done)
}

const createRecommend = (done: () => void) => {
  recommend.createRecommend({
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: t('MSG_CREATE_RECOMMEND'),
        Message: t('MSG_CREATE_RECOMMEND_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_RECOMMEND'),
        Message: t('MSG_CREATE_RECOMMEND_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Recommend, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateRecommend = (done: () => void) => {
  recommend.updateRecommend({
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_RECOMMEND'),
        Message: t('MSG_UPDATE_RECOMMEND_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_RECOMMEND'),
        Message: t('MSG_UPDATE_RECOMMEND_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Recommend, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (recommends.value.length === 0) {
    getRecommends(0, 500)
  }
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
})

const getRecommends = (offset: number, limit: number) => {
  recommend.getRecommends({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOD_RECOMMENDS'),
        Message: t('MSG_GET_GOOD_RECOMMENDS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Recommend>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getRecommends(offset + limit, limit)
  })
}

const getAppGoods = (offset: number, limit: number) => {
  appGood.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<AppGood>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
</script>
