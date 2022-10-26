<template>
  <q-input
    v-model='target'
    :label='label'
    type='date'
    @change='onChange'
  />
</template>
<script lang='ts' setup>
import { formatTime } from 'npool-cli-v4'
import { defineProps, defineEmits, toRef, ref, onMounted } from 'vue'
interface Props {
  date: number
  label: string
}

const props = defineProps<Props>()
const date = toRef(props, 'date')
const label = toRef(props, 'label')

const target = ref('')

const emit = defineEmits<{(e: 'update:date', target: number): void}>()

const onChange = () => {
  emit('update:date', new Date(target.value).getTime() / 1000)
}

onMounted(() => {
  if (date.value) {
    target.value = formatTime(date.value, true)?.replace(/\//g, '-')
  }
})
</script>
