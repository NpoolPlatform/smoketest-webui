<template>
  <Good />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Good = defineAsyncComponent(() => import('src/components/good/Good.vue'))

</script>

<style lang='sass' scoped>
</style>
