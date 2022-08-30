<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[20]'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, Role, useAdminRoleStore } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const role = useAdminRoleStore()
const roles = computed(() => role.Roles.Roles)
const roleLoading = ref(false)

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
})

</script>
