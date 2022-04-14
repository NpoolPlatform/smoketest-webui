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
    :title='$t("MSG_APP_LANGUAGES")'
    :rows='appLangs'
    :loading='appLangLoading'
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
          :label='$t("MSG_ADD")'
          @click='onAdd'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { Language, NotificationType, useAdminLangStore, useLangStore, useLocaleStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const lang = useAdminLangStore()
const appLang = useLangStore()
const locale = useLocaleStore()

const langLoading = ref(true)
const appLangLoading = ref(true)

const langs = computed(() => lang.Languages)
const appLangs = computed(() => locale.Languages)
const selectedLang = ref([] as Array<Language>)
const language = computed(() => selectedLang.value.length > 0 ? selectedLang.value[0] : undefined as unknown as Language)

onMounted(() => {
  appLang.getLangs({
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

  appLang.getLangs({
    Message: {
      Error: {
        Title: 'MSG_GET_LANGS',
        Message: 'MSG_GET_LANGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    appLangLoading.value = false
  })
})

const onAdd = () => {
  if (!language.value) {
    return
  }

  lang.createLang({
    Info: {
      LangID: language.value.ID
    },
    Message: {
      Error: {
        Title: 'MSG_GET_LANGS',
        Message: 'MSG_GET_LANGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
