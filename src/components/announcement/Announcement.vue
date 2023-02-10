<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENTS")'
    :rows='announcements'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Announcement)'
    selection='single'
    v-model:selected='selectedAnnouncements'
    :columns='columns'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedAnnouncements?.length === 0'
          @click='onDelete(selectedAnnouncements?.[0])'
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
        <span>{{ $t('MSG_ANNOUNCEMENT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' />
        <AppLanguagePicker v-model:id='target.LangID' :updating='updating' label='MSG_LANGUAGE' />
      </q-card-section>
      <q-card-section>
        <q-select
          dense
          :options='NotifChannels'
          v-model='target.Channels'
          multiple
          :label='$t("MSG_CHANNEL")'
        />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { formatTime, NotifyType } from 'npool-cli-v4'
import { useAdminAnnouncementStore } from 'src/teststore/notif/announcement'
import { Announcement, NotifChannels } from 'src/teststore/notif/announcement/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))

const announcement = useAdminAnnouncementStore()
const announcements = computed(() => announcement.Announcements.Announcements)

const target = ref({} as Announcement)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as Announcement
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  if (announcements.value?.length === 0) {
    getAppAnnouncements(0, 100)
  }
})

const getAppAnnouncements = (offset: number, limit: number) => {
  announcement.getAppAnnouncements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Announcement>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppAnnouncements(offset + limit, limit)
  })
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAnnouncement(done) : createAnnouncement(done)
}

const onRowClick = (row: Announcement) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const updateAnnouncement = (done: () => void) => {
  announcement.updateAnnouncement({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_ANNOUNCEMENT',
        Message: 'MSG_UPDATE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_ANNOUNCEMENT',
        Message: 'MSG_UPDATE_ANNOUNCEMENT_SUCCESS',
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

const createAnnouncement = (done: () => void) => {
  announcement.createAnnouncement({
    ...target.value,
    TargetLangID: target.value?.LangID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ANNOUNCEMENT',
        Message: 'MSG_CREATE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_ANNOUNCEMENT',
        Message: 'MSG_CREATE_ANNOUNCEMENT_SUCCESS',
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

const selectedAnnouncements = ref([] as Array<Announcement>)
const onDelete = (row: Announcement) => {
  announcement.deleteAnnouncement({
    ID: row.ID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ANNOUNCEMENT',
        Message: 'MSG_DELETE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_ANNOUNCEMENT',
        Message: 'MSG_DELETE_ANNOUNCEMENT_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Announcement) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: Announcement) => row.AppID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    field: (row: Announcement) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: Announcement) => row.Content
  },
  {
    name: 'Channels',
    label: t('MSG_CHANNELS'),
    field: (row: Announcement) => row.Channels?.join(',')
  },
  {
    name: 'SendChannel',
    label: t('MSG_SEND_CHANNEL'),
    field: (row: Announcement) => row.SendChannel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: Announcement) => formatTime(row.CreatedAt)
  },
  {
    name: 'END_AT',
    label: t('MSG_END_AT'),
    field: (row: Announcement) => formatTime(row.EndAt)
  }
])
</script>
