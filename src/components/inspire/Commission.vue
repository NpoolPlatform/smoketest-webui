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
          flat
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
    :rows='purchaseAmountSettings'
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
        <q-input v-model='target.Amount' :label='$t("MSG_AMOUNT")' />
        <q-input v-model='target.Percent' :label='$t("MSG_PERCENT")' />
        <q-input v-model='target.BadgeLarge' :label='$t("MSG_BADGE_LARGE")' />
        <q-input v-model='target.BadgeSmall' :label='$t("MSG_BADGE_SMALL")' />
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Start' :label='$t("MSG_START")' />
        <q-input v-model='target.End' :label='$t("MSG_END")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useAdminInspireStore, NotificationType, useCoinStore, CommissionCoinSetting, PurchaseAmountSetting, useUsersStore, AppUser, InvalidID } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const user = useUsersStore()

interface CoinSetting extends CommissionCoinSetting {
  CoinName: string
}

const inspire = useAdminInspireStore()
const setting = computed(() => inspire.CommissionSetting ? [inspire.CommissionSetting] : [])
const coinSettings = computed(() => Array.from(inspire.CommissionCoinSettings).map((el) => {
  const s = el as unknown as CoinSetting
  s.CoinName = coin.getCoinByID(s.CoinTypeID)?.Name
  return s
}))
const purchaseAmountSettings = computed(() => inspire.PurchaseAmountSettings)

const users = computed(() => Array.from(user.Users.filter((el) => purchaseAmountSettings.value.findIndex((setting) => setting.UserID === el.User.ID) < 0).map((el) => el.User)))
const selectedUser = ref([] as Array<AppUser>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

onMounted(() => {
  inspire.getCommissionSetting({
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

  inspire.getCommissionCoinSettings({
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

  inspire.getPurchaseAmountSettings({
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

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  if (selectedUser.value.length > 0) {
    target.value.UserID = selectedUser.value[0].ID as string
  }

  inspire.createPurchaseAmountSetting({
    TargetUserID: target.value.UserID,
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CREATE_PURCHASE_AMOUNT_SETTING_FAIL'),
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
}

</script>
