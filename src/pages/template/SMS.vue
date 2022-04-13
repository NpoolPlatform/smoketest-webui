<template>
  <SMS />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const SMS = defineAsyncComponent(() => import('src/components/template/SMS.vue'))

</script>

<style lang='sass' scoped>
</style>
