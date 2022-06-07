<template>
  <Currency />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Currency = defineAsyncComponent(() => import('src/components/coin/Currency.vue'))

</script>

<style lang='sass' scoped>
</style>
