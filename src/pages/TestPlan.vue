<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_PLAN")'
      row-key='ID'
      :rows='testCases'
      :columns='columns'
    >
      <template #top-right>
        <q-select
          v-model='testplan'
          :options='options'
          dense
          :label='$t("MSG_TEST_PLAN")'
          class='filter'
        />
        <q-btn dense @click='onCreateClick'>
          {{ $t('MSG_CREATE') }}
        </q-btn>
        <q-btn dense @click='onFetchClick'>
          {{ $t('MSG_FETCH') }}
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestPlan, useTestPlanStore } from 'src/localstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const columns = computed(() => [
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    align: 'left',
    field: (row: TestPlan) => row.Title
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    align: 'left',
    field: (row: TestPlan) => row.ID
  },
  {
    name: 'Creator',
    label: t('MSG_CREATOR'),
    align: 'left',
    field: (row: TestPlan) => row.Creator
  },
  {
    name: 'Applier',
    label: t('MSG_APPLIER'),
    align: 'left',
    field: (row: TestPlan) => row.Applier
  }
])

const testPlan = useTestPlanStore()
const testplan = ref(undefined as unknown as TestPlan)
const options = computed(() => testPlan.TestPlans)
const testCases = computed(() => testPlan.testcases(testplan.value?.ID as string))

const onCreateClick = () => {
  // TODO
}

const onFetchClick = () => {
  // TODO
}

</script>

<style lang='sass' scoped>
.signin
  margin-top: 200px
</style>
