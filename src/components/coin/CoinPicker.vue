<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COINS'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { useAdminAppCoinStore } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
  updating?: boolean
  hiddenDisabledCoins?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const hiddenDisabledCoins = toRef(props, 'hiddenDisabledCoins')
const target = ref(id.value)

const coin = useAdminAppCoinStore()
const coins = computed(() => {
  let items = coin.AppCoins.AppCoins
  if (hiddenDisabledCoins.value) {
    items = coin.AppCoins.AppCoins.filter((el) => !el.Disabled && !el.CoinDisabled)
  }
  return Array.from(items).map((el) => {
    return {
      value: el.CoinTypeID,
      label: `${el.Name} | ${el.CoinTypeID}`
    }
  })
})
const displayCoins = ref(coins.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoins.value = coins.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 500)
  }
})
</script>
