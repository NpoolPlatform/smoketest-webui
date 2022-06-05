<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENTS")'
    :rows='displayPayments'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='searchStr'
        :label='$t("MSG_SEARCH")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  Payment,
  useChurchAccountStore,
  useAdminGoodStore,
  useCoinStore,
  useUsersStore,
  useAdminOrderStore,
  useAdminBillingStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const user = useUsersStore()
const users = computed(() => user.Users)

const good = useAdminGoodStore()
const account = useChurchAccountStore()

const coin = useCoinStore()

const order = useAdminOrderStore()

const billing = useAdminBillingStore()
const payments = computed(() => billing.Payments)

interface MyPayment extends Payment {
  EmailAddress: string
  PhoneNO: string
  GoodName: string
  Address: string
  CoinName: string
}

const myPayments = computed(() => Array.from(payments.value).map((el) => {
  const myPayment = el as MyPayment
  const userIdx = users.value.findIndex((uel) => uel.User.ID === el.UserID)
  if (userIdx >= 0) {
    myPayment.EmailAddress = users.value[userIdx].User.EmailAddress as string
    myPayment.PhoneNO = users.value[userIdx].User.PhoneNO as string
  }
  const coinIdx = coin.Coins.findIndex((cel) => cel.ID === el.CoinInfoID)
  if (coinIdx >= 0) {
    myPayment.CoinName = coin.Coins[coinIdx].Name as string
  }
  const accountIdx = account.Accounts.findIndex((ael) => ael.ID === el.AccountID)
  if (accountIdx >= 0) {
    myPayment.Address = account.Accounts[accountIdx].Address
  }
  const goodIdx = good.Goods.findIndex((gel) => gel.Good.Good.ID === el.GoodID)
  if (goodIdx >= 0) {
    myPayment.GoodName = good.Goods[goodIdx].Good.Good.Title
  }
  return myPayment
}))

const searchStr = ref('')
const displayPayments = computed(() => myPayments.value.filter((el) => {
  return el.EmailAddress?.toLowerCase()?.includes(searchStr.value) ||
        el.GoodName?.toLowerCase()?.includes(searchStr.value) ||
        el.State?.toLowerCase()?.includes(searchStr.value) ||
        el.CoinName?.toLowerCase()?.includes(searchStr.value) ||
        el.GoodID?.toLowerCase()?.includes(searchStr.value) ||
        el.UserID?.toLowerCase()?.includes(searchStr.value) ||
        el.ID?.toLowerCase()?.includes(searchStr.value)
}))

const prepare = () => {
  billing.getPayments({
    Message: {
      Error: {
        Title: 'MSG_GET_PAYMENTS',
        Message: 'MSG_GET_PAYMENTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  user.getUsers({
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  good.getAllGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_ALL_GOODS',
        Message: 'MSG_GET_ALL_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  account.getAccounts({
    Message: {
      Error: {
        Title: 'MSG_GET_ACCOUNTS',
        Message: 'MSG_GET_ACCOUNTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  order.getOrders({
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
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
