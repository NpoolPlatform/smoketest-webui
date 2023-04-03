<template>
  <div class='column justify-center signin'>
    <div class='row justify-center'>
      <Signin />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Signin = defineAsyncComponent(() => import('src/components/user/Signin.vue'))

</script>

<style lang='sass' scoped>
.signin
  margin-top: 200px
</style>
