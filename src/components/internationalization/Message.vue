<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MESSAGES")'
    :rows='displayAppMsgs'
    row-key='ID'
    :rows-per-page-options='[20, 40, 60, 80, 100, 0]'
    @row-click='(evt, row, index) => onRowClick(row as Message)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='searchStr'
          :label='$t("MSG_SEARCH")'
        />
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
    :rows='displayLoadedMsgs'
    row-key='MessageID'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='loadedSearchStr'
          :label='$t("MSG_SEARCH")'
        />
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
          :label='$t("MSG_BATCH_CREATE")'
          :disable='loadedMessages.length === 0'
          @click='onBatchCreate'
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
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>

import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { saveAs } from 'file-saver'
import { useAdminMessageStore } from 'src/teststore/g11n/message'
import { getAppMessages } from 'src/api/g11n'
import { AppLang } from 'src/teststore/g11n/applang/types'
import { Message, MessageReq } from 'src/teststore/g11n/message/types'
import { formatTime, NotifyType } from 'npool-cli-v4'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const message = useAdminMessageStore()
const messages = computed(() => message.messages())

const messageID = ref('')
const displayAppMsgs = computed(() => messages.value.filter((msg) => msg.MessageID?.toLowerCase().includes(messageID.value?.toLowerCase()) || msg.Message?.toLowerCase()?.includes(messageID.value?.toLowerCase())))

const selectedLang = ref([] as Array<AppLang>)
console.log('selectedLang: ', selectedLang)

const loadedMessages = ref([] as Array<MessageReq>)
const loadedSearchStr = ref('')
const displayLoadedMsgs = computed(() => loadedMessages.value.filter((msg) => {
  return msg.MessageID.toLowerCase().includes(loadedSearchStr.value.toLowerCase()) ||
        msg.Message.toLowerCase().includes(loadedSearchStr.value.toLowerCase())
}))

// watch(language, () => {
//   messageLoading.value = true

//   lang.getLangMessages({
//     TargetLangID: language.value.ID,
//     LangID: language.value.ID,
//     Message: {
//       Error: {
//         Title: 'MSG_GET_MESSAGES',
//         Message: 'MSG_GET_MESSAGES_FAIL',
//         Popup: true,
//         Type: NotificationType.Error
//       }
//     }
//   }, () => {
//     messageLoading.value = false
//   })
// })

const showing = ref(false)
const updating = ref(false)
const target = ref({} as Message)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: Message) => {
  showing.value = true
  updating.value = true
  target.value = { ...row }
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Message
}

const onSubmit = (done: () => void) => {
  updating.value ? updateMessage(done) : createMessage(done)
}

const createMessage = (done: () => void) => {
  message.createMessage({
    TargetLangID: '',
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_MESSAGE',
        Message: 'MSG_CREATE_MESSAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_MESSAGE',
        Message: 'MSG_CREATE_MESSAGE_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateTarget = computed(() => {
  return {
    ID: target?.value?.ID,
    Lang: target?.value?.Lang,
    MessageID: target?.value?.MessageID,
    Message: target?.value?.Message,
    GetIndex: target?.value?.GetIndex,
    Disabled: target?.value?.Disabled,
    TargetLangID: target?.value?.ID
  }
})
const updateMessage = (done: () => void) => {
  message.updateMessage({
    ...updateTarget.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_UPDATE_MESSAGE',
        Message: 'MSG_UPDATE_MESSAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_MESSAGE',
        Message: 'MSG_UPDATE_MESSAGE_FAIL',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

interface SavedMessages {
  // Languages: Array<Language>
  // Language: Language
  Messages: Array<Message>
}

const onExport = () => {
  // if (!language.value) {
  //   return
  // }

  const blob = new Blob([JSON.stringify({
    Languages: 'locale.Languages',
    Language: 'language.value',
    Messages: messages.value
  })], { type: 'text/plain;charset=utf-8' })
  const filename = 'language.value.Name' + '-' + formatTime(new Date().getTime() / 1000) + '.json'
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
      console.log('loaded: ', loaded.Messages)
      // const index = locale.Languages.findIndex((el) => el.ID === loaded.Language.ID)
      // locale.Languages.splice(index, index < 0 ? 0 : 1, loaded.Language)
      // selectedLang.value = [loaded.Language]
      // loadedLanguage.value = loaded.Language
      // loadedMessages.value = loaded.Messages
    }
    reader.readAsText(filename)
  }
}

const onBatchCreate = () => {
  message.createMessages({
    Infos: loadedMessages.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_MESSAGES',
        Message: 'MSG_CREATE_MESSAGES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  if (messages.value.length === 0) {
    getAppMessages(0, 500)
  }
})
</script>
