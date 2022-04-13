<template>
  <Message />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Message = defineAsyncComponent(() => import('src/components/internationalization/Message.vue'))

</script>

<style lang='sass' scoped>
</style>
