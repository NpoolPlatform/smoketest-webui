<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    row-key='ID'
    :loading='coinLoading'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useCoinStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const coin = useCoinStore()

const coins = computed(() => coin.Coins)
const coinLoading = ref(true)

onMounted(() => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    coinLoading.value = false
  })
})

</script>
