<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EVENT_INSPIRE")'
    :rows='displayEvents'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as EventInspire)'
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
        <span>{{ $t('MSG_EVENT_INSPIRE') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <AppGoodSelector v-model:id='target.GoodID' />
        <q-select :options='UsedFors' v-model='target.EventType' :label='$t("MSG_EVENT_YPE")' />
        <CouponSelector v-model:ids='target.Coupons' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Credits' :label='$t("MSG_CREDIT")' />
        <q-input type='number' v-model='target.CreditsPerUSD' :label='$t("MSG_CREDIT_PERUSD")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model.number='target.MaxConsecutive' :label='$t("MSG_MAX_CONSECUTIVE")' />
        <q-input type='number' v-model.number='target.InviterLayers' :label='$t("MSG_INVITER_LAYERS")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useAdminEventInspireStore } from 'src/teststore/coupon/event'
import { EventInspire, UsedFors } from 'src/teststore/coupon/event/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))

const inspire = useAdminEventInspireStore()
const events = computed(() => inspire.EventInspires.EventInspires)

const username = ref('')
const displayEvents = computed(() => events.value.filter((el) => {
  // const name = username.value.toLowerCase()
  return el
}))

const target = ref({} as EventInspire)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as EventInspire
  showing.value = true
  updating.value = false
}
const onRowClick = (row: EventInspire) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as EventInspire
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateEventInspire(done) : createEventInspire(done)
}

const updateEventInspire = (done: () => void) => {
  inspire.updateEventInspire({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_EVENT'),
        Message: t('MSG_UPDATE_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_EVENT'),
        Message: t('MSG_UPDATE_EVENT_SUCCESS'),
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

const createEventInspire = (done: () => void) => {
  inspire.createEventInspire({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_EVENT'),
        Message: t('MSG_CREATE_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_EVENT'),
        Message: t('MSG_CREATE_EVENT_FAIL'),
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

onMounted(() => {
  if (inspire.EventInspires.EventInspires.length === 0) {
    getEventInspires(0, 500)
  }
})

const getEventInspires = (offset: number, limit: number) => {
  inspire.getEventInspires({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<EventInspire>) => {
    if (error || rows.length < limit) {
      return
    }
    getEventInspires(offset + limit, limit)
  })
}
</script>
