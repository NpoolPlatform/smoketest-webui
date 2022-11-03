<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS")'
    :rows='withdrawAddress'
    row-key='ID'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { useAdminUserAccountStore } from 'npool-cli-v4'
import { getAppUserAccounts } from 'src/api/account'
import { computed, onMounted } from 'vue'

const account = useAdminUserAccountStore()
const withdrawAddress = computed(() => account.withdrawAddress)

onMounted(() => {
  if (withdrawAddress.value.length === 0) {
    getAppUserAccounts(0, 500)
  }
})
</script>
