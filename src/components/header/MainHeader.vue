<template>
  <q-toolbar class='header'>
    <Logo class='logo' />
    <q-space />
    <HeaderTools />
  </q-toolbar>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Logo = defineAsyncComponent(() => import('src/components/logo/Logo.vue'))
const HeaderTools = defineAsyncComponent(() => import('src/components/header/HeaderTools.vue'))

</script>

<style lang='sass' scoped>
.header
  height: 60px
  padding: 0 60px
  background-color: $grey-2

.logo
  max-height: 80%
  width: 80px
</style>
