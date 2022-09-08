<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TRANSFER_ACCOUNTS")'
    :rows='displayAccounts'
    row-key='ID'
    :loading='accountsLoading'
    :rows-per-page-options='[20]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_EMAIL_ADDRESS")'
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
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface TFAccount extends TransferAccount {
  PhoneNO: string;
  EmailAddress: string;
}
const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: TFAccount) => row.ID,
    sortable: true
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: TFAccount) => row.AppID,
    sortable: true
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: TFAccount) => row.UserID,
    sortable: true
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: TFAccount) => row.EmailAddress,
    sortable: true
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: TFAccount) => row.PhoneNO,
    sortable: true
  },
  {
    name: 'TargetUserID',
    label: t('MSG_TARGET_USER_ID'),
    field: (row: TFAccount) => row.TargetUserID,
    sortable: true
  },
  {
    name: 'TargetEmailAddress',
    label: t('MSG_TARGET_EMAIL_ADDRESS'),
    field: (row: TFAccount) => row.TargetEmailAddress,
    sortable: true
  },
  {
    name: 'TargetPhoneNO',
    label: t('MSG_TARGET_PHONE_NO'),
    field: (row: TFAccount) => row.TargetPhoneNO,
    sortable: true
  },
  {
    name: 'TargetUsername',
    label: t('MSG_TARGET_USERNAME'),
    field: (row: TFAccount) => row.TargetUsername,
    sortable: true
  },
  {
    name: 'TargetFirstName',
    label: t('MSG_TARGET_FIRST_NAME'),
    field: (row: TFAccount) => row.TargetFirstName,
    sortable: true
  },
  {
    name: 'TargetFirstName',
    label: t('MSG_TARGET_LAST_NAME'),
    field: (row: TFAccount) => row.TargetLastName,
    sortable: true
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: TFAccount) => row.CreatedAt,
    sortable: true
  }
])
const transferAccounts = useAdminTransferAccountStore()

const displayAccounts = computed(() => {
  const data = [] as Array<TFAccount>
  transferAccounts.TransferAccounts.TransferAccounts.forEach((el) => {
    const targetUser = user.getUserByID(el.UserID)
    data.push({ ...el, ...{ PhoneNO: targetUser?.PhoneNO, EmailAddress: targetUser?.EmailAddress } })
  })
  return data.filter((el) => el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value))
})
const accountsLoading = ref(false)
const username = ref('')

const user = useAdminUserStore()

onMounted(() => {
  if (transferAccounts.TransferAccounts.TransferAccounts.length === 0) {
    accountsLoading.value = true
    getAppTransfers(0, 500)
  }
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }
})
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
</script>
