<template>
  <q-table
    dense
    flat
    :rows='currencies'
    row-key='ID'
    :title='$t("MSG_ORACLE_CURRENCIES")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as CoinCurrency)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_COIN_CURRENCY') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select dense :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN")' />
        <q-select dense :options='CurrencyMethods' v-model='target.CurrencyMethod' :label='$t("MSG_CURRENCY_METHOD")' />
        <div v-if='target.CurrencyMethod === CurrencyMethod.FixAmount'>
          <q-input
            type='number'
            v-model='target.PriceVSUSDT'
            :suffix='PriceCoinName'
            :label='$t("MSG_COIN_CURRENCY")'
          />
          <q-input
            type='number'
            v-model='target.AppPriceVSUSDT'
            :suffix='PriceCoinName'
            :label='$t("MSG_APP_COIN_CURRENCY")'
          />
        </div>
        <q-input
          v-else
          type='number'
          v-model='target.OverPercent'
          suffix='%'
          :label='$t("MSG_APP_OVER_PERCENT")'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useCoinStore,
  NotificationType,
  Coin,
  CoinCurrency,
  PriceCoinName,
  useCurrencyStore,
  Currency,
  CurrencyMethods,
  CurrencyMethod,
  useAdminOracleStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const coin = useCoinStore()

interface MyCoin {
  label: string
  value: Coin
}
const coins = computed(() => Array.from(coin.Coins).map((el) => {
  return {
    label: el.Name,
    value: el
  } as MyCoin
}))

const oracle = useAdminOracleStore()

interface MyCurrency extends CoinCurrency {
  CoinName: string
}

const appCurrencies = computed(() => oracle.Currencies)
const currencies = computed(() => Array.from(appCurrencies.value as Array<CoinCurrency>).map((el) => {
  const r = el as MyCurrency
  r.CoinName = coin.getCoinByID(el.CoinTypeID)?.Name as string
  return r
}))

const prepare = () => {
  oracle.getCurrencies({
    Message: {
      Error: {
        Title: 'MSG_GET_CURRENCIES',
        Message: 'MSG_GET_CURRENCIES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

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
    // TODO
  })

  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as CoinCurrency)

const currency = useCurrencyStore()

const selectedCoin = computed({
  get: () => {
    return {
      label: coin.getCoinByID(target.value?.CoinTypeID)?.Name,
      value: coin.getCoinByID(target.value?.CoinTypeID)
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinTypeID = val.value?.ID as string
    currency.getCoinCurrency(val.value, Currency.USD, (amount: number) => {
      target.value.PriceVSUSDT = amount
    })
  }
})

const onRowClick = (currency: CoinCurrency) => {
  target.value = currency
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as CoinCurrency
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    oracle.updateCurrency({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_COIN_CURRENCY',
          Message: 'MSG_UPDATE_COIN_CURRENCY_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  oracle.createCurrency({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN_CURRENCY',
        Message: 'MSG_CREATE_COIN_CURRENCY_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  onMenuHide()
}

</script>
