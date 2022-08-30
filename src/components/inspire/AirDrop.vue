<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    selection='multiple'
    v-model:selected='selectedUsers'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AIRDROP")'
          @click='onDo'
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
        <span>{{ $t('MSG_CREATE_EVENT_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='EventCouponTypes' v-model='couponType' :label='$t("MSG_COUPON_TYPE")' />
        <q-select
          v-if='couponType === CouponType.FixAmount'
          :options='fixAmounts'
          v-model='selectedFixAmount'
          :label='$t("MSG_FIX_AMOUNT_COUPON")'
        />
        <q-select
          v-if='couponType=== CouponType.Discount'
          :options='discounts'
          v-model='selectedDiscount'
          :label='$t("MSG_DISCOUNT_COUPON")'
        />
        <q-input type='number' v-model='airdropCount' :label='$t("MSG_COUPON_COUNT")' />
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
  FixAmountCoupon,
  EventCouponTypes,
  CouponType,
  DiscountCoupon,
  useFixAmountStore,
  useDiscountStore,
  useUserCouponStore
} from 'npool-cli-v2'
import { NotifyType, useAdminUserStore, User } from 'npool-cli-v4'
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coupon = useUserCouponStore()

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const selectedUsers = ref([] as Array<User>)

interface MyFixAmount {
  label: string
  value: FixAmountCoupon
}

const fixAmount = useFixAmountStore()
const appFixAmounts = computed(() => fixAmount.FixAmounts)
const fixAmounts = computed(() => Array.from(appFixAmounts.value).map((el) => {
  return {
    label: el.Name + ' | ' + el.Denomination.toString(),
    value: el
  } as MyFixAmount
}))
const selectedFixAmount = ref(undefined as unknown as MyFixAmount)

interface MyDiscount {
  label: string
  value: DiscountCoupon
}

const discount = useDiscountStore()
const appDiscounts = computed(() => discount.Discounts)
const discounts = computed(() => Array.from(appDiscounts.value).map((el) => {
  return {
    label: el.Name + ' | ' + el.Discount.toString() + '%',
    value: el
  } as MyDiscount
}))
const selectedDiscount = ref(undefined as unknown as MyDiscount)

const loading = ref(false)
const couponType = ref(undefined as unknown as CouponType)
const airdropCount = ref(1)
const couponID = ref(undefined as unknown as string)
watch(selectedDiscount, () => {
  couponID.value = selectedDiscount.value.value.ID as string
})
watch(selectedFixAmount, () => {
  couponID.value = selectedFixAmount.value.value.ID as string
})

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
      loading.value = false
      return
    }
    getUsers(offset + limit, limit)
  })
}
const prepare = () => {
  fixAmount.getFixAmounts({
    Message: {
      Error: {
        Title: t('MSG_GET_FIX_AMOUNTS'),
        Message: t('MSG_GET_FIX_AMOUNTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  discount.getDiscounts({
    Message: {
      Error: {
        Title: t('MSG_GET_DISCOUNTS'),
        Message: t('MSG_GET_DISCOUNTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  if (user.Users.Users.length === 0) {
    loading.value = true
    getUsers(0, 500)
  }
}

onMounted(() => {
  prepare()
})

const showing = ref(false)
const onDo = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false
  selectedUsers.value.forEach((user) => {
    coupon.createUserCoupon({
      TargetUserID: user.ID,
      Info: {
        Type: couponType.value,
        CouponID: couponID.value
      },
      Message: {
        Error: {
          Title: t('MSG_CREATE_USER_COUPONS'),
          Message: t('MSG_CREATE_USER_COUPONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
