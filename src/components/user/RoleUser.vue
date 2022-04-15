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
  />
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
    :rows='users'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
  >
    <template #top-right>
      <div class='row indent flat'>
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
import { AppRole, AppUser, NotificationType, useRoleStore, useUsersStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const role = useRoleStore()
const roles = computed(() => role.Roles)
const roleLoading = ref(true)
const selectedRole = ref([] as Array<AppRole>)

const user = useUsersStore()
const users = computed(() => Array.from(user.Users).map((el) => el.User))
const userLoading = ref(true)
const selectedUser = ref([] as Array<AppUser>)

const roleUsers = computed(() => Array.from(user.Users.filter((user) => user.Roles && user.Roles?.findIndex((role) => role.ID === selectedRole.value[0]?.ID) >= 0)).map((el) => el.User))
const selectedRoleUser = ref([] as Array<AppUser>)

onMounted(() => {
  role.getRoles({
    Message: {
      Error: {
        Title: 'MSG_GET_ROLES',
        Message: 'MSG_GET_ROLES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    roleLoading.value = false
  })

  user.getUsers({
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    userLoading.value = false
  })
})

const onAddRoleUser = () => {
  // TODO
}

</script>
