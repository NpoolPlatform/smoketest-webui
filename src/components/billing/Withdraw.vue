<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_RECORDS")'
    :rows='withdraws'
    :columns='withdrawColumns'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, useAdminLedgerWithdrawStore, Withdraw } from 'npool-cli-v4'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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
    if (error || rows.length === 0) {
      return
    }
    getAppWithdraws(offset + limit, limit)
  })
}

const withdrawColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COINTYPE_ID'),
    field: (row: Withdraw) => row.CoinTypeID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    field: (row: Withdraw) => row.Address
  },
  {
    name: 'CoinName',
    label: t('MSG_COINNAME'),
    field: (row: Withdraw) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    field: (row: Withdraw) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: Withdraw) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: Withdraw) => formatTime(row.CreatedAt)
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    field: (row: Withdraw) => row.Message
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    field: (row: Withdraw) => row.State
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    field: (row: Withdraw) => row.AddressLabels?.join(',')
  }
])

</script>
