<template>
  <q-table
    dense
    flat
    :title='$t("MSG_KYC_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as KYC)'
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
        <span>{{ $t('MSG_REVIEW_KYC') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target?.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_USERNAME') }}: {{ targetUser?.Username }}</q-item-label>
        <q-item-label>{{ $t('MSG_FIRST_NAME') }}: {{ targetUser?.FirstName }}</q-item-label>
        <q-item-label>{{ $t('MSG_LAST_NAME') }}: {{ targetUser?.LastName }}</q-item-label>
        <q-item-label>{{ $t('MSG_GENDER') }}: {{ $t(targetUser?.Gender) }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_CARD_TYPE') }} : {{ target.DocumentType }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(ImageType.FrontImg)?.Base64 as string)' />
        </q-item-section>
        <q-item-section v-if='target?.DocumentType === DocumentType.IDCard'>
          <q-img :ratio='1' :src='(images?.get(ImageType.BackImg)?.Base64 as string)' />
        </q-item-section>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(ImageType.SelfieImg)?.Base64 as string)' />
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='updateReview(KYCState.Approved)' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='updateReview(KYCState.Rejected)' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useLocaleStore
} from 'npool-cli-v2'
import {
  NotifyType,
  ImageType,
  KYC,
  DocumentType,
  KYCState,
  User,
  useAdminUserStore,
  useAdminKycStore
} from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const locale = useLocaleStore()

const displayReviews = computed(() => kyc.KycReviews.KycReviews)
const reviewLoading = ref(false)

const kyc = useAdminKycStore()

onMounted(() => {
  if (kyc.KycReviews.KycReviews.length === 0) {
    reviewLoading.value = true
    kyc.getKycReviews({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_REVIEWS'),
          Message: t('MSG_GET_KYC_REVIEWS_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      reviewLoading.value = false
    })
  }
  if (user.Users.Users.length === 0) {
    user.getUsers({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: 'MSG_GET_USERS',
          Message: 'MSG_GET_USERS_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

const showing = ref(false)
const target = ref({} as unknown as KYC)
const images = computed(() => kyc.Images.get(target.value.ID))

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as KYC
  targetUser.value = {} as unknown as User
}
const targetUser = ref({} as User)
const user = useAdminUserStore()

const onRowClick = (row: KYC) => {
  target.value = { ...row }
  targetUser.value = { ...user.getUserByID(row.UserID) }
  kyc.getUserKYCImage({
    TargetUserID: row.UserID,
    ImageType: ImageType.FrontImg,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_IMAGES'),
        Message: t('MSG_GET_KYC_IMAGES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, row.ID, () => {
    kyc.getUserKYCImage({
      TargetUserID: row.UserID,
      ImageType: ImageType.SelfieImg,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_IMAGES'),
          Message: t('MSG_GET_KYC_IMAGES_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, row.ID, () => {
      if (target?.value?.DocumentType === DocumentType.Passport) {
        showing.value = true
        return
      }
      kyc.getUserKYCImage({
        TargetUserID: row.UserID,
        ImageType: ImageType.BackImg,
        Message: {
          Error: {
            Title: t('MSG_GET_KYC_IMAGES'),
            Message: t('MSG_GET_KYC_IMAGES_FAIL'),
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, row.ID, () => {
        showing.value = true
      })
    })
  })
}

const updateReview = (state: KYCState) => {
  if (state === KYCState.Rejected && target.value.Message.length === 0) {
    console.log('message is required')
    return
  }
  if (state === target.value.State) {
    console.log('NO NEED TO UPDATE')
    return
  }
  target.value.State = state
  kyc.updateKycReview({
    ReviewID: target.value?.ReviewID,
    LangID: locale.CurLang?.ID,
    State: target.value.State,
    Message: target.value.Message,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_KYC_REVIEW'),
        Message: t('MSG_UPDATE_KYC_REVIEW_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {}
    }
  }, (r:KYC, error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}

const onCancel = () => {
  onMenuHide()
}

</script>
