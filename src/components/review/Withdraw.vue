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
        <!-- <q-item-label>{{ $t('MSG_USERNAME') }}: {{ target?.Username }}</q-item-label> -->
        <!-- <q-item-label>{{ $t('MSG_FIRST_NAME') }}: {{ target?.FirstName }}</q-item-label> -->
        <!-- <q-item-label>{{ $t('MSG_LAST_NAME') }}: {{ target?.LastName }}</q-item-label> -->
        <!-- <q-item-label>{{ $t('MSG_GENDER') }}: {{ target?.Gender }}</q-item-label> -->
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE') }}: {{ coin?.Name }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target?.Amount }}</q-item-label>
        <!-- <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.WithdrawType }}</q-item-label> -->
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
import { NotificationType, useCoinStore } from 'npool-cli-v2'
import { useWithdrawReviewStore, WithdrawReview } from 'src/teststore/review'
import { ReviewState } from 'src/teststore/review/const'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalUserStore, useLocaleStore } from 'npool-cli-v4'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

// const review = useReviewStore()
const coins = useCoinStore()
const locale = useLocaleStore()
const logined = useLocalUserStore()

const reviews = computed(() => review.WithdrawReviews.WithdrawReviews)
const displayReviews = computed(() => Array.from(review.WithdrawReviews.WithdrawReviews).map((el) => el))
const reviewLoading = ref(false)

const displayCoins = computed(() => coins.Coins)
const coinLoading = ref(true)

const review = useWithdrawReviewStore()

const getWithdrawReviews = (offset: number, limit: number) => {
  review.getWithdrawReviews({
    Offset: offset,
    Limit: limit,
    NotificationMessage: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, count?: number) => {
    if (error) {
      reviewLoading.value = false
      return
    }
    if (count !== undefined && count < limit) { // one less request
      reviewLoading.value = false
      return
    }
    getWithdrawReviews(offset + limit, limit)
  })
}
onMounted(() => {
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
  if (review.WithdrawReviews.WithdrawReviews.length === 0) {
    reviewLoading.value = true
    getWithdrawReviews(0, 100)
  }
})

const showing = ref(false)
const target = ref({} as unknown as WithdrawReview)
const coin = computed(() => coins.getCoinByID(target?.value.CoinTypeID))

const onMenuHide = () => {
  target.value = {} as unknown as WithdrawReview
}

const onRowClick = (r: WithdrawReview) => {
  const index = reviews.value.findIndex((el) => el.ReviewID === r.ReviewID)
  if (index >= 0) {
    target.value = { ...reviews.value[index] }
  }
  showing.value = true // open dialog
}

const updateReview = (done: () => void) => {
  review.updateWithdrawReview({
    ReviewID: target.value.ReviewID,
    LangID: locale.AppLang?.ID,
    UserID: logined.User?.ID,
    Message: target.value.Message,
    State: target.value.State,
    NotificationMessage: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
    showing.value = false
  })
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

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
