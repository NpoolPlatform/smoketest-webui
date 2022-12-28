<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_COUNTRIES")'
    :rows='displayCountries'
    row-key='ID'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='countryName'
        :label='$t("MSG_COUNTRY")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { getCountries } from 'src/api/g11n'
import { useAdminAppCountryStore } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const country = useAdminAppCountryStore()
const countries = computed(() => country.AppCountries.AppCountries)

const countryName = ref('')
const displayCountries = computed(() => countries.value.filter((el) => el.Country?.toLowerCase().includes(countryName.value?.toLowerCase())))

onMounted(() => {
  if (countries.value.length === 0) {
    getCountries(0, 100)
  }
})

</script>
