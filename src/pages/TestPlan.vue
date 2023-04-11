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
          :option-label='(item) => item.Title'
          dense
          :label='$t("MSG_TEST_PLAN")'
          class='filter'
        />
        <q-btn dense @click='onCreateClick'>
          {{ $t('MSG_CREATE') }}
        </q-btn>
        <q-btn dense @click='onAddTestCaseClick'>
          {{ $t('MSG_ADD_TEST_CASE') }}
        </q-btn>
        <q-btn dense @click='onFetchClick'>
          {{ $t('MSG_FETCH') }}
        </q-btn>
      </template>
    </q-table>
  </div>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_TEST_PLAN') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model='target.Title'
          :label='$t("MSG_NAME")'
        />
        <q-input
          v-model='target.Description'
          :label='$t("MSG_DESCRIPTION")'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestPlan, useTestPlanStore } from 'src/localstore'
import { uid } from 'quasar'

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

const onFetchClick = () => {
  // TODO
}

const showing = ref(false)
const updating = ref(false)

const target = ref({} as TestPlan)

const onCreateClick = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as TestPlan
}

const onSubmit = () => {
  showing.value = false
  updating.value = false
  target.value.ID = uid()
  if (!updating.value) {
    testPlan.TestPlans.push(target.value)
    return
  }
  const index = testPlan.TestPlans.findIndex((el) => el.ID === target.value.ID)
  testPlan.TestPlans.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, target.value)
}

const onCancel = () => {
  onMenuHide()
}

const onAddTestCaseClick = () => {
  // TODO
}

</script>

<style lang='sass' scoped>
.filter
  min-width: 220px
</style>
