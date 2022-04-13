<template>
  <Email />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Email = defineAsyncComponent(() => import('src/components/template/Email.vue'))

</script>

<style lang='sass' scoped>
</style>
