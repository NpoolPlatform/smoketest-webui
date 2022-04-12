<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='emails'
    key='ID'
    :loading='emailLoading'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useTemplateStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const templates = useTemplateStore()
const emails = computed(() => templates.EmailTemplates)
const emailLoading = ref(false)

onMounted(() => {
  templates.getEmailTemplates({
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_TEMPLATES',
        Message: 'MSG_GET_EMAIL_TEMPLATES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    emailLoading.value = false
  })
})

</script>
