<template>
  <Notif />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Notif = defineAsyncComponent(() => import('src/components/template/Notif.vue'))

</script>

<style lang='sass' scoped>
</style>
