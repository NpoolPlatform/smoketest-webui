<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='emails'
    key='ID'
    :loading='emailLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as EmailTemplate)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { NotificationType, useTemplateStore, EmailTemplate } from 'npool-cli-v2'
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

const onRowClick = (template: EmailTemplate) => {
  console.log(template)
}

</script>
