<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENTS")'
    :rows='announcements'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Announcement)'
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
        <span>{{ $t('MSG_CREATE_ANNOUNCEMENT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' />
      </q-card-section>
      <q-card-section>
        <q-select
          v-if='!updating'
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
import { NotifyType } from 'npool-cli-v4'
import { useAdminAnnouncementStore } from 'src/teststore/notif/announcement'
import { Announcement, NotifChannels } from 'src/teststore/notif/announcement/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

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
    Channels: [],
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

</script>
