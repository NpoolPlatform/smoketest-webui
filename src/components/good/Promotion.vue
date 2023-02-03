<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    :columns='appGoodsColumns'
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
    :columns='columns'
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
import { formatTime, NotifyType, useAdminAppGoodStore, AppGood, useAdminPromotionStore, Promotion } from 'npool-cli-v4'
import { getPromotions } from 'src/api/good'
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
})

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: AppGood) => row.ID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    field: (row: AppGood) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    field: (row: AppGood) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    field: (row: AppGood) => row.GoodType
  },
  {
    name: 'ONLINE',
    label: t('MSG_ONLINE'),
    field: (row: AppGood) => row.Online
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    field: (row: AppGood) => row.Visible
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    field: (row: AppGood) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    field: (row: AppGood) => row.Unit
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    field: (row: AppGood) => row.Total
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    field: (row: AppGood) => row.Sold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    field: (row: AppGood) => row.Locked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    field: (row: AppGood) => row.InService
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    field: (row: AppGood) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    field: (row: AppGood) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    field: (row: AppGood) => formatTime(row.StartAt)
  }
])

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Promotion) => row.ID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOOD_ID'),
    field: (row: Promotion) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOOD_NAME'),
    field: (row: Promotion) => row.GoodName
  },
  {
    name: 'PRICE',
    label: t('MSG_GOOD_RPICE'),
    field: (row: Promotion) => row.Price
  },
  {
    name: 'START_AT',
    label: t('MSG_START_AT'),
    field: (row: Promotion) => formatTime(row.StartAt)
  },
  {
    name: 'END_AT',
    label: t('MSG_END_AT'),
    field: (row: Promotion) => formatTime(row.EndAt)
  }
])
</script>
