<template>
  <Incoming />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Incoming = defineAsyncComponent(() => import('src/components/billing/Incoming.vue'))

</script>

<style lang='sass' scoped>
</style>
