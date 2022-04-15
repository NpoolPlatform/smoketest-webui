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
import { NotificationType, useRoleStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const role = useRoleStore()
const roles = computed(() => role.Roles)
const roleLoading = ref(true)

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
})

</script>
