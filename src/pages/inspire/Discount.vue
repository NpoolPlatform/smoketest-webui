<template>
  <Discount />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Discount = defineAsyncComponent(() => import('src/components/inspire/Discount.vue'))

</script>

<style lang='sass' scoped>
</style>
