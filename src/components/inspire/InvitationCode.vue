<template>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITATION_CODES")'
    :rows='codes'
    row-key='ID'
    :loading='codeLoading'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useAdminInspireStore, NotificationType } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useAdminInspireStore()
const codes = computed(() => inspire.InvitationCodes)
const codeLoading = ref(true)

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
})

</script>
