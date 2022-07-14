<template>
  <FixAmount />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const FixAmount = defineAsyncComponent(() => import('src/components/inspire/FixAmount.vue'))

</script>

<style lang='sass' scoped>
</style>
