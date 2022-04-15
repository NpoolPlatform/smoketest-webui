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
    @row-click='(evt, row, index) => onRowClick(index)'
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
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='onApprove' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='onReject' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, useReviewStore, ReviewState, WithdrawReview, useCoinStore, useLocaleStore, useLoginedUserStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const review = useReviewStore()
const coins = useCoinStore()
const locale = useLocaleStore()
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

const onRowClick = (index: number) => {
  target.value = reviews.value[index]
  showing.value = true
}

const updateReview = () => {
  target.value.Review.ReviewerID = logined.LoginedUser?.User?.ID

  review.updateWithdrawReview({
    TargetLangID: locale.CurLang?.ID as string,
    Info: target.value.Review,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onApprove = () => {
  showing.value = false
  target.value.Review.State = ReviewState.Approved
  updateReview()
  onMenuHide()
}

const onReject = () => {
  showing.value = false
  target.value.Review.State = ReviewState.Rejected
  updateReview()
  onMenuHide()
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
