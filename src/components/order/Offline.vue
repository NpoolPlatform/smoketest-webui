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
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ good?.Total }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ good?.Locked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ good?.InService }}</q-item-label>
        <AppGoodSelector v-model:id='target.GoodID' />
        <AppUserSelector v-model:id='target.TargetUserID' />
        <CoinPicker v-model:id='target.PaymentCoinID' hidden-disabled-coins />
        <q-input
          v-model='target.Units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='1'
          :max='maxUnits'
          :suffix='good?.Unit'
          :rules='[ val => val <= maxUnits || `Max Purchase Units: ${maxUnits}`]'
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
import { NotifyType, useAdminOrderStore, Order, OrderType, useAdminAppGoodStore, useAdminAppCoinStore } from 'npool-cli-v4'
import { CreateUserOrderRequest } from 'npool-cli-v4/dist/store/admin/order/order/types'
import { getCoins } from 'src/api/coin'
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

const coin = useAdminAppCoinStore()

const appGood = useAdminAppGoodStore()
const good = computed(() => appGood.getGoodByID(target.value?.GoodID))
const maxUnits = computed(() => !good.value ? 0 : (Number(good.value.Total) - Number(good.value.Locked) - Number(good.value.InService)))

const target = ref({
  OrderType: OrderType.Offline,
  Units: '1'
} as CreateUserOrderRequest)

const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    OrderType: OrderType.Offline,
    Units: '1'
  } as CreateUserOrderRequest
}

const onCancel = () => {
  onMenuHide()
}

const order = useAdminOrderStore()
const onSubmit = (done: ()=> void) => {
  if (Number(target.value?.Units) > maxUnits.value) {
    console.log('purchase units', target.value?.Units, 'max units', maxUnits.value)
    done()
    return
  }
  order.createUserOrder({
    ...target.value,
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
    onMenuHide()
  })
}

onMounted(() => {
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }
})
</script>
