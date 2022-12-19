<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { getCountries } from 'src/api/g11n'
import { useAdminAppCountryStore } from 'src/teststore/g11n/appcountry'
import { computed, onMounted } from 'vue'

const country = useAdminAppCountryStore()
const countries = computed(() => country.AppCountries.AppCountries)

onMounted(() => {
  if (countries.value.length === 0) {
    getCountries(0, 100)
  }
})

</script>
