<template>
  <Withdraw />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Withdraw = defineAsyncComponent(() => import('src/components/billing/Withdraw.vue'))

</script>

<style lang='sass' scoped>
</style>
