<template>
  <div class='row'>
    <q-btn>{{ $t('MSG_HOME') }}</q-btn>
    <q-btn>{{ $t('MSG_MARKET_PLACE') }}</q-btn>
    <HeaderToolBtn :icon='bellIcon' />
    <AvatarDropdown v-if='logined' />
    <q-separator vertical color='white' class='separator' />
    <LangSwitcher />
  </div>
</template>

<script setup lang='ts'>
import { useLoginedUserStore, useMailboxStore } from 'npool-cli-v2'
import { defineAsyncComponent, computed } from 'vue'

import bellNoMsg from '../../assets/BellNoMsg.svg'
import bellMsg from '../../assets/BellMsg.svg'

const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const HeaderToolBtn = defineAsyncComponent(() => import('src/components/header/HeaderToolBtn.vue'))
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const loginedUsed = useLoginedUserStore()
const logined = loginedUsed.getLogined

const mailbox = useMailboxStore()
const bellIcon = computed(() => mailbox.Notifications.length > 0 ? bellMsg : bellNoMsg)

</script>

<style lang='sass' scoped>
.icon
  width: 24px
  height: 24px

.separator
  margin: 6% 22px 6% 22px
</style>
