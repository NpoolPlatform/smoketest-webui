<template>
  <q-table
    dense
    flat
    :rows='descriptions'
    row-key='ID'
    :title='$t("MSG_COIN_DESCRIPTIONS")'
    :rows-per-page-options='[5]'
    @row-click='(evt, row, index) => onRowClick(row as CoinDescription)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_DESCRIPTION")'
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
        <span>{{ $t('MSG_CREATE_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' type='textarea' />
      </q-card-section>
      <q-card-section>
        <q-select dense :options='CoinDescriptionUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useAdminCoinDescriptionStore, CoinDescription, NotifyType, CoinDescriptionUsedFors } from 'npool-cli-v4'
import { getCoinDescriptions } from 'src/api/coin'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const description = useAdminCoinDescriptionStore()
const descriptions = computed(() => description.CoinDescriptions.CoinDescriptions)

const showing = ref(false)
const updating = ref(false)
const target = ref({} as CoinDescription)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: CoinDescription) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as CoinDescription
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCoinDescription(done) : createCoinDescription(done)
}

const updateTarget = computed(() => {
  return {
    TargetAppID: target.value?.AppID,
    ID: target.value?.ID,
    AppID: target.value?.AppID,
    Title: target.value?.Title,
    Message: target.value?.Message
  }
})

const updateCoinDescription = (done: () => void) => {
  description.updateCoinDescription({
    ...updateTarget.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_UPDATE_DESCRIPTION',
        Message: 'MSG_UPDATE_DESCRIPTION_FAIL',
        Popup: true,
        Type: NotifyType.Error
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

const createCoinDescription = (done: () => void) => {
  description.createCoinDescription({
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_DESCRIPTION',
        Message: 'MSG_CREATE_DESCRIPTION_FAIL',
        Popup: true,
        Type: NotifyType.Error
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
  prepare()
})

const prepare = () => {
  if (descriptions.value.length === 0) {
    getCoinDescriptions(0, 500)
  }
}

</script>
