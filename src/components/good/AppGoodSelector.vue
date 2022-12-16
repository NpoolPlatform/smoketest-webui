<template>
  <q-select
    v-model='target'
    :options='goods'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_APP_GOODS'
    map-options
    @update:model-value='onUpdate'
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
import { useAdminAppGoodStore } from 'npool-cli-v4'
import { getAppGoods } from 'src/api/good'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const goodID = toRef(props, 'id')
const target = ref(goodID.value)

const appGood = useAdminAppGoodStore()
const appGoods = computed(() => appGood.AppGoods.AppGoods)

const goods = computed(() => Array.from(appGoods.value, (el) => {
  return {
    value: el.GoodID,
    label: `${el.GoodName} | ${el.GoodID}`
  }
}))

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
}
</script>
