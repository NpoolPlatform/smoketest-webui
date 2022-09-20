<template>
  <q-btn
    :loading='loadingStatus'
    @click='simulateProgress'
    class='btn round'
    :label='label'
  />
</template>

<script setup lang='ts'>
import { defineEmits, ref, defineProps, toRef } from 'vue'

interface Props {
  loading: boolean;
  label: string;
}

const props = defineProps<Props>()
const loading = toRef(props, 'loading')
const label = toRef(props, 'label')

const loadingStatus = ref(false)

const emit = defineEmits<{(e: 'click', done: () => void): void}>()

const simulateProgress = () => {
  if (loading.value) {
    loadingStatus.value = true
  }
  emit('click', () => {
    loadingStatus.value = false
  })
}
</script>
