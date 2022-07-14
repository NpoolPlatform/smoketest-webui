<template>
  <SpecialOffer />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const SpecialOffer = defineAsyncComponent(() => import('src/components/inspire/SpecialOffer.vue'))

</script>

<style lang='sass' scoped>
</style>
