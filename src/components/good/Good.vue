<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    :columns='coinColumns'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    :columns='appGoodsColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as AppGood)'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_APP_GOOD') }} : {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' type='number' :min='0' />
        <q-input v-model.number='target.PurchaseLimit' :label='$t("MSG_PURCHASE_LIMIT")' type='number' :min='0' />
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
        <q-input v-model='descriptions' :label='$t("MSG_DESCRIPTIONS")' />
        <q-input v-model='displayNames' :label='$t("MSG_DISPLAY_NAMES")' />
        <q-input v-model='target.GoodBanner' :label='$t("MSG_GOOD_BANNER")' />
        <q-input
          class='commission-percent'
          v-model.number='target.CommissionPercent'
          :label='$t("MSG_COMMISSION_PERCENT")'
          type='number'
          :min='0'
          suffix='%'
        />
        <!-- <q-input
          class='commission-percent'
          v-model.number='target.TechnicalFeeRatio'
          :label='$t("MSG_TECHNICALFEE_RATIO")'
          type='number'
          :min='0'
        />
        <q-input
          class='commission-percent'
          v-model.number='target.ElectricityFeeRatio'
          :label='$t("MSG_ELECTRICITYFEE_RATIO")'
          type='number'
          :min='0'
        /> -->
        <!-- <q-input
          class='commission-percent'
          v-model='target.DailyRewardAmount'
          :label='$t("MSG_DAILY_REWARD_AMOUNT")'
          type='number'
          :min='0'
        /> -->
      </q-card-section>
      <q-card-section>
        <div> <q-toggle dense v-model='openSaleActivity' :label='$t("MSG_OPEN_SALE")' /></div>
      </q-card-section>
      <q-card-section>
        <div> <DateTimePicker v-model:date='target.SaleStartAt' label='MSG_SALE_START_AT' :disabled='!openSaleActivity' /></div>
        <div> <DateTimePicker v-model:date='target.SaleEndAt' label='MSG_SALE_END_AT' :disabled='!openSaleActivity' /></div>
        <!-- <div> <DateTimePicker v-model:date='target.ServiceStartAt' label='MSG_SERVICE_START_AT' /></div> -->
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Online' :label='$t("MSG_ONLINE")' />
        </div>
      </q-card-section>

      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, useAdminAppGoodStore, AppGood, useAdminAppCoinStore, AppCoin } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const coin = useAdminAppCoinStore()
const coins = computed(() => coin.AppCoins.AppCoins)

const appGood = useAdminAppGoodStore()
const appGoods = computed(() => appGood.AppGoods.AppGoods)

const target = ref({} as AppGood)

const openSaleActivity = ref(false)

const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as AppGood
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const descriptions = ref('')
const displayNames = ref('')

const onRowClick = (row: AppGood) => {
  target.value = { ...row }
  openSaleActivity.value = target?.value?.SaleEndAt !== 0
  descriptions.value = target?.value?.Descriptions?.join(',')
  displayNames.value = target?.value?.DisplayNames?.join(',')
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppGood(done) : createAppGood(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Online: target.value.Online,
    Visible: target.value.Visible,
    GoodName: target.value.GoodName,
    Price: target.value.Price,
    DisplayIndex: target.value.DisplayIndex,
    PurchaseLimit: target.value.PurchaseLimit,
    CommissionPercent: target.value.CommissionPercent,
    // TechnicalFeeRatio: target.value.TechnicalFeeRatio === 0 ? undefined as unknown as number : target.value.TechnicalFeeRatio,
    // ElectricityFeeRatio: target.value.ElectricityFeeRatio === 0 ? undefined as unknown as number : target.value.ElectricityFeeRatio,
    SaleStartAt: target.value.SaleStartAt,
    SaleEndAt: target.value.SaleEndAt,
    // ServiceStartAt: target.value.ServiceStartAt === 0 ? undefined as unknown as number : target.value.ServiceStartAt,
    Descriptions: descriptions.value?.split(','),
    DisplayNames: displayNames.value?.split(','),
    GoodBanner: target.value?.GoodBanner
  }
})

const updateAppGood = (done: () => void) => {
  if (!openSaleActivity.value) {
    target.value.SaleStartAt = 0
    target.value.SaleEndAt = 0
  }
  appGood.updateAppGood({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: AppGood, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const createAppGood = (done: () => void) => {
  done()
}

onMounted(() => {
  if (coins.value?.length === 0) {
    getCoins(0, 500)
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
    name: 'COINTYPEID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: AppGood) => row.CoinTypeID
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
  },
  {
    name: 'SaleStartAt',
    label: t('MSG_SALE_START_AT'),
    field: (row: AppGood) => formatTime(row?.SaleStartAt)
  },
  {
    name: 'SaleEndAt',
    label: t('MSG_SALE_END_AT'),
    field: (row: AppGood) => formatTime(row?.SaleEndAt)
  },
  {
    name: 'DailyRewardAmount',
    label: t('MSG_DAILY_REWARD_AMOUNT'),
    field: (row: AppGood) => row.DailyRewardAmount
  },
  {
    name: 'ServiceStartAt',
    label: t('MSG_SERVICE_START_AT'),
    field: (row: AppGood) => formatTime(row?.ServiceStartAt)
  }
])

const coinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: AppCoin) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: AppCoin) => row.AppID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: AppCoin) => row.CoinTypeID
  },
  {
    name: 'Name',
    label: t('MSG_APP_COIN_NAME'),
    field: (row: AppCoin) => row.Name
  },
  {
    name: 'DisplayNames',
    label: t('MSG_COIN_NAME'),
    field: (row: AppCoin) => row.DisplayNames?.join(',')
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    field: (row: AppCoin) => row.Logo
  },
  {
    name: 'Unit',
    label: t('MSG_UNIT'),
    field: (row: AppCoin) => row.Unit
  },
  {
    name: 'Presale',
    label: t('MSG_PRESALE'),
    field: (row: AppCoin) => row.Presale
  },
  {
    name: 'ReservedAmount',
    label: t('MSG_RESERVED_AMOUNT'),
    field: (row: AppCoin) => row.ReservedAmount
  },
  {
    name: 'ForPay',
    label: t('MSG_FOR_PAY'),
    field: (row: AppCoin) => row.ForPay
  },
  {
    name: 'ProductPage',
    label: t('MSG_PRODUCT_PAGE'),
    field: (row: AppCoin) => row.ProductPage
  },
  {
    name: 'ENV',
    label: t('MSG_ENV'),
    field: (row: AppCoin) => row.ENV
  },
  {
    name: 'MarketValue',
    label: t('MSG_MARKET_VALUE'),
    field: (row: AppCoin) => row.MarketValue
  },
  {
    name: 'SettleValue',
    label: t('MSG_SETTLE_VALUE'),
    field: (row: AppCoin) => row.SettleValue
  },
  {
    name: 'SettlePercent',
    label: t('MSG_SETTLE_PERCENT'),
    field: (row: AppCoin) => row.SettlePercent
  },
  {
    name: 'SettleTips',
    label: t('MSG_SETTLE_TIPS'),
    field: (row: AppCoin) => row.SettleTips?.join(',')
  },
  {
    name: 'DailyRewardAmount',
    label: t('MSG_DAILY_REWARD_AMOUNT'),
    field: (row: AppCoin) => row.DailyRewardAmount
  },
  {
    name: 'Display',
    label: t('MSG_DISPLAY'),
    field: (row: AppCoin) => row.Display
  },
  {
    name: 'DisplayIndex',
    label: t('MSG_DISPLAY_INDEX'),
    field: (row: AppCoin) => row.DisplayIndex
  }
])
</script>
