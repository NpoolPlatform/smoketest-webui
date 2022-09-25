<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CONTACTS")'
    :rows='contacts'
    row-key='ID'
    :loading='contactsLoading'
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
        <q-select :options='UsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-select :options='SignMethodTypes' v-model='target.AccountType' :label='$t("MSG_CONTACT_TYPE")' />
        <q-input v-model='target.Account' :label='$t("MSG_ACCOUNT")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
      </q-card-section>
      <q-item class='row'>
        <!-- <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' /> -->
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='updating ? updateContact : createContact' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useAdminContactStore, Contact, NotifyType, UsedFors, SignMethodTypes } from 'npool-cli-v4'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const contact = useAdminContactStore()
const contacts = computed(() => contact.Contacts.Contacts)
const contactsLoading = ref(true)

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

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

onMounted(() => {
  if (contact.Contacts.Contacts.length === 0) {
    getContacts(0, 500)
  }
})

const getContacts = (offset: number, limit: number) => {
  contact.getContacts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_CONTACTS',
        Message: 'MSG_GET_CONTACTS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (contacts: Array<Contact>, error: boolean) => {
    if (error || contacts.length < limit) {
      contactsLoading.value = false
      return
    }
    getContacts(offset + limit, limit)
  })
}

const updateContact = (done: () => void) => {
  contact.updateContact({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_CONTACT',
        Message: 'MSG_UPDATE_CONTACT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (template: Contact, error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const createContact = (done: () => void) => {
  contact.createContact({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_CONTACT',
        Message: 'MSG_CREATE_CONTACT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (template: Contact, error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
</script>
