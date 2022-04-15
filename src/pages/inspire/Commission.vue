<template>
  <Commission />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Commission = defineAsyncComponent(() => import('src/components/inspire/Commission.vue'))

</script>

<style lang='sass' scoped>
</style>
