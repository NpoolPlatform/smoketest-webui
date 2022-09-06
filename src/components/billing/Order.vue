<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :rows-per-page-options='[10]'
    :loading='orderLoading'
    @row-click='(evt, row, index) => onRowClick(row as Order)'
  >
    <template #top-right>
      <q-select v-model='selectedOrderType' :options='OrderTypes' />
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

  <q-dialog
    v-model='orderInfoDialog'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_ORDER_INFO') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_ORDER_ID') }}: {{ currentOrder?.ID }}</q-item-label>
        <q-item-label>{{ $t('MSG_USER_ID') }}: {{ currentOrder?.UserID }}</q-item-label>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ currentOrder?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ currentOrder?.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_COINTYPE_ID') }}: {{ currentOrder?.CoinTypeID }}</q-item-label>
        <q-item-label>{{ $t('MSG_COINNAME') }}: {{ currentOrder?.CoinName }} {{ currentOrder?.Units }}</q-item-label>
        <q-item-label>{{ $t('MSG_UNTITS') }}: {{ currentOrder?.Units }}</q-item-label>
        <q-item-label>{{ $t('MSG_PAYMENT_AMOUNT') }}: {{ currentOrder?.PaymentAmount }}</q-item-label>
        <q-item-label>{{ $t('MSG_CREATED_AT') }}: {{ formatTime(currentOrder?.CreatedAt) }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_GOOD_NAME') }}: {{ currentOrder?.GoodName }}</q-item-label>
        <q-item-label>{{ $t('MSG_PERIOD_DAYS') }}: {{ currentOrder?.GoodServicePeriodDays }}</q-item-label>
        <q-item-label>{{ $t('MSG_ORDER_TYPE') }}: {{ currentOrder?.OrderType }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_ORDER_STATE') }}: {{ currentOrder?.State }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-item-label> <span>Only offline orders can be Canceled!</span></q-item-label>
      </q-item>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_CANCEL_ORDER")' @click='cancelOrder' :disable='currentOrder.OrderType !== OrderType.Offline' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  formatTime,
  NotificationType,
  PriceCoinName,
  useApplicationStore
} from 'npool-cli-v2'
import { NotifyType, Order, OrderState, useAdminOrderStore, OrderType, OrderTypes } from 'npool-cli-v4'
import { onMounted, ref, computed } from 'vue'
import { saveAs } from 'file-saver'
import { AppID } from 'src/const/const'
const goodId = ref('')
const start = ref('')
const end = ref('')

const order = useAdminOrderStore()
const selectedOrderType = ref('ALL')
const displayOrders = computed(() => order.Orders.filter((el) => {
  let display = el.GoodID.includes(goodId.value)
  if (start.value.length) {
    display = display && (el.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  if (selectedOrderType.value !== 'ALL') {
    display = display && (el.OrderType === selectedOrderType.value)
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

const orderLoading = ref(false)
const getAppOrders = (offset: number, limit: number) => {
  order.getAppOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (orders: Array<Order>, error: boolean) => {
    if (error || orders.length < limit) {
      orderLoading.value = false
      return
    }
    getAppOrders(offset + limit, limit)
  })
}

onMounted(() => {
  if (order.Orders.length === 0) {
    orderLoading.value = true
    getAppOrders(0, 500)
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

const orderInfoDialog = ref(false)
const currentOrder = ref({} as Order)
const onRowClick = (row: Order) => {
  orderInfoDialog.value = true
  currentOrder.value = { ...row }
}
const onMenuHide = () => {
  currentOrder.value = {} as Order
  orderInfoDialog.value = false
}
const cancelOrder = () => {
  order.updateUserOrder({
    ID: currentOrder.value.ID,
    TargetUserID: currentOrder.value.UserID,
    PaymentID: currentOrder.value.PaymentID,
    Canceled: true,
    Message: {}
  }, (order: Order, error: boolean) => {
    if (error) {
      return
    }
    orderInfoDialog.value = false
  })
}
const onCancel = () => {
  onMenuHide()
}
</script>
