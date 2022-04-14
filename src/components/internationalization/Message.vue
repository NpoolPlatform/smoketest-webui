<template>
  <q-table
    dense
    flat
    :title='$t("MSG_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :loading='langLoading'
    :rows-per-page-options='[20]'
    selection='single'
    v-model:selected='selectedLang'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MESSAGES")'
    :rows='messages'
    :loading='messageLoading'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Message)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!language' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_LANGUAGE') }}</span>
        </div>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExport'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_MESSAGES")'
    :rows='loadedMessages'
    row-key='MessageID'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_LOAD_FILE")'
          @click='onLoadFile'
        />
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='onFileLoaded'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_SUBMIT")'
          @click='onBatchSubmit'
        />
        <div>{{ loadedFile }}</div>
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_CONTACT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.MessageID' :label='$t("MSG_MESSAGE_ID")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  formatTime,
  Language,
  Message,
  NotificationType,
  useAdminLangStore,
  useApplicationStore,
  useLangStore,
  useLocaleStore
} from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { saveAs } from 'file-saver'
import { AppID } from 'src/const/const'

const lang = useLangStore()
const adminLang = useAdminLangStore()
const locale = useLocaleStore()
const application = useApplicationStore()

const langLoading = ref(true)
const messageLoading = ref(false)

const langs = computed(() => locale.Languages)
const messages = computed(() => locale.LangMessages)
const loadedMessages = ref([] as Array<Message>)
const selectedLang = ref([] as Array<Language>)
const language = computed(() => selectedLang.value.length > 0 ? selectedLang.value[0] : undefined as unknown as Language)

watch(language, () => {
  messageLoading.value = true

  lang.getLangMessages({
    TargetLangID: language.value.ID,
    LangID: language.value.ID,
    Message: {
      Error: {
        Title: 'MSG_GET_MESSAGES',
        Message: 'MSG_GET_MESSAGES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    messageLoading.value = false
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Message)

onMounted(() => {
  application.getApplication({
    ID: AppID,
    Message: {
      Error: {
        Title: 'MSG_GET_APP',
        Message: 'MSG_GET_APP_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  lang.getLangs({
    Message: {
      Error: {
        Title: 'MSG_GET_LANGS',
        Message: 'MSG_GET_LANGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    langLoading.value = false
  })
})

const onCreate = () => {
  target.value = {} as unknown as Message
  showing.value = true
  updating.value = false
}

const onRowClick = (message: Message) => {
  target.value = message
  showing.value = true
  updating.value = true
}

interface SavedMessages {
  Languages: Array<Language>
  Language: Language
  Messages: Array<Message>
}

const onExport = () => {
  if (!language.value) {
    return
  }

  const blob = new Blob([JSON.stringify({
    Languages: locale.Languages,
    Language: language.value,
    Messages: messages.value
  })], { type: 'text/plain;charset=utf-8' })
  const filename = application.Application.App.Name + '-' +
                   language.value.Name + '-' +
                   formatTime(new Date().getTime() / 1000) +
                   '.json'
  saveAs(blob, filename)
}

const loadedFile = ref(undefined as unknown as string)
const loadFileButton = ref<HTMLInputElement>()

const onLoadFile = () => {
  loadFileButton.value?.click()
}

const onFileLoaded = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const loaded = JSON.parse(reader.result as string) as SavedMessages
      const index = locale.Languages.findIndex((el) => el.ID === loaded.Language.ID)
      locale.Languages.splice(index, index < 0 ? 0 : 1, loaded.Language)
      selectedLang.value = [loaded.Language]
      loadedMessages.value = loaded.Messages
    }
    reader.readAsText(filename)
  }
}

const onBatchSubmit = () => {
  // TODO
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    adminLang.updateMessage({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_MESSAGE',
          Message: 'MSG_UPDATE_MESSAGE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  adminLang.createMessage({
    TargetLangID: language.value.ID,
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
