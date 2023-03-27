<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COMMISSION_SETTINGS")'
    :rows='displayCommissions'
    row-key='ID'
    :rows-per-page-options='[50]'
    @row-click='(evt, row, index) => onRowClick(row as Commission)'
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
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CLONE")'
          @click='onClone'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_RECONCILE")'
          @click='onReconcile'
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
        <span>{{ updating ? $t('MSG_UPDATE_COMMISSION_SETTING') : $t('MSG_CREATE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <AppGoodSelector v-model:id='target.GoodID' />
        <AppUserSelector v-model:id='target.UserID' />
        <q-select :options='SettleTypes' v-model='target.SettleType' :label='$t("MSG_COMMISSION_SETTLE_TYPE")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model.number='target.Percent' :label='$t("MSG_PERCENT")' suffix='%' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model='showing1'
    @hide='onMenuHide1'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CLONE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='cloneCommission.FromGoodID' />
        <AppGoodSelector v-model:id='cloneCommission.ToGoodID' />
        <q-input type='number' v-model='cloneCommission.Value' :label='$t("MSG_SCALE")' suffix='%' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_CLONE")' @click='onSubmit1' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel1' />
      </q-item>
    </q-card>
  </q-dialog>

  <!-- reconcile -->
  <q-dialog
    v-model='showing2'
    @hide='onMenuHide2'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_RECONCILE') }}</span>
      </q-card-section>
      <q-card-section>
        <AppUserSelector v-model:id='reconcileRequest.TargetUserID' />
        <AppGoodSelector v-model:id='reconcileRequest.GoodID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_RECONCILE")' @click='onSubmit2' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel2' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, SettleType, useAdminCommissionStore, Commission, SettleTypes, useAdminReconcileStore } from 'npool-cli-v4'
import { ReconcileRequest } from 'npool-cli-v4/dist/store/admin/inspire/reconcile/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const commission = useAdminCommissionStore()
const commissions = computed(() => commission.Commissions.Commissions)

const username = ref('')
const displayCommissions = computed(() => commissions.value.filter((el) => {
  const name = username.value.toLowerCase()
  return el.EmailAddress.toLowerCase().includes(name) || el.PhoneNO.toLowerCase().includes(name)
}))

const target = ref({} as Commission)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as Commission
  showing.value = true
  updating.value = false
}
const onRowClick = (row: Commission) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as Commission
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCommission(done) : createUserCommission(done)
}

const updateCommission = (done: () => void) => {
  commission.updateCommission({
    ID: target.value.ID,
    Value: `${target.value.Percent}`,
    StartAt: target.value.StartAt,
    SettleType: target.value.SettleType,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_USER_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_UPDATE_USER_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_USER_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_UPDATE_USER_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Success
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
const createUserCommission = (done: () => void) => {
  commission.createUserCommission({
    TargetUserID: target.value.UserID,
    StartAt: target.value.StartAt,
    GoodID: target.value.GoodID,
    SettleType: target.value.SettleType,
    Value: `${target.value.Percent}`,
    Message: {
      Error: {
        Title: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CREATE_USER_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Success
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
interface CloneCommission {
  FromGoodID: string;
  ToGoodID: string;
  Value: string;
}

const cloneCommission = ref({} as CloneCommission)
const showing1 = ref(false)

const onMenuHide1 = () => {
  showing1.value = false
  cloneCommission.value = {} as CloneCommission
}

const onClone = () => {
  showing1.value = true
  cloneCommission.value = {} as CloneCommission
}

const onCancel1 = () => {
  onMenuHide1()
}

const onSubmit1 = (done: () => void) => {
  commission.cloneCommissions({
    ...cloneCommission.value,
    Message: {
      Error: {
        Title: t('MSG_CLONE_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CLONE_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CLONE_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CLONE_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide1()
  })
}

const reconcileRequest = ref({} as ReconcileRequest)
const showing2 = ref(false)

const onMenuHide2 = () => {
  showing2.value = false
  reconcileRequest.value = {} as ReconcileRequest
}

const onCancel2 = () => {
  onMenuHide2()
}
const onReconcile = () => {
  showing2.value = true
  reconcileRequest.value = {} as ReconcileRequest
}

const reconcile = useAdminReconcileStore()
const onSubmit2 = (done: () => void) => {
  reconcile.reconcile({
    ...reconcileRequest.value,
    Message: {
      Error: {
        Title: t('MSG_RECONCILE'),
        Message: t('MSG_RECONCILE_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_RECONCILE'),
        Message: t('MSG_RECONCILE_FAIL'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide2()
  })
}

onMounted(() => {
  if (commission.Commissions.Commissions.length === 0) {
    getAppCommissions(0, 500)
  }
})

const getAppCommissions = (offset: number, limit: number) => {
  commission.getAppCommissions({
    Offset: offset,
    Limit: limit,
    SettleType: SettleType.GoodOrderPercent,
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
    getAppCommissions(offset + limit, limit)
  })
}
</script>
