<template>
  <Promotion />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Promotion = defineAsyncComponent(() => import('src/components/good/Promotion.vue'))

</script>

<style lang='sass' scoped>
</style>
