<template>
  <Event />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Event = defineAsyncComponent(() => import('src/components/inspire/Event.vue'))

</script>

<style lang='sass' scoped>
</style>
