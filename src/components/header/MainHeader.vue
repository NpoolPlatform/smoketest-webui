<template>
  <q-header class='header'>
    <q-toolbar>
      <Logo class='logo' />
      <q-space />
      <HeaderTools />
    </q-toolbar>
  </q-header>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Logo = defineAsyncComponent(() => import('src/components/logo/Logo.vue'))
const HeaderTools = defineAsyncComponent(() => import('src/components/header/HeaderTools.vue'))

</script>

<style lang='sass' scoped>
.header
  height: 48px
  padding: 0 60px
  background-color: $blue-4

.logo
  max-height: 100%
  width: 64px
</style>
