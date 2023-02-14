<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FRONTEND_TEMPLATES")'
    :rows='frontendTemplates'
    row-key='ID'
    :rows-per-page-options='[20]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as FrontendTemplate)'
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
        <span>{{ $t('MSG_NOTIF_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
        <q-select :options='UsedFors' v-model='target.UsedFor' :disable='updating' :label='$t("MSG_USED_FOR")' />
        <LanguagePicker v-model:language='target.LangID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { formatTime, NotifyType, useAdminFrontendTemplateStore, FrontendTemplate, UsedFors } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))

const notif = useAdminFrontendTemplateStore()
const frontendTemplates = computed(() => {
  const rows = notif.FrontendTemplates.FrontendTemplates
  return rows.sort((a, b) => a.UsedFor.localeCompare(b.UsedFor, 'zh-CN'))
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as FrontendTemplate)

const onMenuHide = () => {
  target.value = {} as FrontendTemplate
}

const onRowClick = (template: FrontendTemplate) => {
  target.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateFrontendTemplate(done) : createFrontendTemplate(done)
}
onMounted(() => {
  if (notif.FrontendTemplates.FrontendTemplates.length === 0) {
    getFrontendTemplate(0, 500)
  }
})

const getFrontendTemplate = (offset: number, limit: number) => {
  notif.getFrontendTemplates({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_NOTIF_TEMPLATES',
        Message: 'MSG_GET_NOTIF_TEMPLATES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<FrontendTemplate>) => {
    if (error || rows.length < limit) {
      return
    }
    getFrontendTemplate(offset + limit, limit)
  })
}

const createFrontendTemplate = (done: () => void) => {
  notif.createFrontendTemplate({
    ...target.value,
    TargetLangID: target.value.LangID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_NOTIF_TEMPLATE',
        Message: 'MSG_CREATE_NOTIF_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const updateFrontendTemplate = (done: () => void) => {
  notif.updateFrontendTemplate({
    ...target.value,
    TargetLangID: target.value.LangID,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_NOTIF_TEMPLATE',
        Message: 'MSG_UPDATE_NOTIF_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: FrontendTemplate) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: FrontendTemplate) => row.AppID
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    field: (row: FrontendTemplate) => row.LangID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    field: (row: FrontendTemplate) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: FrontendTemplate) => row.Content
  },
  {
    name: 'Sender',
    label: t('MSG_SENDER'),
    field: (row: FrontendTemplate) => row.Sender
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: FrontendTemplate) => row.UsedFor
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: FrontendTemplate) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    field: (row: FrontendTemplate) => formatTime(row.UpdatedAt)
  }
])
</script>
