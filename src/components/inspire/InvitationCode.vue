<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    selection='multiple'
    :loading='userLoading'
    v-model:selected='selectedUser'
    :columns='columns'
    :rows-per-page-options='[10]'
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
        <q-input
          dense
          class='small'
          type='date'
          v-model='start'
          :label='$t("MSG_START")'
        />
        <q-input
          dense
          class='small'
          type='date'
          v-model='end'
          :label='$t("MSG_END")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreateInvitationCodeClick'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITATION_CODES")'
    :rows='displayCodes'
    row-key='ID'
    :loading='codeLoading'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='searchStr'
          :label='$t("MSG_SEARCH")'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotificationType, InvitationCode, useInvitationStore } from 'npool-cli-v2'
import { formatTime, NotifyType, useAdminUserStore, User } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles?.join(',')
  },
  {
    name: 'IDNUMBER',
    label: t('MSG_IDNUMBER'),
    field: (row: User) => row.IDNumber
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])
const inspire = useInvitationStore()
const codes = computed(() => inspire.InvitationCodes)
const codeLoading = ref(false)
const userLoading = ref(false)

const start = ref('')
const end = ref('')
interface Code extends InvitationCode {
  EmailAddress: string
  PhoneNO: string
}

const user = useAdminUserStore()
const ecodes = computed(() => Array.from(codes.value).map((code: InvitationCode) => {
  const myCode = code as unknown as Code
  myCode.EmailAddress = user.getUserByID(code.UserID as string)?.EmailAddress
  myCode.PhoneNO = user.getUserByID(code.UserID as string)?.PhoneNO
  return myCode
}))

const searchStr = ref('')
const displayCodes = computed(() => ecodes.value.filter((el) => {
  return el.EmailAddress?.includes(searchStr.value) || el.InvitationCode?.includes(searchStr.value) || el.PhoneNO?.includes(searchStr.value)
}))

const users = computed(() => Array.from(user.Users.Users.filter((el) => {
  return codes.value.findIndex((code) => el.ID === code.UserID) < 0
}).map((el) => el)))

const selectedUser = ref([] as Array<User>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => {
  let display = user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
  if (start.value.length) {
    display = display && (user.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (user.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

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
      userLoading.value = false
      return
    }
    getUsers(offset + limit, limit)
  })
}
onMounted(() => {
  inspire.getInvitationCodes({
    Message: {
      Error: {
        Title: t('MSG_GET_INVITATION_CODES'),
        Message: t('MSG_GET_INVITATION_CODES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    codeLoading.value = false
  })
  if (user.Users.Users.length === 0) {
    userLoading.value = true
    getUsers(0, 500)
  }
})
const counter = ref(0)
const addInvitationCode = (idx = 0) => {
  if (selectedUser.value.length === 0) {
    return
  }
  inspire.createInvitationCode({
    TargetUserID: selectedUser.value[idx].ID,
    Info: {
      UserID: selectedUser.value[idx].ID
    },
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    counter.value++
    if (counter.value >= selectedUser.value.length) {
      counter.value = 0
      return
    }
    addInvitationCode(counter.value)
  })
}
const onCreateInvitationCodeClick = () => {
  addInvitationCode()
}

</script>
