<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    row-key='ID'
    :loading='coinLoading'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :loading='goodLoading'
    :rows-per-page-options='[10]'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { buildGoods, NotificationType, useCoinStore, useGoodStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const coin = useCoinStore()
const coins = computed(() => coin.Coins)
const coinLoading = ref(true)

const good = useGoodStore()
const goods = computed(() => buildGoods(good.Goods))
const goodLoading = ref(true)

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

  good.getGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_GOODS',
        Message: 'MSG_GET_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    goodLoading.value = false
  })
})

</script>
