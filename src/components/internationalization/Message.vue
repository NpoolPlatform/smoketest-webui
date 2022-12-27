<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MESSAGES")'
    :rows='displayAppMsgs'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Message)'
    v-model:selected='selectedMessages'
    selection='single'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='messageID'
          :label='$t("MSG_MESSAGE_ID")'
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
          :label='$t("MSG_DELETE")'
          :disable='selectedMessages.length === 0'
          @click='onDelete'
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
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ updating ? $t('MSG_UPDATE_MESSAGE') : $t('MSG_CREATE_MESSAGE') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <AppLanguagePicker v-model:id='targetLangID' label='MSG_SELECT_LANGUAGE' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <span> {{ target?.Lang }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.MessageID' :label='$t("MSG_MESSAGE_ID")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model.number='target.GetIndex' :label='$t("MSG_GET_INDEX")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_MESSAGES")'
    row-key='ID'
    :rows-per-page-options='[10]'
    :rows='loadedMessages'
  >
    <template #top-right>
      <div class='row indent flat'>
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='uploadFile'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_IMPORT")'
          @click='loadFileButton?.click()'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_BATCH_CREATE")'
          :disable='loadedMessages.length === 0'
          @click='onBatchClick'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='batchCreating'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_BATCH_CREATE_MESSAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <AppLanguagePicker v-model:id='langID' label='MSG_CURRENT_MESSAGES_LANGUAGE' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onBatchSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onBatchCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>

import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { getMessages } from 'src/api/g11n'
import { Message, MessageReq } from 'src/teststore/g11n/message/types'
import { NotifyType, formatTime } from 'npool-cli-v4'
import saveAs from 'file-saver'
import { useAdminMessageStore } from 'src/teststore/g11n/message'
import { useLocalLangStore } from 'src/teststore/lang'
import { AppID } from 'src/const/const'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))

const message = useAdminMessageStore()
const messages = computed(() => message.messages())

const messageID = ref('')
const displayAppMsgs = computed(() => messages.value.filter((msg) => msg.MessageID?.toLowerCase().includes(messageID.value?.toLowerCase()) || msg.Message?.toLowerCase()?.includes(messageID.value?.toLowerCase())))

const targetLangID = ref('')
const target = ref({} as Message)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value.GetIndex = 0
}

const onMenuHide = () => {
  target.value = {} as Message
  showing.value = false
}

const onRowClick = (row: Message) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const selectedMessages = ref([] as Array<Message>)
const onExport = () => {
  const resultMap = new Map<string, Array<Message>>()
  messages.value.forEach((el) => {
    let data = resultMap.get(el.LangID)
    if (!data) {
      data = []
    }
    data.push(el)
    resultMap.set(el.LangID, data)
  })
  resultMap.forEach((values, _key) => {
    if (values.length > 0) {
      console.log('_key: ', _key)
      const blob = new Blob([JSON.stringify(values)], { type: 'text/plain;charset=utf-8' })
      const filename = 'messages-' + values[0].Lang + '-' + formatTime(new Date().getTime() / 1000) + '.json'
      saveAs(blob, filename)
    }
  })
}

const onSubmit = (done: () => void) => {
  updating.value ? updateMessage(done) : createMessage(done)
}

const createMessage = (done: () => void) => {
  message.createMessage({
    TargetLangID: targetLangID.value,
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
    Disabled: target?.value?.Disabled
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

const onDelete = () => {
  message.deleteMessage({
    ID: selectedMessages?.value[0].ID,
    NotifyMessage: {
      Error: {
        Title: 'MSG_DELETE_MESSAGE',
        Message: 'MSG_DELETE_MESSAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_MESSAGE',
        Message: 'MSG_DELETE_MESSAGE_FAIL',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const loadedMessages = ref([] as Array<Message>)
const loadFileButton = ref<HTMLInputElement>()

const uploadFile = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      loadedMessages.value = JSON.parse(reader.result as string) as Array<Message>
    }
    reader.readAsText(filename)
  }
}

const importMessages = computed(() => {
  return Array.from(loadedMessages.value).map((el) => {
    return {
      ID: el.ID,
      AppID: AppID,
      LangID: el.LangID,
      MessageID: el.MessageID,
      Message: el.Message,
      GetIndex: el.GetIndex,
      Disabled: el.Disabled
    } as MessageReq
  })
})

const locale = useLocalLangStore()
const langID = ref(locale?.AppLang?.LangID)

const batchCreating = ref(false)

const onBatchClick = () => {
  batchCreating.value = true
}

const onBatchCancel = () => {
  batchCreating.value = false
}

const onBatchSubmit = (done: () => void) => {
  message.createMessages({
    TargetLangID: langID.value,
    Infos: importMessages.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COUNTRIES',
        Message: 'MSG_CREATE_COUNTRIES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_BATCH_CREATE_COUNTRIES',
        Message: 'MSG_BATCH_CREATE_COUNTRIES_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onBatchCancel()
  })
}

const prepare = () => {
  if (messages.value?.length === 0) {
    getMessages(0, 200)
  }
}

onMounted(() => {
  prepare()
})
</script>
