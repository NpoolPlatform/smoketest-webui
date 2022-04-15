<template>
  <Payment />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Payment = defineAsyncComponent(() => import('src/components/review/Payment.vue'))

</script>

<style lang='sass' scoped>
</style>
