<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DISCOUNTS")'
    :rows='coupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as DiscountCoupon)'
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
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_DISCOUNT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_COUPON_NAME")' />
        <q-input v-model='target.Message' :label='$t("MSG_COUPON_DESCRIPTION")' />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='number' v-model='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' :suffix='$t("MSG_DAYS")' />
        <q-input type='number' v-model='target.Discount' :label='$t("MSG_COUPON_CIRCULATION")' suffix='%' />
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
  useLoginedUserStore,
  formatTime,
  DiscountCoupon,
  useDiscountStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coupon = useDiscountStore()
const coupons = computed(() => coupon.Discounts)
const loading = ref(true)

const logined = useLoginedUserStore()

const prepare = () => {
  loading.value = true
  coupon.getDiscounts({
    Message: {
      Error: {
        Title: t('MSG_GET_DISCOUNTS'),
        Message: t('MSG_GET_DISCOUNTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })
}

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({
  ReleaseByUserID: logined.LoginedUser?.User.ID
} as unknown as DiscountCoupon)
const start = computed({
  get: () => formatTime(target.value.Start, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.Start = new Date(val).getTime() / 1000
  }
})

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (coupon: DiscountCoupon) => {
  showing.value = true
  updating.value = true
  target.value = coupon
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    ReleaseByUserID: logined.LoginedUser?.User.ID
  } as unknown as DiscountCoupon
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    coupon.updateDiscount({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_DISCOUNT',
          Message: 'MSG_UPDATE_DISCOUNT_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  coupon.createDiscount({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_DISCOUNT',
        Message: 'MSG_CREATE_DISCOUNT_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
