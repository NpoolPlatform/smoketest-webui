<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS")'
    :rows='withdrawAddress'
    row-key='ID'
    :rows-per-page-options='[20]'
    :columns='columns'
  />
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { useAdminUserAccountStore, Account, formatTime } from 'npool-cli-v4'
import { getAppUserAccounts } from 'src/api/account'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const account = useAdminUserAccountStore()
const withdrawAddress = computed(() => account.withdrawAddress)

onMounted(() => {
  if (withdrawAddress.value.length === 0) {
    getAppUserAccounts(0, 500)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Account) => row.ID,
    sortable: true
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: Account) => row.AppID,
    sortable: true
  },
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    field: (row: Account) => row.AccountID,
    sortable: true
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    field: (row: Account) => row.Address,
    sortable: true
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: Account) => row.UsedFor,
    sortable: true
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: Account) => row.UserID,
    sortable: true
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: Account) => row.EmailAddress,
    sortable: true
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: Account) => row.PhoneNO,
    sortable: true
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: Account) => row.CoinTypeID,
    sortable: true
  },
  {
    name: 'CoinName',
    label: t('MSG_COINNAME'),
    field: (row: Account) => row.CoinName,
    sortable: true
  },
  {
    name: 'CoinEnv',
    label: t('MSG_COINENV'),
    field: (row: Account) => row.CoinEnv,
    sortable: true
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COINUNIT'),
    field: (row: Account) => row.CoinUnit,
    sortable: true
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: Account) => formatTime(row.CreatedAt),
    sortable: true
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    field: (row: Account) => row.Labels?.join(','),
    sortable: true
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    field: (row: Account) => row.Active,
    sortable: true
  },
  {
    name: 'Blocked',
    label: t('MSG_BLOCKED'),
    field: (row: Account) => row.Blocked,
    sortable: true
  }
])
</script>
