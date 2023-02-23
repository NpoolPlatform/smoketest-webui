<template>
  <q-table
    dense
    flat
    :title='$t("MSG_NOTIFS")'
    :rows='displayNotifs'
    row-key='ID'
    :rows-per-page-options='[80]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, useAdminNotifStore, Notif } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const notif = useAdminNotifStore()
const notifs = computed(() => notif.Notifs.Notifs)

const username = ref('')
const displayNotifs = computed(() => notif.getNotifsByName(username.value?.toLocaleLowerCase()))

onMounted(() => {
  if (notifs.value?.length === 0) {
    getAppNotifs(0, 500)
  }
})

const getAppNotifs = (offset: number, limit: number) => {
  notif.getAppNotifs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_NOTIFS'),
        Message: t('MSG_GET_NOTIFS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Notif>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppNotifs(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Notif) => row.ID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: Notif) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: Notif) => row.Content
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: Notif) => row.Channel
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: Notif) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: Notif) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: Notif) => row.PhoneNO
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: Notif) => row.EventType
  },
  {
    name: 'Notified',
    label: t('MSG_NOTIFIED'),
    sortable: true,
    field: (row: Notif) => row.Notified
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    sortable: true,
    field: (row: Notif) => row.LangID
  },
  {
    name: 'Lang',
    label: t('MSG_LANG'),
    field: (row: Notif) => row.Lang
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: Notif) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: Notif) => formatTime(row.UpdatedAt)
  }
])
</script>
