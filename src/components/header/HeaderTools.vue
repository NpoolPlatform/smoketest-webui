<template>
  <div class='row'>
    <HeaderToolBtn :icon='bellIcon' />
    <LangSwitcher />
    <AvatarDropdown v-if='logined.logined' />
  </div>
</template>

<script setup lang='ts'>
import { user } from 'src/npoolstore'

import { defineAsyncComponent, computed } from 'vue'

import bellNoMsg from '../../assets/bell-no-msg.svg'
// import bellMsg from '../../assets/bell-msg.svg'

const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const HeaderToolBtn = defineAsyncComponent(() => import('src/components/header/HeaderToolBtn.vue'))
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const logined = user.useLocalUserStore()
const bellIcon = computed(() => bellNoMsg)

</script>

<style lang='sass' scoped>
</style>
