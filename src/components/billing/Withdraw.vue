<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_WITHDRAWS")'
    :rows='withdraws'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { NotifyType, useAdminLedgerWithdrawStore, Withdraw } from 'npool-cli-v4'
import { computed, onMounted } from 'vue'

const withdraw = useAdminLedgerWithdrawStore()
const withdraws = computed(() => withdraw.Withdraws.Withdraws)

onMounted(() => {
  if (withdraws.value.length === 0) {
    getAppWithdraws(0, 100)
  }
})

const getAppWithdraws = (offset: number, limit: number) => {
  withdraw.getAppWithdraws({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAWS',
        Message: 'MSG_GET_WITHDRAWS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Withdraw>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppWithdraws(offset + limit, limit)
  })
}
</script>
