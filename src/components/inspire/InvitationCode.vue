<template>
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
import { useAdminInspireStore, NotificationType, InvitationCode, useUsersStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useAdminInspireStore()
const codes = computed(() => inspire.InvitationCodes)
const codeLoading = ref(true)

interface Code extends InvitationCode {
  EmailAddress: string
  PhoneNO: string
}

const user = useUsersStore()
const ecodes = computed(() => Array.from(codes.value).map((code) => {
  const myCode = code as unknown as Code
  myCode.EmailAddress = user.getUserByID(code.UserID)?.User.EmailAddress as string
  myCode.PhoneNO = user.getUserByID(code.UserID)?.User.PhoneNO as string
  return myCode
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
  })
})

</script>
