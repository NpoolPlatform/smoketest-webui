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
import { NotificationType } from 'npool-cli-v2'
import { useAdminLedgerStore } from 'src/teststore/ledger'
import { computed, onMounted } from 'vue'

const ledger = useAdminLedgerStore()
const withdraws = computed(() => ledger.Withdraws.Withdraws)

const getAppWithdraws = (offset: number, limit: number) => {
  ledger.getAppWithdraws({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAWS',
        Message: 'MSG_GET_WITHDRAWS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (count !== undefined && count < limit) { // one less request
      return
    }
    getAppWithdraws(offset + limit, limit)
  })
}

onMounted(() => {
  if (ledger.Withdraws.Withdraws.length === 0) {
    getAppWithdraws(0, 100)
  }
})

</script>
