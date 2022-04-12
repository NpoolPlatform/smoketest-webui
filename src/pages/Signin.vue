<template>
  <div class='row'>
    <q-space />
    <Signin />
    <q-space />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Signin = defineAsyncComponent(() => import('src/components/user/Signin.vue'))

</script>

<style lang='sass' scoped>
</style>
