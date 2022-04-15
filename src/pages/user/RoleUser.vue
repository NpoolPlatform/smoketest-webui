<template>
  <RoleUser />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const RoleUser = defineAsyncComponent(() => import('src/components/user/RoleUser.vue'))

</script>

<style lang='sass' scoped>
</style>
