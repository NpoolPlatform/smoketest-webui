<template>
  <q-table
    dense
    flat
    :title='$t("MSG_SMS_TEMPLATES")'
    :rows='smss'
    key='ID'
    :loading='smsLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as SMSTemplate)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_SMS_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <div class='dark-bg'>
          <LangSwitcher v-model:language='language' />
        </div>
      </q-card-section>
      <q-card-section>
        <q-select :options='MessageUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='target.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='target.Message' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, useTemplateStore, SMSTemplate, Language, MessageUsedFors } from 'npool-cli-v2'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const templates = useTemplateStore()
const smss = computed(() => templates.SMSTemplates)
const smsLoading = ref(true)

onMounted(() => {
  templates.getSMSTemplates({
    Message: {
      Error: {
        Title: 'MSG_GET_SMS_TEMPLATES',
        Message: 'MSG_GET_SMS_TEMPLATES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    smsLoading.value = false
  })
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as SMSTemplate)
const language = ref(undefined as unknown as Language)

const onMenuHide = () => {
  language.value = undefined as unknown as Language
  target.value = {} as unknown as SMSTemplate
}

const onRowClick = (template: SMSTemplate) => {
  target.value = template
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    templates.updateSMSTemplate({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_SMS_TEMPLATE',
          Message: 'MSG_UPDATE_SMS_TEMPLATE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  templates.createSMSTemplate({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_SMS_TEMPLATE',
        Message: 'MSG_CREATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
