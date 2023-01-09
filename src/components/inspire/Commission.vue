<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COMMISSION_SETTINGS")'
    :rows='commissions'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
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
        <span>{{ $t('MSG_UPDATE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <!-- <AppUserSelector v-model:id='target.UserID' /> -->
      </q-card-section>
      <q-card-section>
        <!-- <AppGoodSelector v-model:id='target.GoodID' /> -->
        <q-input type='number' v-model.number='target.Percent' :label='$t("MSG_PERCENT")' suffix='%' />
        <!-- <q-input type='number' v-model='target.BadgeLarge' :label='$t("MSG_BADGE_LARGE")' /> -->
        <!-- <q-input type='number' v-model='target.BadgeSmall' :label='$t("MSG_BADGE_SMALL")' /> -->
        <!-- <q-input v-model='target.Title' :label='$t("MSG_TITLE")' /> -->
        <DatePicker v-model:date='target.StartAt' :label='$t("MSG_START")' />
        <!-- <DatePicker v-model:date='target.EndAt' :label='$t("MSG_END")' /> -->
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <RegistrationCard />
</template>

<script setup lang='ts'>
import { NotifyType, SettleType, SettleTypes } from 'npool-cli-v4'
import { useAdminCommissionStore } from 'src/teststore/commission'
import { Commission } from 'src/teststore/commission/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))
const RegistrationCard = defineAsyncComponent(() => import('src/components/inspire/Registration.vue'))

const commission = useAdminCommissionStore()
const commissions = computed(() => commission.Commissions.Commissions)

const target = ref({} as Commission)
const showing = ref(false)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Commission
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  commission.updateCommission({
    ID: target.value.ID,
    Value: `${target.value.Percent}`,
    StartAt: target.value.StartAt,
    Message: {
      Error: {
        Title: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (commission.Commissions.Commissions.length === 0) {
    SettleTypes.forEach((type) => {
      getCommissions(0, 500, type)
    })
  }
})

const getCommissions = (offset: number, limit: number, settleType: SettleType) => {
  commission.getCommissions({
    Offset: offset,
    Limit: limit,
    SettleType: settleType,
    Message: {
      Error: {
        Title: t('MSG_GET_PURCHASE_AMOUNT_SETTINGS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Commission>) => {
    if (error || rows.length < limit) {
      return
    }
    getCommissions(offset + limit, limit, settleType)
  })
}
</script>
