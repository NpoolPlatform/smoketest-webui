<template>
  <q-footer class='bg-blue-4'>
    <div class='row' :style='{lineHeight: "100%", padding: "4px"}'>
      <q-icon class='icon start ' name='copyright' />
      {{ $t('MSG_DASHBOARD_COPYRIGHT', { THIS_YEAR: new Date().getFullYear() }) }}
    </div>
  </q-footer>
</template>

<style lang='sass' scoped>
.announcement
  color: $blue-6
</style>
