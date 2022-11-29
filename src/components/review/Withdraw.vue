<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
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
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_APPROVE")' @click='onApprove' />
        <LoadingButton :loading='true' :label='$t("MSG_REJECT")' @click='onReject' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useLocaleStore } from 'npool-cli-v2'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotifyType, ReviewState, useAdminWithdrawReviewStore, useLocalUserStore, WithdrawReview } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const review = useAdminWithdrawReviewStore()
const reviews = computed(() => review.WithdrawReviews.WithdrawReviews)
const displayReviews = computed(() => Array.from(review.WithdrawReviews.WithdrawReviews).map((el) => el))
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
    LangID: locale.CurLang?.ID as string,
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
    if (error || rows.length < limit) {
      reviewLoading.value = false
      return
    }
    getWithdrawReviews(offset + limit, limit)
  })
}
</script>
