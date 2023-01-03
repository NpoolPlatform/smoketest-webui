<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :columns='columns'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as WithdrawReview)'
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
        <span>{{ $t('MSG_REVIEW_WITHDRAW_ADDRESSES') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target?.PhoneNO }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE_ID') }}: {{ target?.CoinTypeID }}</q-item-label>
        <q-item-label>{{ $t('MSG_COIN_NAME') }}: {{ target?.CoinName }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target?.Amount }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.Trigger }}</q-item-label>
        <q-item-label>{{ $t('MSG_STATE') }}: {{ target?.State }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_APPROVE")' @click='onApprove' :disabled='target.State === ReviewState.Rejected' />
        <LoadingButton :loading='true' :label='$t("MSG_REJECT")' @click='onReject' :disabled='target.State === ReviewState.Rejected' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotifyType, ReviewState, useAdminWithdrawReviewStore, useLocalUserStore, WithdrawReview, useLocaleStore, formatTime } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const review = useAdminWithdrawReviewStore()
const reviews = computed(() => review.WithdrawReviews.WithdrawReviews)
const displayReviews = ref(reviews.value.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1))
const reviewLoading = ref(false)

const locale = useLocaleStore()
const logined = useLocalUserStore()

const showing = ref(false)
const target = ref({} as WithdrawReview)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as WithdrawReview
}

const onRowClick = (row: WithdrawReview) => {
  target.value = { ...row }
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onApprove = (done: () => void) => {
  target.value.State = ReviewState.Approved
  updateReview(done)
}

const onReject = (done: () => void) => {
  if (target.value.Message.trim().length <= 0) {
    console.log('need message')
    done()
    return
  }
  target.value.State = ReviewState.Rejected
  updateReview(done)
}

const updateReview = (done: () => void) => {
  review.updateWithdrawReview({
    ReviewID: target.value.ReviewID,
    LangID: locale.AppLang?.LangID,
    UserID: logined.User?.ID,
    Message: target.value.Message,
    State: target.value.State,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (row: WithdrawReview, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (reviews.value.length === 0) {
    reviewLoading.value = true
    getWithdrawReviews(0, 100)
  }
})

const getWithdrawReviews = (offset: number, limit: number) => {
  review.getWithdrawReviews({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (rows: Array<WithdrawReview>, error: boolean) => {
    if (error || rows.length === 0) {
      reviewLoading.value = false
      return
    }
    getWithdrawReviews(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: WithdrawReview) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    field: (row: WithdrawReview) => row.CoinLogo
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: WithdrawReview) => row.CoinTypeID
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    field: (row: WithdrawReview) => row.Amount
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    field: (row: WithdrawReview) => row.Address
  },
  {
    name: 'WithdrawState',
    label: t('MSG_WITHDRAW_STATE'),
    field: (row: WithdrawReview) => row.WithdrawState
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    field: (row: WithdrawReview) => row.State
  },
  {
    name: 'Trigger',
    label: t('MSG_TRIGGER'),
    field: (row: WithdrawReview) => row.Trigger
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    field: (row: WithdrawReview) => row.Message
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: WithdrawReview) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    field: (row: WithdrawReview) => formatTime(row.UpdatedAt)
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: WithdrawReview) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: WithdrawReview) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: WithdrawReview) => row.PhoneNO
  },
  {
    name: 'KycState',
    label: t('MSG_KYC_STATE'),
    field: (row: WithdrawReview) => row.KycState
  }
])
</script>
