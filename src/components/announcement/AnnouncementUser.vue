<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_USERS")'
    :rows='announcementUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedAnnouncementUsers'
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
          :disable='selectedAnnouncementUsers?.length === 0'
          @click='onDelete(selectedAnnouncementUsers?.[0])'
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
        <span>{{ $t('MSG_ANNOUNCEMENT_USER') }}</span>
      </q-card-section>
      <q-card-section>
        <AnnouncementPicker v-model:id='target.AnnouncementID' label='MSG_ANNOUNCEMENT' />
        <AppUsersSelector v-if='targetAnnouncement?.AnnouncementType === AnnouncementType.AppointUsers' v-model:ids='target.UserIDs' label='MSG_USERS' />
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
import { useAdminAnnouncementUserStore } from 'src/teststore/notif/user'
import { AnnouncementUser, AnnouncementType } from 'src/teststore/notif/user/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AnnouncementPicker = defineAsyncComponent(() => import('src/components/announcement/AnnouncementPicker.vue'))
const AppUsersSelector = defineAsyncComponent(() => import('src/components/user/AppUsersSelector.vue'))

const announcementUser = useAdminAnnouncementUserStore()
const announcementUsers = computed(() => announcementUser.AnnouncementUsers.AnnouncementUsers)

const announcement = useAdminAnnouncementStore()
const targetAnnouncement = computed(() => announcement.getAnnouncementByID(target.value?.AnnouncementID))

interface MyAnnouncementUser extends AnnouncementUser {
  UserIDs: string[]
}

const target = ref({} as MyAnnouncementUser)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as MyAnnouncementUser
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  if (announcementUsers.value?.length === 0) {
    getAppAnnouncementUsers(0, 100)
  }
})

const getAppAnnouncementUsers = (offset: number, limit: number) => {
  announcementUser.getAppAnnouncementUsers({
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
  }, (error: boolean, rows: Array<AnnouncementUser>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppAnnouncementUsers(offset + limit, limit)
  })
}

const onSubmit = (done: () => void) => {
  createAnnouncementUser(done)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onRowClick = (row: MyAnnouncementUser) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const createAnnouncementUser = (done: () => void) => {
  announcementUser.createAnnouncementUsers({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ANNOUNCEMENT_USERS',
        Message: 'MSG_CREATE_ANNOUNCEMENT_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_ANNOUNCEMENT_USERS',
        Message: 'MSG_CREATE_ANNOUNCEMENT_USERS_SUCCESS',
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

const selectedAnnouncementUsers = ref([] as Array<AnnouncementUser>)
const onDelete = (row: AnnouncementUser) => {
  announcementUser.deleteAnnouncementUser({
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
    field: (row: AnnouncementUser) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: AnnouncementUser) => row.AppID
  },
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    field: (row: AnnouncementUser) => row.AnnouncementID
  },
  {
    name: 'AnnouncementType',
    label: t('MSG_ANNOUNCEMENT_TYPE'),
    field: (row: AnnouncementUser) => row.AnnouncementType
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    field: (row: AnnouncementUser) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: AnnouncementUser) => row.Content
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: AnnouncementUser) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAT',
    label: t('MSG_UPDATED_AT'),
    field: (row: AnnouncementUser) => formatTime(row.UpdatedAt)
  }
])
</script>
