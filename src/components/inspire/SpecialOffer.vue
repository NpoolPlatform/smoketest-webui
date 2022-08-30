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
          @click='onCreate'
          :disable='selectedUser.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_SPECIAL_OFFERS")'
    :rows='displayCoupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as UserSpecialOffer)'
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
        <span>{{ $t('MSG_CREATE_SPECIAL_OFFER') }}</span>
      </q-card-section>
      <q-card-section>
        <span>
          {{ $t('MSG_USERNAME') }}: {{ selectedUser[0]?.EmailAddress?.length ? selectedUser[0]?.EmailAddress : selectedUser[0]?.PhoneNO }}
        </span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COUPON_DESCRIPTION")' />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='number' v-model='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' :suffix='$t("MSG_DAYS")' />
        <q-input type='number' v-model='target.Amount' :label='$t("MSG_COUPON_AMOUNT")' :suffix='PriceCoinName' />
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
  formatTime,
  UserSpecialOffer,
  useSpecialOfferStore,
  PriceCoinName
} from 'npool-cli-v2'
import { NotifyType, useAdminUserStore, useLocalUserStore, User } from 'npool-cli-v4'
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const selectedUser = ref([] as Array<User>)
const userID = computed(() => selectedUser.value.length ? selectedUser.value[0].ID : undefined as unknown as string)

interface MyCoupon extends UserSpecialOffer {
  EmailAddress: string
  PhoneNO: string
}

const coupon = useSpecialOfferStore()
const appCoupons = computed(() => coupon.SpecialOffers)
const coupons = computed(() => Array.from(appCoupons.value as Array<UserSpecialOffer>).map((el) => {
  const c = el as MyCoupon
  c.EmailAddress = user.getUserByID(c.UserID as string)?.EmailAddress
  c.PhoneNO = user.getUserByID(c.UserID as string)?.PhoneNO
  return c
}))
const displayCoupons = computed(() => coupons.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const loading = ref(true)

const logined = useLocalUserStore()
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
      return
    }
    getUsers(offset + limit, limit)
  })
}

const prepare = () => {
  loading.value = true
  coupon.getSpecialOffers({
    Message: {
      Error: {
        Title: t('MSG_GET_SPECIAL_OFFERS'),
        Message: t('MSG_GET_SPECIAL_OFFERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }
}

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({
  ReleaseByUserID: logined.User?.ID
} as unknown as UserSpecialOffer)
const start = computed({
  get: () => formatTime(target.value.Start, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.Start = new Date(val).getTime() / 1000
  }
})
watch(userID, () => {
  target.value.UserID = userID.value
})

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (coupon: UserSpecialOffer) => {
  showing.value = true
  updating.value = true
  target.value = coupon
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    ReleaseByUserID: logined.User?.ID
  } as unknown as UserSpecialOffer
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    coupon.updateSpecialOffer({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_SPECIAL_OFFER',
          Message: 'MSG_UPDATE_SPECIAL_OFFER_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  coupon.createSpecialOffer({
    TargetUserID: userID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_SPECIAL_OFFER',
        Message: 'MSG_CREATE_SPECIAL_OFFER_FAIL',
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
