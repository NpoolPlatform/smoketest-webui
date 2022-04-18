<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    :loading='countryLoading'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import {
  NotificationType,
  useLangStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const lang = useLangStore()
const countries = computed(() => lang.Countries)
const countryLoading = ref(true)

onMounted(() => {
  lang.getCountries({
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    countryLoading.value = false
  })
})

</script>
