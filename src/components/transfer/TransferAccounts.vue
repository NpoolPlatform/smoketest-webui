<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TRANSFER_ACCOUNTS")'
    :rows='displayAccounts'
    row-key='ID'
    :loading='accountsLoading'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='targetUserID'
          :label='$t("MSG_USERID")'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, TransferAccount, useAdminTransferAccountStore } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const transferAccounts = useAdminTransferAccountStore()
const displayAccounts = computed(() => transferAccounts.TransferAccounts.TransferAccounts.filter((el) => el.UserID.includes(targetUserID.value)))
const accountsLoading = ref(false)
const targetUserID = ref('')
const getAppTransfers = (offset: number, limit: number) => {
  transferAccounts.getAppTransfers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<TransferAccount>, error: boolean) => {
    if (error || resp.length < limit) {
      accountsLoading.value = false
      return
    }
    getAppTransfers(offset + limit, limit)
  })
}

onMounted(() => {
  if (transferAccounts.TransferAccounts.TransferAccounts.length === 0) {
    accountsLoading.value = true
    getAppTransfers(0, 500)
  }
})

</script>
