<template>
  <Recommend />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Recommend = defineAsyncComponent(() => import('src/components/good/Recommend.vue'))

</script>

<style lang='sass' scoped>
</style>
