<template>
  <q-layout>
    <Announcement />
    <MainHeader />

    <q-page-container>
      <router-view />
    </q-page-container>

    <LangLoader />
  </q-layout>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted } from 'vue'
import { useNotificationStore, notify } from 'npool-cli-v2'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Announcement = defineAsyncComponent(() => import('src/components/announcement/Announcement.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))

const notification = useNotificationStore()

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        notify(notif)
      }
    })
  })
})

</script>

<stype lang='sass' scoped>
.aa
  background-color: red

.bb
  height: 100% !important
  background-color: yellow
</stype>
