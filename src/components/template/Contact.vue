<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CONTACTS")'
    :rows='contacts'
    row-key='ID'
    :loading='contactLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Contact)'
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
        <span>{{ $t('MSG_CREATE_CONTACT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='MessageUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-select :options='ContactTypes' v-model='target.AccountType' :label='$t("MSG_CONTACT_TYPE")' />
        <q-input v-model='target.Account' :label='$t("MSG_ACCOUNT")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, useTemplateStore, Contact, ContactTypes, MessageUsedFors } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const templates = useTemplateStore()
const contacts = computed(() => templates.Contacts)
const contactLoading = ref(true)

onMounted(() => {
  templates.getContacts({
    Message: {
      Error: {
        Title: 'MSG_GET_CONTACTS',
        Message: 'MSG_GET_CONTACTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    contactLoading.value = false
  })
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as Contact)

const onMenuHide = () => {
  target.value = {} as unknown as Contact
}

const onRowClick = (template: Contact) => {
  target.value = template
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
    templates.updateContact({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_CONTACT',
          Message: 'MSG_UPDATE_CONTACT_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  templates.createContact({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_CONTACT',
        Message: 'MSG_CREATE_CONTACT_FAIL',
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
