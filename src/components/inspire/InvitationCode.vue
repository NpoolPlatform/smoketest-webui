<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    selection='multiple'
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
          :label='$t("MSG_CREATE_INVITATION_CODE")'
          :disable='selectedUser.length === 0'
          @click='onCreateInvitationCodeClick'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_SET_KOL")'
          :disable='selectedUser.length === 0'
          @click='onSetKolClick'
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
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='_code'
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
import { formatTime, NotifyType, useAdminUserStore, User, useAdminInvitationCodeStore, InvitationCode } from 'npool-cli-v4'
import { getUsers } from 'src/api/user'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const code = useAdminInvitationCodeStore()
const codes = computed(() => code.InvitationCodes.InvitationCodes)

const _code = ref('')
const displayCodes = computed(() => codes.value.filter((el) => {
  return el.EmailAddress?.includes(_code.value) || el.InvitationCode?.includes(_code.value) || el.PhoneNO?.includes(_code.value)
}))

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)

const username = ref('')
const start = ref('')
const end = ref('')

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

const selectedUser = ref([] as Array<User>)

const onCreateInvitationCodeClick = () => {
  addInvitationCode()
}

const counter = ref(0)
const addInvitationCode = (idx = 0) => {
  code.createInvitationCode({
    TargetUserID: selectedUser.value[idx].ID,
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotifyType.Success
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

const _user = useAdminUserStore()
const onSetKolClick = () => {
  selectedUser.value?.forEach((el) => {
    _user.updateAppUserKol({
      TargetUserID: el.ID,
      Kol: true,
      Message: {
        Error: {
          Title: t('MSG_CREATE_INVITATION_CODE'),
          Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        },
        Info: {
          Title: t('MSG_CREATE_INVITATION_CODE'),
          Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: NotifyType.Success
        }
      }
    }, (error: boolean) => {
      if (error) {
        return
      }
      console.log()
    })
  })
}

onMounted(() => {
  if (codes.value?.length === 0) {
    getInvitationCodes(0, 500)
  }
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }
})

const getInvitationCodes = (offset: number, limit: number) => {
  code.getInvitationCodes({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<InvitationCode>) => {
    if (error || rows.length < limit) {
      return
    }
    getInvitationCodes(offset + limit, limit)
  })
}
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
</script>
