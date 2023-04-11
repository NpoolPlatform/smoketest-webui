<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_PLAN")'
      row-key='ID'
      :rows='testPlans'
      :columns='testPlanColumns'
    >
      <template #top-right>
        <q-btn dense @click='onCreateTestPlanClick'>
          {{ $t('MSG_CREATE') }}
        </q-btn>
        <q-btn dense @click='onFetchClick'>
          {{ $t('MSG_FETCH') }}
        </q-btn>
      </template>
    </q-table>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='testCases'
      :columns='testCaseColumns'
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
        <q-btn dense @click='onAddTestCaseClick'>
          {{ $t('MSG_ADD_TEST_CASE') }}
        </q-btn>
      </template>
    </q-table>
  </div>
  <q-dialog
    v-model='showingTestPlan'
    @hide='onTestPlanMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_TEST_PLAN') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model='targetTestPlan.Title'
          :label='$t("MSG_NAME")'
        />
        <q-input
          v-model='targetTestPlan.Description'
          :label='$t("MSG_DESCRIPTION")'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onTestPlanSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onTestPlanCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model='showingTestCase'
    @hide='onTestCaseMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_TEST_PLAN') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model='targetTestCase'
          :options='allTestCases'
          :option-label='(item) => item.ID + ": " + item.Name + ": " + apiPath(item.ApiID)'
          dense
          :label='$t("MSG_MODULE")'
          class='filter'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onTestCaseSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onTestCaseCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestPlan, useTestPlanStore, TestCase, useTestCaseStore, TestCaseInstance, useLocalAPIStore, API } from 'src/localstore'
import { uid } from 'quasar'
import { NotifyType } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const testPlanColumns = computed(() => [
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

const testCaseColumns = computed(() => [
  {
    name: 'Index',
    label: t('MSG_INDEX'),
    align: 'left',
    field: (row: TestCaseInstance) => row.Index
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    align: 'left',
    field: (row: TestCaseInstance) => row.ID
  },
  {
    name: 'PlanID',
    label: t('MSG_PLAN_ID'),
    align: 'left',
    field: (row: TestCaseInstance) => row.PlanID
  },
  {
    name: 'CaseID',
    label: t('MSG_CASE_ID'),
    align: 'left',
    field: (row: TestCaseInstance) => row.CaseID
  },
  {
    name: 'Executed',
    label: t('MSG_EXECUTED'),
    align: 'left',
    field: (row: TestCaseInstance) => row.Executed
  },
  {
    name: 'Result',
    label: t('MSG_RESULT'),
    align: 'left',
    field: (row: TestCaseInstance) => row.Result
  }
])

const testPlan = useTestPlanStore()
const testplan = ref(undefined as unknown as TestPlan)
const testPlans = computed(() => testPlan.TestPlans)

const options = computed(() => testPlan.TestPlans)
const testCases = computed(() => testPlan.testcases(testplan.value?.ID as string))

const testCase = useTestCaseStore()
const allTestCases = computed(() => testCase.TestCases)

const onFetchClick = () => {
  // TODO
}

const showingTestPlan = ref(false)
const updatingTestPlan = ref(false)

const targetTestPlan = ref({} as TestPlan)

const onCreateTestPlanClick = () => {
  showingTestPlan.value = true
}

const onTestPlanMenuHide = () => {
  showingTestPlan.value = false
  targetTestPlan.value = {} as TestPlan
}

const onTestPlanSubmit = () => {
  showingTestPlan.value = false
  updatingTestPlan.value = false
  targetTestPlan.value.ID = uid()
  if (!updatingTestPlan.value) {
    testPlan.TestPlans.push(targetTestPlan.value)
    return
  }
  const index = testPlan.TestPlans.findIndex((el) => el.ID === targetTestPlan.value.ID)
  testPlan.TestPlans.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, targetTestPlan.value)
}

const onTestPlanCancel = () => {
  onTestPlanMenuHide()
}

const showingTestCase = ref(false)
const targetTestCase = ref({} as TestCase)

const onAddTestCaseClick = () => {
  showingTestCase.value = true
}

const onTestCaseSubmit = () => {
  showingTestCase.value = false
  testPlan.createTestCase({
    CaseID: targetTestCase.value.ID as string,
    PlanID: testplan.value.ID as string,
    Message: {
      Error: {
        Title: 'MSG_CREATE_TEST_CASE',
        Message: 'MSG_CREATE_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onTestCaseMenuHide = () => {
  showingTestCase.value = false
  targetTestCase.value = {} as TestCase
}

const onTestCaseCancel = () => {
  onTestCaseMenuHide()
}

const apis = useLocalAPIStore()
const allPaths = computed(() => apis.APIs)

const apiPath = (apiID?: string) => {
  if (!apiID) {
    return 'Invalid'
  }
  const path = allPaths.value.find((el) => el.ID === apiID)
  if (!path) {
    return apiID
  }
  return path?.PathPrefix + path?.Path
}

const fetchAPIs = (offset: number, limit: number) => {
  apis.getAPIs({
    Exported: true,
    Depracated: false,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APIS',
        Message: 'MSG_GET_APIS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<API>) => {
    if (error) {
      return
    }
    if (rows.length === 0) {
      return
    }
    fetchAPIs(offset + limit, limit)
  })
}

onMounted(() => {
  fetchAPIs(0, 100)
})

</script>

<style lang='sass' scoped>
.filter
  min-width: 220px
</style>
