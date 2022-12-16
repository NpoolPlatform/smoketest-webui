<template>
  <Description />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Description = defineAsyncComponent(() => import('src/components/coin/Description.vue'))

</script>

<style lang='sass' scoped>
</style>
