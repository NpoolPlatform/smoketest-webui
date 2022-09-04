<template>
  <TransferAccounts />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TransferAccounts = defineAsyncComponent(() => import('src/components/transfer/TransferAccounts.vue'))

</script>

<style lang='sass' scoped>
</style>
