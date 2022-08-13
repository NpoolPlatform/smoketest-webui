<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='displayCoins'
    row-key='ID'
    :loading='coinLoading'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Review)'
  />
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
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target.User.User.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target.User.User.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_USERNAME') }}: {{ target.User.Extra?.Username }}</q-item-label>
        <q-item-label>{{ $t('MSG_FIRST_NAME') }}: {{ target.User.Extra?.FirstName }}</q-item-label>
        <q-item-label>{{ $t('MSG_LAST_NAME') }}: {{ target.User.Extra?.LastName }}</q-item-label>
        <q-item-label>{{ $t('MSG_GENDER') }}: {{ target.User.Extra?.Gender }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE') }}: {{ coin?.Name }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target.Withdraw?.Amount }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target.Withdraw?.WithdrawType }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Review.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='onApprove(WithdrawReviewState.Approved)' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='onReject(WithdrawReviewState.Approved)' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, useReviewStore, ReviewState, WithdrawReview, useCoinStore, useLoginedUserStore, Review } from 'npool-cli-v2'
import { useAdminReviewStore, Review as AdminReview } from 'src/teststore/review'
import { WithdrawReviewState } from 'src/teststore/review/const'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const review = useReviewStore()
const coins = useCoinStore()
// const locale = useLocaleStore()
const logined = useLoginedUserStore()

const reviews = computed(() => review.WithdrawReviews)
const displayReviews = computed(() => Array.from(review.WithdrawReviews).map((el) => el.Review))
const reviewLoading = ref(true)

const displayCoins = computed(() => coins.Coins)
const coinLoading = ref(true)

onMounted(() => {
  review.getWithdrawReviews({
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    reviewLoading.value = false
  })

  coins.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    coinLoading.value = false
  })
})

const showing = ref(false)
const target = ref({} as unknown as WithdrawReview)
const coin = computed(() => coins.getCoinByID(target.value.Withdraw?.CoinTypeID))

const onMenuHide = () => {
  target.value = {} as unknown as WithdrawReview
}

const onRowClick = (r: Review) => {
  const index = reviews.value.findIndex((el) => el.Review.ID === r.ID)
  if (index >= 0) {
    target.value = reviews.value[index]
  }
  showing.value = true
}
const lreview = useAdminReviewStore()
const updateReview = (withdrawReviewState: WithdrawReviewState) => {
  target.value.Review.ReviewerID = logined.LoginedUser?.User?.ID

  // review.updateWithdrawReview({
  //   TargetLangID: locale.CurLang?.ID as string,
  //   Info: target.value.Review,
  //   Message: {
  //     Error: {
  //       Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
  //       Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
  //       Popup: true,
  //       Type: NotificationType.Error
  //     }
  //   }
  // }, () => {
  //   // TODO
  // })
  lreview.updateWithdrawReview({
    ID: target.value.Review.ID as string,
    UserID: target.value.Review.ReviewerID as string,
    Message: target.value.Review.Message as string,
    State: withdrawReviewState,
    NotificationMessage: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, resp?: AdminReview) => {
    if (error) {
      return
    }
    const existItem = review.WithdrawReviews.find((el) => el.Review.ID === target.value.Review.ID)
    if (existItem) {
      existItem.Review.Message = resp?.Message
      existItem.Review.State = resp?.State
    }
  })
}

const onApprove = (withdrawReviewState: WithdrawReviewState) => {
  showing.value = false
  target.value.Review.State = ReviewState.Approved
  updateReview(withdrawReviewState)
  onMenuHide()
}

const onReject = (withdrawReviewState: WithdrawReviewState) => {
  showing.value = false
  target.value.Review.State = ReviewState.Rejected
  updateReview(withdrawReviewState)
  onMenuHide()
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
