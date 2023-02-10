<template>
  <AnnouncementState />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AnnouncementState = defineAsyncComponent(() => import('src/components/announcement/State.vue'))

</script>

<style lang='sass' scoped>
</style>
