<template>
  <KYC />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const KYC = defineAsyncComponent(() => import('src/components/review/KYC.vue'))

</script>

<style lang='sass' scoped>
</style>
