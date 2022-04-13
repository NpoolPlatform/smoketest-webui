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
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { Language, NotificationType, useLangStore, useLocaleStore } from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'

const lang = useLangStore()
const locale = useLocaleStore()

const langLoading = ref(true)
const messageLoading = ref(false)

const langs = computed(() => locale.Languages)
const messages = computed(() => locale.LangMessages)
const selectedLang = ref([] as Array<Language>)
const language = computed(() => selectedLang.value.length > 0 ? selectedLang.value[0] : undefined as unknown as Language)

watch(language, () => {
  messageLoading.value = true

  lang.getLangMessages({
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

onMounted(() => {
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
  // TODO
}

</script>
