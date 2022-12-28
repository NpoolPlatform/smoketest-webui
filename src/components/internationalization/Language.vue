<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as AppLang)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_APP_LANGUAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <div><q-input v-model='target.Lang' :label='$t("MSG_LANG")' /></div>
        <div><q-input v-model='target.Logo' :label='$t("MSG_LOGO")' /></div>
        <div><q-input v-model='target.Name' :label='$t("MSG_NAME")' /></div>
        <div><q-input v-model='target.Short' :label='$t("MSG_SHORT")' /></div>
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Main' :label='$t("MSG_MAIN_LANGUAGE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, useAdminAppLangStore, AppLang } from 'npool-cli-v4'
import { getAppLangs } from 'src/api/g11n'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const target = ref({} as AppLang)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: AppLang) => {
  showing.value = true
  updating.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  showing.value = false
  target.value = { Main: false } as AppLang
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  lang.updateAppLang({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_LANGUAGE',
        Message: 'MSG_UPDATE_APP_LANGUAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_APP_LANGUAGE',
        Message: 'MSG_UPDATE_APP_LANGUAGE_SUCCESS',
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

onMounted(() => {
  if (langs.value.length === 0) { getAppLangs(0, 100) }
})

</script>
