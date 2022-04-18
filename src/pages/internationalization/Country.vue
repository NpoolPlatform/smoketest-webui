<template>
  <Country />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Country = defineAsyncComponent(() => import('src/components/internationalization/Country.vue'))

</script>

<style lang='sass' scoped>
</style>
