<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COMMISSION_SETTING")'
    :rows='setting'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_COMMISSION_COIN_SETTINGS")'
    :rows='coinSettings'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_PURCHASE_AMOUNT_SETTINGS")'
    :rows='amountSettings'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_PURCHASE_AMOUNT_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <AppUserSelector v-model:id='target.UserID' />
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='target.GoodID' />
        <q-input type='number' v-model.number='target.Amount' :label='$t("MSG_AMOUNT")' />
        <q-input type='number' v-model.number='target.Percent' :label='$t("MSG_PERCENT")' suffix='%' />
        <q-input type='number' v-model='target.BadgeLarge' :label='$t("MSG_BADGE_LARGE")' />
        <q-input type='number' v-model='target.BadgeSmall' :label='$t("MSG_BADGE_SMALL")' />
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <DatePicker v-model:date='target.Start' :label='$t("MSG_START")' />
        <DatePicker v-model:date='target.End' :label='$t("MSG_END")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  CommissionCoinSetting,
  PurchaseAmountSetting,
  useCommissionStore,
  usePurchaseAmountSettingStore
} from 'npool-cli-v2'
import { InvalidID, useAdminAppCoinStore, useAdminAppGoodStore, useAdminUserStore } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))
const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))

interface CoinSetting extends CommissionCoinSetting {
  CoinName: string
}

interface AmountSetting extends PurchaseAmountSetting {
  EmailAddress: string
  PhoneNO: string
  GoodName: string
}

interface MyPurchaseAmountSetting extends PurchaseAmountSetting {
  UserID: string;
}

const coin = useAdminAppCoinStore()
const user = useAdminUserStore()
const good = useAdminAppGoodStore()

const commission = useCommissionStore()
const setting = computed(() => commission.CommissionSetting ? [commission.CommissionSetting] : [])
const coinSettings = computed(() => Array.from(commission.CommissionCoinSettings).map((el) => {
  const s = el as CoinSetting
  s.CoinName = coin.getCoinByID(s.CoinTypeID)?.Name as string
  return s
}))

const purchaseAmount = usePurchaseAmountSettingStore()
const purchaseAmountSettings = computed(() => purchaseAmount.PurchaseAmountSettings)
const amountSettings = computed(() => Array.from(purchaseAmountSettings.value).map((el) => {
  const s = el as AmountSetting
  s.EmailAddress = user.getUserByID(s.UserID as string)?.EmailAddress
  s.PhoneNO = user.getUserByID(s.UserID as string)?.PhoneNO
  s.GoodName = good.getGoodByID(el.GoodID)?.GoodName as string
  return s
}))

const showing = ref(false)
const target = ref({ UserID: InvalidID, GoodID: InvalidID } as MyPurchaseAmountSetting)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = { UserID: InvalidID, GoodID: InvalidID } as MyPurchaseAmountSetting
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  if (target.value.Start <= 0) {
    return
  }
  purchaseAmount.createUserPurchaseAmountSetting({
    TargetUserID: target.value.UserID,
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
  onMenuHide()
}

onMounted(() => {
  commission.getCommissionSetting({
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_SETTING'),
        Message: t('MSG_GET_COMMISSION_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  commission.getCommissionCoinSettings({
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_COIN_SETTING'),
        Message: t('MSG_GET_COMMISSION_COIN_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  purchaseAmount.getPurchaseAmountSettings({
    Message: {
      Error: {
        Title: t('MSG_GET_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_GET_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }
})

</script>
