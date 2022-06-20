<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='emails'
    row-key='ID'
    :loading='emailLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as MyEmailTemplate)'
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
        <span>{{ $t('MSG_CREATE_EMAIL_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <div class='dark-bg'>
          <LangSwitcher v-model:language='language' />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.DefaultToUsername' :label='$t("MSG_DEFAULT_TO_USERNAME")' />
        <q-select :options='MessageUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
        <q-input v-model='replyTos' :label='$t("MSG_REPLY_TOS_COMMA")' />
        <q-input v-model='ccTos' :label='$t("MSG_CC_TOS_COMMA")' />
        <q-input v-model='target.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='target.Body' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, useTemplateStore, EmailTemplate, Language, MessageUsedFors } from 'npool-cli-v2'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

interface MyEmailTemplate {
  ID: string
  LangID: string
  DefaultToUsername: string
  UsedFor: string
  Sender: string
  ReplyTos: string
  CCTos: string
  Subject: string
  Body: string
}

const templates = useTemplateStore()
const appEmails = computed(() => templates.EmailTemplates)
const emails = computed(() => Array.from(appEmails.value).map((el) => {
  return {
    ID: el.ID,
    LangID: el.LangID,
    DefaultToUsername: el.DefaultToUsername,
    UsedFor: el.UsedFor,
    Sender: el.Sender,
    ReplyTos: el.ReplyTos.join(','),
    CCTos: el.CCTos.join(','),
    Subject: el.Subject,
    Body: el.Body
  } as MyEmailTemplate
}))
const emailLoading = ref(true)

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

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as EmailTemplate)
const replyTos = ref(target.value?.ReplyTos?.join(','))
const myTarget = ref({} as unknown as MyEmailTemplate)
watch(myTarget, () => {
  target.value = {
    ID: myTarget.value.ID,
    LangID: myTarget.value.LangID,
    DefaultToUsername: myTarget.value.DefaultToUsername,
    UsedFor: myTarget.value.UsedFor,
    Sender: myTarget.value.Sender,
    ReplyTos: myTarget.value.ReplyTos?.split(','),
    CCTos: myTarget.value.CCTos?.split(','),
    Subject: myTarget.value.Subject,
    Body: myTarget.value.Body
  } as EmailTemplate
})

watch(replyTos, () => {
  target.value.ReplyTos = replyTos.value?.split(',')
})
const ccTos = ref(target.value?.CCTos?.join(','))
watch(replyTos, () => {
  target.value.CCTos = ccTos.value?.split(',')
})

const language = ref(undefined as unknown as Language)
watch(language, () => {
  target.value.LangID = language.value?.ID
})

const onMenuHide = () => {
  language.value = undefined as unknown as Language
  target.value = {} as unknown as EmailTemplate
}

const onRowClick = (template: MyEmailTemplate) => {
  myTarget.value = template
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
    templates.updateEmailTemplate({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_EMAIL_TEMPLATE',
          Message: 'MSG_UPDATE_EMAIL_TEMPLATE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  templates.createEmailTemplate({
    TargetLangID: language.value?.ID,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EMAIL_TEMPLATE',
        Message: 'MSG_CREATE_EMAIL_TEMPLATE_FAIL',
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
