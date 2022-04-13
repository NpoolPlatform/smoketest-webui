<template>
  <Contact />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Contact = defineAsyncComponent(() => import('src/components/template/Contact.vue'))

</script>

<style lang='sass' scoped>
</style>
