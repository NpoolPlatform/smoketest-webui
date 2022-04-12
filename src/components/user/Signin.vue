<template>
  <div>
    <q-input
      v-model='account'
      :label='$t("MSG_ACCOUNT")'
    >
      <template #prepend>
        <q-icon name='account_circle' />
      </template>
    </q-input>
    <q-input
      v-model='password'
      :label='$t("MSG_PASSWORD")'
    >
      <template #prepend>
        <q-icon name='lock' />
      </template>
    </q-input>
    <div class='row'>
      <q-btn
        no-caps
        :label='$t("MSG_SIGNIN")'
        @click='onLoginClick'
      />
      <q-btn
        no-caps
        :label='$t("MSG_CONTACT_ADMIN")'
      />
    </div>
  </div>
</template>

<script setup lang='ts'>

</script>

<style lang='sass' scoped>
</style>
