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
  <q-item>
    <span>{{ $t('MSG_TOTAL_SOLD') }}: {{ soldUnits }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_TIMEOUT') }}: {{ paymentTimeouts }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_USDT_AMOUNT') }}: {{ paymentAmount }} {{ PriceCoinName }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_ORDER_USER_COUNT') }}: {{ orderUsers }}</span>
  </q-item>
</template>

<script setup lang='ts'>
import {
  formatTime,
  NotificationType,
  PriceCoinName,
  useApplicationStore
} from 'npool-cli-v2'
import { OrderState, useAdminLocalOrderStore } from 'src/teststore/order'
import { onMounted, ref, computed } from 'vue'
import { saveAs } from 'file-saver'
import { AppID } from 'src/const/const'
const goodId = ref('')
const start = ref('')
const end = ref('')

const order = useAdminLocalOrderStore()

const displayOrders = computed(() => order.Orders.filter((el) => {
  let display = el.GoodID.includes(goodId.value)
  if (start.value.length) {
    display = display && (el.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

const soldUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAID).reduce((sum, b) => sum + b.Units, 0))
const paymentTimeouts = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAYMENT_TIMEOUT).length)
const paymentAmount = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAID).reduce((sum, b) => {
  const currency = Number(b.PaymentCoinUSDCurrency) > 0 ? Number(b.PaymentCoinUSDCurrency) : 1
  return sum + Number(b.PaymentAmount) * currency + Number(b.PayWithBalanceAmount) * currency
}, 0))
const orderUsers = computed(() => {
  const users = new Map<string, number>()
  displayOrders.value.filter((el) => el.State === OrderState.PAID).forEach((el) => {
    let u = users.get(el.UserID)
    if (!u) {
      u = 0
    }
    u += el.Units
    users.set(el.UserID, u)
  })
  return users.size
})
const getAppOrders = (offset: number, limit: number) => {
  order.getAppOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
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
    getAppOrders(offset + limit, limit)
  })
}

onMounted(() => {
  if (order.Orders.length === 0) {
    getAppOrders(0, 100)
  }
  if (application.Application === undefined) {
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
  }
})
const application = useApplicationStore()
const onExport = () => {
  let orderStr = ''
  let createdAtCol = 0
  let paidAtCol = 0
  displayOrders.value.forEach((el) => {
    const obj = el as unknown as Record<string, unknown>
    if (!orderStr.length) {
      Object.keys(obj).forEach((k, col) => {
        if (orderStr.length) {
          orderStr += ';'
        }
        if (k === 'CreatedAt') {
          createdAtCol = col
        }
        if (k === 'PaidAt') {
          paidAtCol = col
        }
        orderStr += k
      })
    }
    orderStr += '\n'
    let lineStr = ''
    Object.values(obj).forEach((v, col) => {
      if (lineStr.length) {
        lineStr += ';'
      }
      if (col === createdAtCol || col === paidAtCol) {
        lineStr += formatTime(Number(v), false)
        return
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
</script>
