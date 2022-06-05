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
import { NotificationType, useAdminBillingStore } from 'npool-cli-v2'
import { computed, onMounted } from 'vue'

const billing = useAdminBillingStore()
const withdraws = computed(() => billing.Withdraws)

const prepare = () => {
  billing.getWithdraws({
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAWS',
        Message: 'MSG_GET_WITHDRAWS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  prepare()
})

</script>
