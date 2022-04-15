<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='users'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useUsersStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const user = useUsersStore()
const users = computed(() => Array.from(user.Users).map((user) => user.User))
const userLoading = ref(true)

onMounted(() => {
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

</script>
