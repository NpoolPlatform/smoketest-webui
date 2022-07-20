<template>
  <Relation />
</template>
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
const Relation = defineAsyncComponent(() => import('src/components/inspire/Relation.vue'))
</script>

<style lang='sass' scoped>
</style>
