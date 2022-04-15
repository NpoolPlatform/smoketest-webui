<template>
  <InvitationCode />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const InvitationCode = defineAsyncComponent(() => import('src/components/inspire/InvitationCode.vue'))

</script>

<style lang='sass' scoped>
</style>
