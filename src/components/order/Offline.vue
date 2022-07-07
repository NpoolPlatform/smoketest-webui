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
  <Order />
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
        <q-select :options='users' v-model='selectedUser' :label='$t("MSG_USER")' />
        <q-input
          v-model='units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='0'
          :max='maxUnits'
          :suffix='selectedGood?.value?.Good?.Good?.Unit'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
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
  UserInfo,
  NotificationType,
  useStockStore,
  Stock,
  useCoinStore,
  useOrderStore,
  useAdminOrderStore,
  useGoodStore,
  useUsersStore
} from 'npool-cli-v2'
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Order = defineAsyncComponent(() => import('src/components/billing/Order.vue'))

interface MyGood {
  label: string
  value: Good
}

const good = useGoodStore()
const agood = useAdminGoodStore()
const stock = useStockStore()
const order = useAdminOrderStore()
const forder = useOrderStore()
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
  if (index >= 0 && appGoods[index].Visible && appGoods[index].Online) {
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
  value: UserInfo
}

const user = useUsersStore()
const users = computed(() => Array.from(user.Users).map((el) => {
  return {
    label: el.User.EmailAddress?.length ? el.User.EmailAddress : el.User.PhoneNO,
    value: el
  } as MyUser
}))

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

const prepare = () => {
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

const onSubmit = () => {
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

  order.submitOrder({
    TargetUserID: selectedUser.value.value.User.ID as string,
    GoodID: selectedGood.value.value.Good.Good.ID as string,
    Units: units.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (orderID: string, error: boolean) => {
    if (error) {
      return
    }

    forder.createPayment({
      PaymentCoinTypeID: payCoinID.value as string,
      OrderID: orderID,
      Message: {
        Error: {
          Title: t('MSG_CREATE_PAYMENT'),
          Message: t('MSG_CREATE_PAYMENT_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      showing.value = false
    })
  })
}

const onCancel = () => {
  onMenuHide()
}

</script>
