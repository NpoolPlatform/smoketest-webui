<template>
  <Offline />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Offline = defineAsyncComponent(() => import('src/components/order/Offline.vue'))

</script>

<style lang='sass' scoped>
</style>
