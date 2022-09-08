<template>
  <q-table
    dense
    flat
    :title='$t("MSG_KYC_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as KYCReview)'
    :columns='columns'
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
          :label='$t("MSG_EXPORT")'
          @click='onExport'
        />
      </div>
    </template>
  </q-table>>
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
        <q-item-label>{{ $t('MSG_CARD_TYPE') }}: {{ target.DocumentType }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_KYC_REVIEW_STATE') }}: {{ target?.ReviewState }}</q-item-label>
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
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='updateReview(KYCReviewState.Approved)' :disable='disableUpdateBtn(target)' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='updateReview(KYCReviewState.Rejected)' :disable='disableUpdateBtn(target)' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import saveAs from 'file-saver'
import {
  NotificationType,
  useApplicationStore,
  useLocaleStore
} from 'npool-cli-v2'
import {
  NotifyType,
  ImageType,
  DocumentType,
  KYCReview,
  User,
  useAdminUserStore,
  useAdminKycStore,
  KYCReviewState,
  formatTime
} from 'npool-cli-v4'
import { AppID } from 'src/const/const'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: KYCReview) => row.UserID,
    sortable: true
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: KYCReview) => row.EmailAddress,
    sortable: true
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: KYCReview) => row.PhoneNO,
    sortable: true
  },
  {
    name: 'KycID',
    label: t('MSG_KYC_ID'),
    field: (row: KYCReview) => row.KycID,
    sortable: true
  },
  {
    name: 'DocumentType',
    label: t('MSG_DOCUMENT_TYPE'),
    field: (row: KYCReview) => row.DocumentType,
    sortable: true
  },
  {
    name: 'IDNumber',
    label: t('MSG_ID_NUMBER'),
    field: (row: KYCReview) => row.IDNumber,
    sortable: true
  },
  {
    name: 'EntityType',
    label: t('MSG_ENTITY_TYPE'),
    field: (row: KYCReview) => row.EntityType,
    sortable: true
  },
  {
    name: 'ReviewID',
    label: t('MSG_REVIEW_ID'),
    field: (row: KYCReview) => row.ReviewID,
    sortable: true
  },
  {
    name: 'ObjectType',
    label: t('MSG_OBJECT_TYPE'),
    field: (row: KYCReview) => row.ObjectType,
    sortable: true
  },
  {
    name: 'Domain',
    label: t('MSG_DOMAIN'),
    field: (row: KYCReview) => row.Domain,
    sortable: true
  },
  {
    name: 'Reviewer',
    label: t('MSG_REVIEWER'),
    field: (row: KYCReview) => row.Reviewer,
    sortable: true
  },
  {
    name: 'ReviewState',
    label: t('MSG_REVIEW_STATE'),
    field: (row: KYCReview) => row.ReviewState,
    sortable: true
  },
  {
    name: 'KycState',
    label: t('MSG_KYC_STATE'),
    field: (row: KYCReview) => row.KycState,
    sortable: true
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    field: (row: KYCReview) => row.Message,
    sortable: true
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: KYCReview) => formatTime(row.CreatedAt),
    sortable: true
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    field: (row: KYCReview) => formatTime(row.UpdatedAt),
    sortable: true
  }
])
const locale = useLocaleStore()

const username = ref('')
const displayReviews = computed(() => kyc.KycReviews.KycReviews.filter((el) => {
  return el.EmailAddress.toLowerCase().includes(username.value) || el.PhoneNO.toLowerCase().includes(username.value)
}))
const reviewLoading = ref(false)

const disableUpdateBtn = computed(() => (review: KYCReview) => review.ReviewState === KYCReviewState.Approved || review.ReviewState === KYCReviewState.Rejected)
const kyc = useAdminKycStore()

const showing = ref(false)
const target = ref({} as unknown as KYCReview)
const images = computed(() => kyc.Images.get(target.value.KycID))

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as KYCReview
  targetUser.value = {} as unknown as User
}
const targetUser = ref({} as User)
const user = useAdminUserStore()

const onRowClick = (row: KYCReview) => {
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
  }, row.KycID, () => {
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
    }, row.KycID, () => {
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
      }, row.KycID, () => {
        showing.value = true
      })
    })
  })
}

const updateReview = (state: KYCReviewState) => {
  if (state === KYCReviewState.Rejected && target.value.Message.length === 0) {
    console.log('message is required')
    return
  }
  kyc.updateKycReview({
    ReviewID: target.value?.ReviewID,
    LangID: locale.CurLang?.ID,
    State: state,
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
  }, (r:KYCReview, error: boolean) => {
    if (error) {
      return
    }
    target.value.ReviewState = state
    onMenuHide()
  })
}

const onCancel = () => {
  onMenuHide()
}

const onExport = () => {
  if (displayReviews.value.length === 0) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { FrontImg, BackImg, SelfieImg, CreatedAt, UpdatedAt, ...columns } = { ...displayReviews.value[0] }
  let str = ''
  str += Object.keys(columns).join(',') + ',CreatedAt,UpdatedAt\n'
  displayReviews.value.forEach((el) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { FrontImg, BackImg, SelfieImg, CreatedAt, UpdatedAt, ...values } = { ...el }
    const valueArray = Object.values(values)
    valueArray.push(formatTime(CreatedAt), formatTime(UpdatedAt))
    str += Object.values(valueArray).join(',') + '\n'
  })
  const blob = new Blob([str], { type: 'text/plain;charset=utf-8' })
  const filename = application.Application.App.Name + '-Kycs-' + formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

onMounted(() => {
  if (kyc.KycReviews.KycReviews.length === 0) {
    reviewLoading.value = true
    getKycReviews(0, 500)
  }
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }
  if (application.Application === undefined) {
    getApplication()
  }
})

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
const getKycReviews = (offset: number, limit: number) => {
  kyc.getKycReviews({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_REVIEWS'),
        Message: t('MSG_GET_KYC_REVIEWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<KYCReview>, error: boolean) => {
    if (error || resp.length < limit) {
      reviewLoading.value = false
      return
    }
    getKycReviews(offset + limit, limit)
  })
}
const application = useApplicationStore()
const getApplication = () => {
  application.getApplication({
    ID: AppID,
    Message: {
      Error: {
        Title: 'MSG_GET_APP',
        Message: 'MSG_GET_APP_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
