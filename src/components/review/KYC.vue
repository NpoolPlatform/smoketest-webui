<template>
  <q-table
    dense
    flat
    :title='$t("MSG_KYC_REVIEWS")'
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
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target.User.User.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target.User.User.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_USERNAME') }}: {{ target.User.Extra?.Username }}</q-item-label>
        <q-item-label>{{ $t('MSG_FIRST_NAME') }}: {{ target.User.Extra?.FirstName }}</q-item-label>
        <q-item-label>{{ $t('MSG_LAST_NAME') }}: {{ target.User.Extra?.LastName }}</q-item-label>
        <q-item-label>{{ $t('MSG_GENDER') }}: {{ target.User.Extra?.Gender }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_CARD_TYPE') }}: {{ target.Kyc.CardType }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(ImageType.Front)?.Base64 as string)' />
        </q-item-section>
        <q-item-section v-if='target.Kyc?.CardType === ImageType.Back'>
          <q-img :ratio='1' :src='(images?.get(ImageType.Back)?.Base64 as string)' />
        </q-item-section>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(ImageType.Handing)?.Base64 as string)' />
        </q-item-section>
      </q-item>
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
import { NotificationType, useReviewStore, KYCReview, useKYCsStore, ImageType, DocumentType } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const review = useReviewStore()

const reviews = computed(() => review.KYCReviews)
const displayReviews = computed(() => Array.from(review.KYCReviews).map((el) => el.Review))
const reviewLoading = ref(true)

const kyc = useKYCsStore()

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
const images = computed(() => kyc.Images.get(target.value.Kyc.ID as string))

const onMenuHide = () => {
  target.value = {} as unknown as KYCReview
}

const onRowClick = (index: number) => {
  target.value = reviews.value[index]
  kyc.getKYCImage({
    ImageS3Key: target.value.Kyc?.FrontCardImg as string,
    ImageType: ImageType.Front,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_IMAGES'),
        Message: t('MSG_GET_KYC_IMAGES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, target.value.Kyc.ID as string, () => {
    kyc.getKYCImage({
      ImageS3Key: target.value.Kyc?.UserHandingCardImg as string,
      ImageType: ImageType.Handing,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_IMAGES'),
          Message: t('MSG_GET_KYC_IMAGES_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, target.value.Kyc.ID as string, () => {
      if (target.value.Kyc?.CardType === DocumentType.Passport) {
        showing.value = true
        return
      }
      kyc.getKYCImage({
        ImageS3Key: target.value.Kyc?.BackCardImg as string,
        ImageType: ImageType.Back,
        Message: {
          Error: {
            Title: t('MSG_GET_KYC_IMAGES'),
            Message: t('MSG_GET_KYC_IMAGES_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, target.value.Kyc.ID as string, () => {
        showing.value = true
      })
    })
  })
}

const onApprove = () => {
  showing.value = false
  onMenuHide()
}

const onReject = () => {
  showing.value = false
  onMenuHide()
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
