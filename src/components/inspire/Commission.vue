<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreatePurchaseAmountSettingClick'
        />
      </div>
    </template>
  </q-table>
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
          @click='onCreatePurchaseAmountSettingClick'
        />
      </div>
    </template>
  </q-table>
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
        <span>{{ $t('MSG_USERNAME') }}: {{ selectedUser[0]?.EmailAddress?.length ? selectedUser[0]?.EmailAddress : selectedUser[0]?.PhoneNO }}</span>
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Amount' :label='$t("MSG_AMOUNT")' />
        <q-input type='number' v-model='target.Percent' :label='$t("MSG_PERCENT")' />
        <q-input v-model='target.BadgeLarge' :label='$t("MSG_BADGE_LARGE")' />
        <q-input v-model='target.BadgeSmall' :label='$t("MSG_BADGE_SMALL")' />
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='date' v-model='end' :label='$t("MSG_END")' />
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
  useCoinStore,
  CommissionCoinSetting,
  PurchaseAmountSetting,
  useUsersStore,
  AppUser,
  InvalidID,
  useCommissionStore,
  usePurchaseAmountSettingStore
} from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const user = useUsersStore()

interface CoinSetting extends CommissionCoinSetting {
  CoinName: string
}

interface AmountSetting extends PurchaseAmountSetting {
  EmailAddress: string
  PhoneNO: string
}

const commission = useCommissionStore()
const setting = computed(() => commission.CommissionSetting ? [commission.CommissionSetting] : [])
const coinSettings = computed(() => Array.from(commission.CommissionCoinSettings).map((el) => {
  const s = el as unknown as CoinSetting
  s.CoinName = coin.getCoinByID(s.CoinTypeID)?.Name as string
  return s
}))

const purchaseAmount = usePurchaseAmountSettingStore()
const purchaseAmountSettings = computed(() => purchaseAmount.PurchaseAmountSettings)

const users = computed(() => Array.from(user.Users).map((el) => el.User))
const selectedUser = ref([] as Array<AppUser>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => {
  return user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
}))

const amountSettings = computed(() => Array.from(purchaseAmountSettings.value).map((el) => {
  const s = el as unknown as AmountSetting
  s.EmailAddress = user.getUserByID(s.UserID)?.User?.EmailAddress as string
  s.PhoneNO = user.getUserByID(s.UserID)?.User?.PhoneNO as string
  return s
}))

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

  coin.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
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
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const showing = ref(false)
const target = ref({
  UserID: InvalidID
} as unknown as PurchaseAmountSetting)
const start = ref('')
watch(start, () => {
  target.value.Start = new Date(start.value).getTime() / 1000
})
const end = ref('')
watch(end, () => {
  target.value.End = new Date(end.value).getTime() / 1000
})

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  if (target.value.Start <= 0) {
    return
  }

  if (selectedUser.value.length > 0) {
    target.value.UserID = selectedUser.value[0].ID as string
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

const onCancel = () => {
  onMenuHide()
}

const onCreatePurchaseAmountSettingClick = () => {
  showing.value = true
  target.value = {
    UserID: InvalidID
  } as unknown as PurchaseAmountSetting
  start.value = ''
}

</script>
