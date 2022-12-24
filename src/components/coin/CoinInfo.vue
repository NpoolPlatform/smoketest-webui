<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_APP_COINS")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as AppCoin)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_COINNAME")'
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
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input v-model='displayNames' :label='$t("MSG_DISPLAY_NAMES")' />
        <q-input v-model='target.Logo' :label='$t("MSG_COIN_LOGO")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
        <!-- <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' /> -->
        <!-- <q-input type='number' v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' /> -->
        <q-input type='number' v-model='target.WithdrawAutoReviewAmount' :label='$t("MSG_WITHDRAW_AUTO_REVIEW_AMOUNT")' />
        <q-input type='number' v-model='target.MarketValue' :label='$t("MSG_COIN_MARKET_VALUE")' />
        <q-input type='number' v-model.number='target.SettlePercent' :label='$t("MSG_COIN_SETTLE_PERCENT")' />
        <q-input v-model='settleTips' :label='$t("MSG_SETTLE_TIPS")' />
        <q-input type='number' v-model='target.DailyRewardAmount' :label='$t("MSG_DAILY_REWARD_AMOUNT")' />
        <!-- <q-select dense :options='CoinEnvironments' v-model='target.ENV' :label='$t("MSG_COIN_ENVIRONMENT")' /> -->
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.ForPay' :label='$t("MSG_FOR_PAY")' /><span class='tip'>CoinForPay: {{ target.CoinForPay }}</span></div>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' /><span class='tip'>CoinDisabled: {{ target.CoinDisabled }}</span></div>
        <div><q-toggle dense v-model='target.Display' :label='$t("MSG_DISPLAY")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, AppCoin, useAdminAppCoinStore } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const coin = useAdminAppCoinStore()
const coins = computed(() => coin.AppCoins.AppCoins)

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.CoinTypeID?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as AppCoin)
const displayNames = ref('')
const settleTips = ref('')

const onRowClick = (row: AppCoin) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as AppCoin
}

const onSubmit = (done: () => void) => {
  updateAppCoin(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value?.ID,
    AppID: target.value?.AppID,
    CoinTypeID: target.value?.CoinTypeID,
    Name: target.value?.Name,
    DisplayNames: displayNames.value.length > 0 ? displayNames.value.split(',') : [],
    Logo: target.value?.Logo?.length > 0 ? target.value?.Logo : undefined as unknown as string,
    ForPay: target.value?.ForPay,
    WithdrawAutoReviewAmount: target.value?.WithdrawAutoReviewAmount,
    MarketValue: target.value?.MarketValue,
    SettlePercent: target.value?.SettlePercent === 0 ? undefined as unknown as number : target.value?.SettlePercent,
    SettleTips: settleTips.value.length > 0 ? settleTips.value.split(',') : [],
    ProductPage: target.value?.ProductPage?.length > 0 ? target.value?.ProductPage : undefined as unknown as string,
    DailyRewardAmount: target.value?.DailyRewardAmount?.length > 0 ? target.value?.DailyRewardAmount : undefined as unknown as string,
    Disabled: target.value?.Disabled,
    Display: target.value?.Display
  }
})

const updateAppCoin = (done: () => void) => {
  coin.updateAppCoin({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_COIN',
        Message: 'MSG_UPDATE_COIN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

watch([() => target.value?.Disabled, () => target.value?.ForPay], () => {
  if (target.value?.CoinDisabled) {
    target.value.Disabled = true
  }
  if (!target.value?.CoinForPay) {
    target.value.ForPay = false
  }
})

onMounted(() => {
  if (coins.value?.length === 0) {
    getCoins(0, 500)
  }
})
</script>
