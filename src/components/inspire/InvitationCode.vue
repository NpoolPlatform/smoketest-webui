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
import { NotificationType, InvitationCode, useUsersStore, AppUser, useInvitationStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = [
  { name: 'ID', label: 'ID', field: 'ID' },
  { name: 'APPID', label: 'APPID', field: 'AppID' },
  { name: 'EMAILADDRESS', label: 'EMAILADDRESS', field: 'EmailAddress' },
  { name: 'PHONENO', label: 'PHONENO', field: 'PhoneNO' },
  { name: 'IMPORTFROMAPP', label: 'IMPORTFROMAPP', field: 'ImportFromApp' },
  { name: 'CREATEAT', label: 'CREATEAT', field: 'CreateAt' }
]
const inspire = useInvitationStore()
const codes = computed(() => inspire.InvitationCodes)
const codeLoading = ref(true)
const userLoading = ref(true)

const start = ref('')
const end = ref('')
interface Code extends InvitationCode {
  EmailAddress: string
  PhoneNO: string
}

const user = useUsersStore()
const ecodes = computed(() => Array.from(codes.value).map((code: InvitationCode) => {
  const myCode = code as unknown as Code
  myCode.EmailAddress = user.getUserByID(code.UserID as string)?.User.EmailAddress as string
  myCode.PhoneNO = user.getUserByID(code.UserID as string)?.User.PhoneNO as string
  return myCode
}))

const searchStr = ref('')
const displayCodes = computed(() => ecodes.value.filter((el) => {
  return el.EmailAddress?.includes(searchStr.value) || el.InvitationCode?.includes(searchStr.value) || el.PhoneNO?.includes(searchStr.value)
}))

const users = computed(() => Array.from(user.Users.filter((el) => {
  return codes.value.findIndex((code) => el.User.ID === code.UserID) < 0
}).map((el) => el.User)))
const selectedUser = ref([] as Array<AppUser>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => {
  let display = user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
  if (start.value.length) {
    display = display && (user.CreateAt as number >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (user.CreateAt as number <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

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
  user.getUsers({
    Message: {
      Error: {
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
    userLoading.value = false
  })
})
const counter = ref(0)
const addInvitationCode = (idx = 0) => {
  if (selectedUser.value.length === 0) {
    return
  }
  inspire.createInvitationCode({
    TargetUserID: selectedUser.value[idx].ID as string,
    Info: {
      UserID: selectedUser.value[idx].ID as string
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
    // TODO
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
