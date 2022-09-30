<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='lang'
    :options='languages'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    @update:model-value='onUpdate'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section avatar>
          <q-img fit='contain' class='icon' :src='scope.opt.icon' />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { useLocaleStore } from 'npool-cli-v2'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  language: string
  updating?: boolean
}

const props = defineProps<Props>()
const language = toRef(props, 'language')
const updating = toRef(props, 'updating')

const lang = ref(language.value)

const locale = useLocaleStore()
const languages = computed(() => Array.from(locale.Languages).map((el) => {
  return {
    value: el.ID,
    label: el.Name,
    icon: el.Logo
  }
}))

const emit = defineEmits<{(e: 'update:language', language: string): void}>()
const onUpdate = () => {
  emit('update:language', lang.value)
}

onMounted(() => {
  if (!language.value) {
    lang.value = locale.CurLang?.ID as string
    emit('update:language', lang.value)
  }
})
</script>
