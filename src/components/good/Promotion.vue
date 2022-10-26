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
    :title='$t("MSG_APP_GOOD_PROMOTIONS")'
    :rows='promotions'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Promotion)'
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
        <span>{{ $t('MSG_CREATE_PROMOTION') }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ updating? target.GoodName : selectedGood[0]?.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input type='number' v-model='target.Price' :label='$t("MSG_PRICE")' />
        <DatePicker v-model:date='target.StartAt' :label='$t("MSG_START_AT")' />
        <DatePicker v-model:date='target.EndAt' :label='$t("MSG_END_AT")' />
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
import { NotifyType } from 'npool-cli-v4'
import { useAdminAppGoodStore } from 'src/teststore/good/appgood'
import { AppGood } from 'src/teststore/good/appgood/types'
import { useAdminPromotionStore } from 'src/teststore/good/promotion'
import { Promotion } from 'src/teststore/good/promotion/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const appGood = useAdminAppGoodStore()
const appGoods = computed(() => appGood.AppGoods.AppGoods)
const selectedGood = ref([] as Array<AppGood>)

const promotion = useAdminPromotionStore()
const promotions = computed(() => promotion?.Promotions.Promotions)

const target = ref({} as Promotion)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
  target.value.GoodID = selectedGood.value[0]?.GoodID
}

const onRowClick = (row: Promotion) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Promotion
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppPromotion(done) : createAppPromotion(done)
}

const createAppPromotion = (done: () => void) => {
  promotion.createPromotion({
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: t('MSG_CREATE_PROMOTION'),
        Message: t('MSG_CREATE_PROMOTION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_PROMOTION'),
        Message: t('MSG_CREATE_PROMOTION_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Promotion, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateAppPromotion = (done: () => void) => {
  promotion.updatePromotion({
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_PROMOTION'),
        Message: t('MSG_UPDATE_PROMOTION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_PROMOTION'),
        Message: t('MSG_UPDATE_PROMOTION_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Promotion, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (promotions.value.length === 0) {
    getPromotions(0, 500)
  }
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
})

const getPromotions = (offset: number, limit: number) => {
  promotion.getPromotions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOD_PROMOTIONS'),
        Message: t('MSG_GET_GOOD_PROMOTIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Promotion>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getPromotions(offset + limit, limit)
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
