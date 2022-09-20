<template>
  <div class='row'>
    <q-space />
    <q-btn
      dense
      flat
      class='btn flat'
      :label='$t("MSG_CREATE")'
      @click='onCreate'
    />
  </div>
  <OrderPage />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_OFFLINE_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ goodStock?.Total }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ goodStock?.Locked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ goodStock?.InService }}</q-item-label>
        <q-select :options='goods' v-model='selectedGood' :label='$t("MSG_GOOD")' />
        <q-select
          :options='displayUsers'
          use-input
          v-model='selectedUser'
          :label='$t("MSG_USER")'
          @filter='filterUser'
        />
        <q-input
          v-model='units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='0'
          :max='maxUnits'
          :suffix='selectedGood?.value?.Good?.Good?.Unit'
        />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' @click='onSubmit' :label='$t("MSG_SUBMIT")' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import {
  useAdminGoodStore,
  Good,
  NotificationType,
  useStockStore,
  Stock,
  useCoinStore,
  useGoodStore
} from 'npool-cli-v2'
import { NotifyType, useAdminUserStore, User, useAdminOrderStore, Order, OrderType } from 'npool-cli-v4'
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

interface MyGood {
  label: string
  value: Good
}

const good = useGoodStore()
const agood = useAdminGoodStore()
const stock = useStockStore()
const coin = useCoinStore()
const payCoinID = computed(() => {
  const index = coin.Coins.findIndex((el) => {
    return (el.ENV === selectedGood.value?.value.Main?.ENV) && (el.Name?.toLowerCase().replace(/ /, '').includes('usdttrc20') || el.Name?.toLowerCase().replace(/ /, '').includes('tethertrc20'))
  })
  if (index < 0) {
    return undefined as unknown as string
  }
  return coin.Coins[index].ID
})

const goods = computed(() => Array.from(agood.Goods.filter((el) => {
  const appGoods = good.AppGoods
  if (!appGoods) {
    return false
  }

  const index = appGoods.findIndex((gel) => gel.GoodID === el.Good.Good.ID)
  if (index >= 0 && /* appGoods[index].Visible && */ appGoods[index].Online) {
    return true
  }
  return false
})).map((el) => {
  return {
    label: el.Good.Good.Title,
    value: el
  } as MyGood
}))

interface MyUser {
  label: string
  value: User
}

const user = useAdminUserStore()
const users = computed(() => user.Users.Users.map((el) => {
  return {
    label: el.EmailAddress?.length ? el.EmailAddress : el.PhoneNO,
    value: el
  } as MyUser
}))
const displayUsers = ref(users.value)
const filterUser = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayUsers.value = users.value.filter((el) => {
      return el.value.EmailAddress?.toLowerCase().includes(val.toLowerCase()) || el.value.PhoneNO?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const selectedGood = ref(undefined as unknown as MyGood)
const goodStock = computed(() => {
  const index = stock.Stocks.findIndex((el) => el.GoodID === selectedGood.value?.value.Good.Good.ID)
  if (index < 0) {
    return undefined as unknown as Stock
  }
  return stock.Stocks[index]
})
const selectedUser = ref(undefined as unknown as MyUser)
const units = ref(0)
const maxUnits = computed(() => goodStock.value?.Total - (goodStock.value?.Locked as number) - (goodStock.value?.InService as number))

const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  selectedGood.value = undefined as unknown as MyGood
  selectedUser.value = undefined as unknown as MyUser
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
const prepare = () => {
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }

  agood.getAllGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  good.getAppGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const order = useAdminOrderStore()
onMounted(() => {
  prepare()

  stock.getStocks({
    Message: {
      Error: {
        Title: t('MSG_GET_STOCKS'),
        Message: t('MSG_GET_STOCKS_FAIL'),
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
})

const onSubmit = (done: ()=> void) => {
  if (units.value > maxUnits.value) {
    console.log('purchase units', units.value, 'max units', maxUnits.value)
    return
  }
  if (!selectedGood.value) {
    console.log('please select good')
    return
  }
  if (!selectedUser.value) {
    console.log('please select user')
    return
  }
  if (!payCoinID.value || payCoinID.value.length === 0) {
    console.log('pay coin is missed')
    return
  }
  order.createUserOrder({
    TargetUserID: selectedUser.value.value.ID,
    GoodID: selectedGood.value.value.Good.Good.ID as string,
    Units: units.value,
    PaymentCoinID: payCoinID.value,
    OrderType: OrderType.Offline,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (order: Order, error: boolean) => {
    done()
    if (error) {
      return
    }
    showing.value = false
  })
}

const onCancel = () => {
  onMenuHide()
}

</script>
