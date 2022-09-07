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
          v-model='username'
          :label='$t("MSG_USERNAME")'
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
import { NotifyType, TransferAccount, useAdminTransferAccountStore, useAdminUserStore, User } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const transferAccounts = useAdminTransferAccountStore()

interface TFAccount extends TransferAccount {
  PhoneNO: string;
  EmailAddress: string;
}

const displayAccounts = computed(() => {
  const data = [] as Array<TFAccount>
  transferAccounts.TransferAccounts.TransferAccounts.forEach((el) => {
    const targetUser = user.getUserByID(el.UserID)
    data.push({ ...el, ...{ PhoneNO: targetUser.PhoneNO, EmailAddress: targetUser.EmailAddress } })
  })
  return data.filter((el) => el.EmailAddress.includes(username.value) || el.PhoneNO.includes(username.value))
})
const accountsLoading = ref(false)
const username = ref('')

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

const user = useAdminUserStore()
const getUsers = (offset: number, limit: number) => {
  user.getUsers({
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
  }, (resp: Array<User>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getUsers(offset + limit, limit)
  })
}
onMounted(() => {
  if (transferAccounts.TransferAccounts.TransferAccounts.length === 0) {
    accountsLoading.value = true
    getAppTransfers(0, 500)
  }
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }
})

</script>
