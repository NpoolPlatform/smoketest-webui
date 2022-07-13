<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_EXPORT")'
        @click='onExport'
      />
      <q-input
        dense
        class='small'
        v-model='goodId'
        :label='$t("MSG_GOOD_ID")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='start'
        :label='$t("MSG_START")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='end'
        :label='$t("MSG_END")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { saveAs } from 'file-saver'
import {
  NotificationType,
  OrderBase,
  PaymentState,
  useAdminGoodStore,
  useAdminBillingStore,
  useAdminOrderStore,
  useUsersStore,
  useApplicationStore,
  formatTime
} from 'npool-cli-v2'
import { AppID } from 'src/const/const'
import { computed, onMounted, ref } from 'vue'

interface MyOrder extends OrderBase {
  GoodName: string
  PaymentState: PaymentState
  PaymentID: string
  Amount: number
  CoinUSDCurrency: number
  Username: string
}

const billing = useAdminBillingStore()
const payments = computed(() => billing.Payments)

const good = useAdminGoodStore()
const user = useUsersStore()
const application = useApplicationStore()

const order = useAdminOrderStore()
const orders = computed(() => {
  return Array.from(order.BaseOrders).map((el) => {
    const o = el as MyOrder

    o.PaymentState = 'MSG_NOT_AVAILABLE' as PaymentState
    o.GoodName = ''
    o.PaymentID = ''
    o.Amount = 0
    o.CoinUSDCurrency = 0
    o.Username = ''

    if (payments.value) {
      const index = payments.value.findIndex((pel) => pel.OrderID === el.ID)
      if (index >= 0) {
        o.PaymentState = payments.value[index].State as PaymentState
        o.PaymentID = payments.value[index].ID
        o.Amount = payments.value[index].Amount
        o.CoinUSDCurrency = payments.value[index].CoinUSDCurrency ? payments.value[index].CoinUSDCurrency : 1
      }
    }

    const index = good.Goods.findIndex((gel) => gel.Good.Good.ID === el.GoodID)
    if (index >= 0) {
      o.GoodName = good.Goods[index].Good.Good.Title
    }

    const u = user.getUserByID(el.UserID)
    if (u) {
      o.Username = (u.User.EmailAddress?.length ? u.User.EmailAddress : u.User.PhoneNO) as string
    }

    return o
  })
})

const goodId = ref('')
const start = ref('')
const end = ref('')

const displayOrders = computed(() => orders.value.filter((el) => {
  let display = el.GoodID.includes(goodId.value)
  if (start.value.length) {
    display = display && (el.CreateAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreateAt <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

const onExport = () => {
  let orderStr = ''
  displayOrders.value.forEach((el) => {
    const obj = el as unknown as Record<string, unknown>
    if (!orderStr.length) {
      Object.keys(obj).forEach((k) => {
        if (orderStr.length) {
          orderStr += ';'
        }
        orderStr += k
      })
    }
    orderStr += '\n'
    let lineStr = ''
    Object.values(obj).forEach((v) => {
      if (lineStr.length) {
        lineStr += ';'
      }
      lineStr += v
    })
    orderStr += lineStr
  })

  const blob = new Blob([orderStr], { type: 'text/plain;charset=utf-8' })
  const filename = application.Application.App.Name + '-Users-' +
                   formatTime(new Date().getTime() / 1000) +
                   '.csv'
  saveAs(blob, filename)
}

const prepare = () => {
  order.getBaseOrders({
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
}

onMounted(() => {
  prepare()
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

  application.getApplication({
    ID: AppID,
    Message: {
      Error: {
        Title: 'MSG_GET_APP',
        Message: 'MSG_GET_APP_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
