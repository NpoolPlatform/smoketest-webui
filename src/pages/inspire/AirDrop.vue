<template>
  <AirDrop />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AirDrop = defineAsyncComponent(() => import('src/components/inspire/AirDrop.vue'))

</script>

<style lang='sass' scoped>
</style>
