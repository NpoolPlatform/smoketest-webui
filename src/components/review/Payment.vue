<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REVIEW_TIMEOUT_PAYMENTS")'
    :rows='payments'
    row-key='ID'
    :loading='paymentLoading'
    :rows-per-page-options='[20]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_REVIEW_USER_PAYMENT_BALANCES")'
    :rows='myBalances'
    row-key='ID'
    :loading='balanceLoading'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useAdminBillingStore, useCoinStore, UserPaymentBalance } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const billing = useAdminBillingStore()
const payments = computed(() => billing.Payments)
const balances = computed(() => billing.PaymentBalances)

const coin = useCoinStore()

interface MyBalance extends UserPaymentBalance {
  CoinName: string
  CoinUSDCurrency: number
  USDAmount: number
}
const myBalances = computed(() => {
  const bls = [] as Array<MyBalance>
  balances.value?.forEach((balance) => {
    const el = balance as MyBalance
    const index = payments.value?.findIndex((pay) => pay.ID === el.PaymentID)
    if (index === undefined) {
      return
    }
    if (index < 0) {
      return
    }
    const payment = payments.value[index]
    el.CoinName = coin.getCoinByID(payment.CoinInfoID)?.Name as string
    el.CoinUSDCurrency = payment.CoinUSDCurrency
    el.USDAmount = el.Amount * payment.CoinUSDCurrency
    bls.push(el)
  })
  return bls
})

const paymentLoading = ref(false)
const balanceLoading = ref(false)

onMounted(() => {
  billing.getPayments({
    Message: {
      Error: {
        Title: t('MSG_GET_PAYMENTS'),
        Message: t('MSG_GET_PAYMENTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    paymentLoading.value = false
  })

  billing.getPaymentBalances({
    Message: {
      Error: {
        Title: t('MSG_GET_PAYMENT_BALANCES'),
        Message: t('MSG_GET_PAYMENT_BALANCES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    balanceLoading.value = false
  })

  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
