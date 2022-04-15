<template>
  <q-table
    dense
    flat
    :title='$t("MSG_KYCS")'
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
        <span>{{ $t('MSG_REVIEW_KYC') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='MessageUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-select :options='KYCTypes' v-model='target.AccountType' :label='$t("MSG_KYC_TYPE")' />
        <q-input v-model='target.Account' :label='$t("MSG_ACCOUNT")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, MessageUsedFors, useReviewStore, KYCReview } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const review = useReviewStore()

const reviews = computed(() => review.KYCReviews)
const displayReviews = computed(() => Array.from(review.KYCReviews).map((el) => el.Review))
const reviewLoading = ref(true)

onMounted(() => {
  review.getKYCReviews({
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_REVIEWS'),
        Message: t('MSG_GET_KYC_REVIEWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    reviewLoading.value = false
  })
})

const showing = ref(false)
const target = ref({} as unknown as KYCReview)

const onMenuHide = () => {
  target.value = {} as unknown as KYCReview
}

const onRowClick = (index: number) => {
  target.value = reviews.value[index]
  showing.value = true
}

const onSubmit = () => {
  showing.value = false
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
