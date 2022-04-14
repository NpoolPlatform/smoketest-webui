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
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    row-key='ID'
    :loading='appGoodLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedAppGood'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!appGood' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_APP_GOOD') }}</span>
        </div>
        <div class='column'>
          <q-space />
          <q-btn
            dense
            flat
            class='btn flat'
            :label='$t("MSG_SET_PRICE")'
            @click='onSetPriceClick'
            :disable='!appGood'
          />
        </div>
        <q-input
          dense
          flat
          class='small'
          v-if='appGood'
          v-model='appGood.Price'
          :label='$t("MSG_PRICE")'
        />
        <div class='column'>
          <q-space />
          <q-btn-toggle
            dense
            flat
            rounded
            class='toggle'
            :options='options'
            v-model='online'
            toggle-color='primary'
            size='0.625em'
            :disable='!appGood'
          />
        </div>
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { AppGood, buildGoods, NotificationType, useAdminGoodStore, useCoinStore, useGoodStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const coins = computed(() => coin.Coins)
const coinLoading = ref(true)

const good = useGoodStore()
const adminGood = useAdminGoodStore()
const goods = computed(() => buildGoods(adminGood.Goods))
const goodLoading = ref(true)

const appGoods = computed(() => good.AppGoods)
const appGoodLoading = ref(true)
const selectedAppGood = ref([] as Array<AppGood>)
const appGood = computed(() => selectedAppGood.value.length > 0 ? selectedAppGood.value[0] : undefined as unknown as AppGood)
const online = computed({
  get: () => appGood.value?.Online ? appGood.value?.Online : false,
  set: (val) => {
    onOnlineChange(val)
  }
})

interface Option {
  label: string
  value: boolean
}

const options = computed(() => [
  {
    label: t('MSG_ONSALE'),
    value: true
  }, {
    label: t('MSG_OFFSALE'),
    value: false
  }
] as Array<Option>)

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

  adminGood.getAllGoods({
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

  good.getAppGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    appGoodLoading.value = false
  })
})

const onSetPriceClick = () => {
  adminGood.setGoodPrice({
    Info: appGood.value,
    Message: {
      Error: {
        Title: 'MSG_SET_GOOD_PRICE',
        Message: 'MSG_SET_GOOD_PRICE_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onOnlineChange = (online: boolean) => {
  if (online) {
    adminGood.onlineGood({
      Info: appGood.value,
      Message: {
        Error: {
          Title: 'MSG_ONLINE_GOOD',
          Message: 'MSG_ONLINE_GOOD_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  adminGood.offlineGood({
    Info: appGood.value,
    Message: {
      Error: {
        Title: 'MSG_OFFLINE_GOOD',
        Message: 'MSG_OFFLINE_GOOD_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
