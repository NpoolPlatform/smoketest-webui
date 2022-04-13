<template>
  <Language />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Language = defineAsyncComponent(() => import('src/components/internationalization/Language.vue'))

</script>

<style lang='sass' scoped>
</style>
