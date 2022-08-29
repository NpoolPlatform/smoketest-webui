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
import { NotifyType, useAdminRoleStore } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const role = useAdminRoleStore()
const roles = computed(() => role.Roles.Roles)
const roleLoading = ref(false)

onMounted(() => {
  if (role.Roles.Roles.length === 0) {
    roleLoading.value = true
    role.getRoles({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: 'MSG_GET_ROLES',
          Message: 'MSG_GET_ROLES_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      roleLoading.value = false
    })
  }
})

</script>
