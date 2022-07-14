<template>
  <Announcement />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Announcement = defineAsyncComponent(() => import('src/components/mailbox/Announcement.vue'))

</script>

<style lang='sass' scoped>
</style>
