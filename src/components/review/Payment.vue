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
    :rows='balances'
    row-key='ID'
    :loading='balanceLoading'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useBillingStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const billing = useBillingStore()
const payments = computed(() => billing.Payments)
const balances = computed(() => billing.PaymentBalances)

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
})

</script>
