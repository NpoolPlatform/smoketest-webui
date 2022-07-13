<template>
  <Order />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Order = defineAsyncComponent(() => import('src/components/order/Order.vue'))

</script>

<style lang='sass' scoped>
</style>
