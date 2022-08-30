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
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, useAdminUserStore, User } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)
const userLoading = ref(false)

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

onMounted(() => {
  if (user.Users.Users.length === 0) {
    userLoading.value = true
    getUsers(0, 500)
  }
})

</script>
