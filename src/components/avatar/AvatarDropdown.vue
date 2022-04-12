<template>
  <q-btn-dropdown
    flat
    dense
    rounded
    :ripple='false'
    size='1.3rem'
    :dropdown-icon='icon'
    auto-close
    menu-self='top end'
    color='black'
  >
    <slot />
  </q-btn-dropdown>
</template>

<script setup lang='ts'>
import { defineProps, withDefaults, computed } from 'vue'

interface Props {
  icon: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'https://cdn.quasar.dev/img/avatar.png'
})

const icon = computed(() => 'img:' + props.icon)

</script>

<style lang='sass' scoped>
</style>
