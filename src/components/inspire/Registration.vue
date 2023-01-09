<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REGISTRATION")'
    :rows='displayRegistrations'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
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
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <!-- <AppUserSelector v-model:id='target.UserID' /> -->
      </q-card-section>
      <q-card-section>
        <AppUserSelector v-model:id='target.InviteeID' :label='$t("MSG_INVITER")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useAdminRegistrationStore } from 'src/teststore/invitation/registration'
import { Registration } from 'src/teststore/invitation/registration/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppUserSelector from '../user/AppUserSelector.vue'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const registration = useAdminRegistrationStore()
const registrations = computed(() => registration.Registrations.Registrations)

const username = ref('')
const displayRegistrations = computed(() => registrations.value.filter((el) => {
  const _username = username.value.toLowerCase()
  return el.InviteeEmailAddress.toLowerCase().includes(_username) || el.InviteePhoneNO.toLowerCase().includes(_username)
}))

const target = ref({} as Registration)
const showing = ref(false)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Registration
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  registration.updateRegistration({
    ID: target.value.ID,
    InviterID: target.value.InviterID,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_REGISTRATION'),
        Message: t('MSG_UPDATE_REGISTRATION_FAIL'),
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
  if (registrations.value.length === 0) {
    getRegistrations(0, 500)
  }
})

const getRegistrations = (offset: number, limit: number) => {
  registration.getRegistrations({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_REGISTRATIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Registration>) => {
    if (error || rows.length < limit) {
      return
    }
    getRegistrations(offset + limit, limit)
  })
}
</script>
