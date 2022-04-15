<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
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
    :rows='ecodes'
    row-key='ID'
    :loading='codeLoading'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useAdminInspireStore, NotificationType, UserInvitationCode, useUsersStore, AppUser } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useAdminInspireStore()
const codes = computed(() => inspire.InvitationCodes)
const codeLoading = ref(true)

interface Code extends UserInvitationCode {
  EmailAddress: string
  PhoneNO: string
}

const user = useUsersStore()
const ecodes = computed(() => Array.from(codes.value).map((code: UserInvitationCode) => {
  const myCode = code as unknown as Code
  myCode.EmailAddress = user.getUserByID(code.UserID)?.User.EmailAddress as string
  myCode.PhoneNO = user.getUserByID(code.UserID)?.User.PhoneNO as string
  return myCode
}))
const users = computed(() => Array.from(user.Users.filter((el) => codes.value.findIndex((code) => el.User.ID === code.UserID) < 0).map((el) => el.User)))
const selectedUser = ref([] as Array<AppUser>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

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
  })
})

const onCreateInvitationCodeClick = () => {
  if (selectedUser.value.length === 0) {
    return
  }
  inspire.createInvitationCode({
    TargetUserID: selectedUser.value[0].ID as string,
    Info: {
      UserID: selectedUser.value[0].ID as string
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
  })
}

</script>
