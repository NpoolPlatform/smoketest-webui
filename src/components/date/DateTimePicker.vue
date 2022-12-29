<template>
  <div class='q-pa-md'>
    <q-input filled v-model='target'>
      <template #prepend>
        <q-icon name='event' class='cursor-pointer'>
          <q-popup-proxy cover transition-show='scale' transition-hide='scale'>
            <q-date v-model='target' mask='YYYY-MM-DD HH:mm:ss'>
              <div class='row items-center justify-end'>
                <q-btn v-close-popup label='Close' color='primary' flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template #append>
        <q-icon name='access_time' class='cursor-pointer'>
          <q-popup-proxy cover transition-show='scale' transition-hide='scale'>
            <q-time v-model='target' mask='YYYY-MM-DD HH:mm:ss' format24h>
              <div class='row items-center justify-end'>
                <q-btn v-close-popup label='Close' color='primary' flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
<script lang='ts' setup>
import { formatTime } from 'npool-cli-v4'
import { defineProps, defineEmits, toRef, ref, onMounted, watch } from 'vue'
interface Props {
  date: number
  label?: string
}

const props = defineProps<Props>()
const date = toRef(props, 'date')
const label = toRef(props, 'label')

console.log('label: ', label)
const target = ref('')

const emit = defineEmits<{(e: 'update:date', target: number): void}>()

watch(target, () => {
  emit('update:date', new Date(target.value).getTime() / 1000)
})
// const onChange = () => {
//   emit('update:date', new Date(target.value).getTime() / 1000)
// }

onMounted(() => {
  if (date.value) {
    target.value = formatTime(date.value, true)?.replace(/\//g, '-')
  }
})
</script>
