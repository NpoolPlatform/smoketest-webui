<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_DEFAULT_GOODS")'
    :rows='appDefaultGoods'
    :columns='appDefaultGoodsColumns'
    v-model:selected='selectedGoods'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as AppDefaultGood)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedGoods?.length === 0'
          @click='onDelete(selectedGoods?.[0])'
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
        <span>{{ $t('MSG_APP_DEFAULT_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='target.GoodID' />
        <CoinPicker v-model:id='target.CoinTypeID' v-model:updating='updating' />
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
import { formatTime, NotifyType, AppDefaultGood, useAdminAppDefaultGoodStore } from 'npool-cli-v4'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const appDefaultGood = useAdminAppDefaultGoodStore()
const appDefaultGoods = computed(() => appDefaultGood.AppDefaultGoods.AppDefaultGoods)

const target = ref({} as AppDefaultGood)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as AppDefaultGood
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: AppDefaultGood) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppDefaultGood(done) : createAppDefaultGood(done)
}

const createAppDefaultGood = (done: () => void) => {
  appDefaultGood.createAppDefaultGood({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_APP_DEFAULT_GOOD'),
        Message: t('MSG_CREATE_APP_DEFAULT_GOOD_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_APP_DEFAULT_GOOD'),
        Message: t('MSG_CREATE_APP_DEFAULT_GOOD_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (row: AppDefaultGood, error: boolean) => {
    console.log('row: ', row.ID)
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateAppDefaultGood = (done: () => void) => {
  appDefaultGood.updateAppDefaultGood({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_APP_DEFAULT_GOOD'),
        Message: t('MSG_UPDATE_APP_DEFAULT_GOOD_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_APP_DEFAULT_GOOD'),
        Message: t('MSG_UPDATE_APP_DEFAULT_GOOD_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (row: AppDefaultGood, error: boolean) => {
    console.log('row: ', row.ID)
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedGoods = ref([] as Array<AppDefaultGood>)
const onDelete = (row: AppDefaultGood) => {
  appDefaultGood.deleteAppDefaultGood({
    ID: row.ID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_DEFAULT_GOOD',
        Message: 'MSG_DELETE_APP_DEFAULT_GOOD_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_DEFAULT_GOOD',
        Message: 'MSG_DELETE_APP_DEFAULT_GOOD_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  if (appDefaultGoods.value?.length === 0) {
    getAppDefaultGoods(0, 500)
  }
})

const getAppDefaultGoods = (offset: number, limit: number) => {
  appDefaultGood.getAppDefaultGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_DEFAULT_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (rows: Array<AppDefaultGood>, error: boolean) => {
    if (error || rows.length < limit) {
      return
    }
    getAppDefaultGoods(offset + limit, limit)
  })
}

const appDefaultGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: AppDefaultGood) => row.ID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    field: (row: AppDefaultGood) => row.GoodID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: AppDefaultGood) => row.CoinTypeID
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: AppDefaultGood) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: AppDefaultGood) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    field: (row: AppDefaultGood) => formatTime(row.UpdatedAt)
  }
])
</script>
