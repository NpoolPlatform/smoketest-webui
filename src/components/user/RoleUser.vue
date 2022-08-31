<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLE_USERS")'
    :rows='roleUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedRoleUser'
    :loading='roleUserLoading'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='roleUsername'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDeleteRoleUser'
          :disable='selectedRoleUser.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedRole'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_ADD")'
          @click='onAddRoleUser'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import {
  NotifyType,
  User,
  AppRoleUser,
  Role,
  useAdminRoleStore,
  useAdminUserStore,
  formatTime
} from 'npool-cli-v4'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles?.join(',')
  },
  {
    name: 'IDNUMBER',
    label: t('MSG_IDNUMBER'),
    field: (row: User) => row.IDNumber
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])

const role = useAdminRoleStore()
const roles = computed(() => role.Roles.Roles)
const roleLoading = ref(false)
const selectedRole = ref([] as Array<Role>)

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)
const userLoading = ref(false)
const selectedUser = ref([] as Array<User>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const roleUsername = ref('')
const selectedRoleUser = ref([] as Array<AppRoleUser>)
const roleUsers = computed(() => {
  return role.RoleUsers.RoleUsers.filter((el) => el.EmailAddress?.includes(roleUsername.value) || el.PhoneNO?.includes(roleUsername.value))
})

const roleUserLoading = ref(false)
const getRoleUsers = (offset: number, limit: number) => {
  role.getRoleUsers({
    Offset: offset,
    Limit: limit,
    RoleID: selectedRole.value[0]?.ID,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLE_USERS',
        Message: 'MSG_GET_ROLE_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (roleUsers: Array<AppRoleUser>, error: boolean) => {
    if (error || roleUsers.length < limit) {
      roleUserLoading.value = false
      return
    }
    getRoleUsers(offset + limit, limit)
  })
}
watch(selectedRole, () => {
  role.RoleUsers.RoleUsers = [] as Array<AppRoleUser>
  if (selectedRole.value.length > 0) {
    roleUserLoading.value = true
    getRoleUsers(0, 500)
  }
})

const getUsers = (offset: number, limit: number) => {
  user.getUsers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<User>, error: boolean) => {
    if (error || resp.length < limit) {
      userLoading.value = false
      return
    }
    getUsers(offset + limit, limit)
  })
}

const getRoles = (offset: number, limit: number) => {
  role.getRoles({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<Role>, error: boolean) => {
    if (error || resp.length < limit) {
      roleLoading.value = false
      return
    }
    getRoles(offset + limit, limit)
  })
}
onMounted(() => {
  if (role.Roles.Roles.length === 0) {
    roleLoading.value = true
    getRoles(0, 100)
  }

  if (user.Users.Users.length === 0) {
    userLoading.value = true
    getUsers(0, 500)
  }
})

const onAddRoleUser = () => {
  if (selectedRole.value.length === 0 || selectedUser.value.length === 0) {
    return
  }
  role.createRoleUser({
    TargetUserID: selectedUser.value[0].ID,
    RoleID: selectedRole.value[0].ID,
    Message: {
      Error: {
        Title: 'MSG_ADD_ROLE_USER',
        Message: 'MSG_ADD_ROLE_USER_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteRoleUser = () => {
  if (selectedRoleUser.value.length === 0) {
    return
  }

  role.deleteRoleUser({
    RoleUserID: selectedRoleUser.value[0].ID,
    // RoleID: selectedRoleUser.value[0].
    Message: {
      Error: {
        Title: 'MSG_DELETE_ROLE_USER',
        Message: 'MSG_DELETE_ROLE_USER_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
