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
  useChurchFixAmountStore,
  FixAmountCoupon,
  EventCouponTypes,
  CouponType,
  useChurchDiscountStore,
  DiscountCoupon,
  useChurchUsersStore,
  UserInfo,
  AppUser,
  useChurchUserCouponStore
} from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { AppID } from 'src/const/const'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const appID = computed(() => AppID)

const coupon = useChurchUserCouponStore()

const user = useChurchUsersStore()
const users = computed(() => {
  const appUsers = user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<UserInfo> : []
  return Array.from(appUsers).map((el) => el.User)
})
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const selectedUsers = ref([] as Array<AppUser>)

interface MyFixAmount {
  label: string
  value: FixAmountCoupon
}

const fixAmount = useChurchFixAmountStore()
const appFixAmounts = computed(() => {
  return fixAmount.FixAmounts.get(appID.value) ? fixAmount.FixAmounts.get(appID.value) as Array<FixAmountCoupon> : []
})
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

const discount = useChurchDiscountStore()
const appDiscounts = computed(() => {
  return discount.Discounts.get(appID.value) ? discount.Discounts.get(appID.value) as Array<DiscountCoupon> : []
})
const discounts = computed(() => Array.from(appDiscounts.value).map((el) => {
  return {
    label: el.Name + ' | ' + el.Discount.toString() + '%',
    value: el
  } as MyDiscount
}))
const selectedDiscount = ref(undefined as unknown as MyDiscount)

const loading = ref(true)
const couponType = ref(undefined as unknown as CouponType)
const airdropCount = ref(1)
const couponID = ref(undefined as unknown as string)
watch(selectedDiscount, () => {
  couponID.value = selectedDiscount.value.value.ID as string
})
watch(selectedFixAmount, () => {
  couponID.value = selectedFixAmount.value.value.ID as string
})

const prepare = () => {
  loading.value = true
  fixAmount.getFixAmounts({
    TargetAppID: appID.value,
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
    TargetAppID: appID.value,
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

  user.getUsers({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })
}

watch(appID, () => {
  prepare()
})

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
      TargetAppID: appID.value,
      TargetUserID: user.ID as string,
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
