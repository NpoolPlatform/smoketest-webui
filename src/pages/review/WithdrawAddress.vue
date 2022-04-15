<template>
  <WithdrawAddress />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const WithdrawAddress = defineAsyncComponent(() => import('src/components/review/WithdrawAddress.vue'))

</script>

<style lang='sass' scoped>
</style>
