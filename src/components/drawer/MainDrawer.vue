<template>
  <q-drawer v-model='leftDrawerOpen' :mini='leftDrawerMini' show-if-above bordered>
    <div class='row'>
      <q-space />
      <q-btn
        flat dense round icon='swap_horiz'
        aria-label='Menu'
        class='drawer-toggle'
        :disable='!logined.getLogined'
        @click='toggleLeftDrawer'
      />
    </div>
    <q-list separator>
      <DrawerMenu
        v-for='item in MainDrawerMenus'
        :key='item.label'
        :menu='item'
        :disable='!logined.getLogined'
        @click='onItemClick(item)'
        :mini='leftDrawerMini'
      />
    </q-list>
  </q-drawer>
</template>
<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'
import { useLoginedUserStore } from 'npool-cli-v2'
import { MainDrawerMenus } from 'src/menus/menus'
import { MenuItem, useMenuStore, HomePageBreadcrumbs } from 'src/localstore'

const DrawerMenu = defineAsyncComponent(() => import('src/components/drawer/DrawerMenu.vue'))

const logined = useLoginedUserStore()
const menus = useMenuStore()

const leftDrawerOpen = ref(true)
const leftDrawerMini = ref(!logined.getLogined)

const toggleLeftDrawer = (): void => {
  leftDrawerMini.value = !leftDrawerMini.value
}

const onItemClick = (menu: MenuItem) => {
  menus.MainBreadcrumbs = [HomePageBreadcrumbs, menu] as Array<MenuItem>
}

</script>
<style lang='sass' scoped>
.drawer-toggle
  margin-left: auto
  margin-right: auto
</style>
