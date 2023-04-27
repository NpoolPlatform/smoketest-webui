<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_PLAN")'
      row-key='ID'
      :rows='testPlans'
      :columns='testPlanColumns'
      selection='single'
      v-model:selected='selectedPlan'
    >
      <template #top-right>
        <q-btn dense @click='onCreateTestPlanClick'>
          {{ $t('MSG_CREATE') }}
        </q-btn>
        <q-btn dense @click='onFetchTestPlanCaseClick'>
          {{ $t('MSG_FETCH_PLAN_TEST_CASE') }}
        </q-btn>
        <q-btn dense @click='onExecuteTestPlanClick'>
          {{ $t('MSG_EXECUTE') }}
        </q-btn>
        <q-btn dense @click='onDeleteTestPlanClick'>
          {{ $t('MSG_DELETE') }}
        </q-btn>
      </template>
    </q-table>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='planTestCases'
      :columns='testCaseColumns'
    >
      <template #top-right>
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
          v-model='targetTestPlan.Name'
          :label='$t("MSG_NAME")'
        />
        <q-input
          v-model='targetTestPlan.Deadline'
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
import {
  TestPlan,
  useTestPlanStore,
  TestCase,
  useTestCaseStore,
  useLocalAPIStore,
  API,
  PlanTestCase,
  usePlanTestCaseStore,
  useTestCaseCondStore,
  TestCaseCond,
  CondType
} from 'src/localstore'
import { NotifyType, useLocalUserStore } from 'npool-cli-v4'
import { post } from 'src/boot/axios'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const testPlanColumns = computed(() => [
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    align: 'left',
    field: (row: TestPlan) => row.Name
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    align: 'left',
    field: (row: TestPlan) => row.ID
  },
  {
    name: 'CreatedBy',
    label: t('MSG_CREATED_BY'),
    align: 'left',
    field: (row: TestPlan) => row.Email
  },
  {
    name: 'Executor',
    label: t('MSG_EXECUTOR'),
    align: 'left',
    field: (row: TestPlan) => row.ExecutorEmail
  }
])

const testCaseColumns = computed(() => [
  {
    name: 'Index',
    label: t('MSG_INDEX'),
    align: 'left',
    field: (row: PlanTestCase) => row.Index
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: (row: PlanTestCase) => testCase.testcase(row.TestCaseID)?.Name
  },
  {
    name: 'PlanID',
    label: t('MSG_PLAN_ID'),
    align: 'left',
    field: (row: PlanTestCase) => row.TestPlanID
  },
  {
    name: 'CaseID',
    label: t('MSG_CASE_ID'),
    align: 'left',
    field: (row: PlanTestCase) => row.TestCaseID
  },
  {
    name: 'Result',
    label: t('MSG_RESULT'),
    align: 'left',
    field: (row: PlanTestCase) => row.Result
  }
])

const testPlan = useTestPlanStore()
const testPlans = computed(() => testPlan.TestPlans)

const planTestCase = usePlanTestCaseStore()
const planTestCases = computed(() => planTestCase.testcases(selectedPlan.value?.[0]?.ID))

const testCase = useTestCaseStore()
const allTestCases = computed(() => testCase.TestCases)
const testCaseCond = useTestCaseCondStore()
const logined = useLocalUserStore()

const fetchTestPlans = (offset: number, limit: number) => {
  testPlan.getTestPlans({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_TEST_PLAN',
        Message: 'MSG_UPDATE_TEST_PLAN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<TestPlan>) => {
    if (error) {
      return
    }
    if (rows.length === 0) {
      return
    }
    fetchTestPlans(offset + limit, limit)
  })
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
  if (updatingTestPlan.value) {
    updatingTestPlan.value = false
    testPlan.updateTestPlan({
      ID: targetTestCase.value.ID,
      Name: targetTestPlan.value.Name,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_TEST_PLAN',
          Message: 'MSG_UPDATE_TEST_PLAN_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  testPlan.createTestPlan({
    Name: targetTestPlan.value.Name,
    CreatedBy: logined.User.ID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_TEST_PLAN',
        Message: 'MSG_CREATE_TEST_PLAN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onTestPlanCancel = () => {
  onTestPlanMenuHide()
}

const showingTestCase = ref(false)
const targetTestCase = ref({} as TestCase)

const onAddTestCaseClick = () => {
  if (selectedPlan.value.length === 0) {
    return
  }
  showingTestCase.value = true
}

const onTestCaseSubmit = () => {
  showingTestCase.value = false
  planTestCase.createPlanTestCase({
    TestCaseID: targetTestCase.value.ID,
    TestPlanID: selectedPlan.value?.[0]?.ID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_PLAN_TEST_CASE',
        Message: 'MSG_CREATE_PLAN_TEST_CASE_FAIL',
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

const fetchTestCases = (offset: number, limit: number) => {
  testCase.getTestCases({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_TEST_CASES',
        Message: 'MSG_GET_TEST_CASES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<TestCase>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    fetchTestCases(offset + limit, limit)
  })
}

const fetchPlanTestCases = (testPlanID: string, offset: number, limit: number) => {
  planTestCase.getPlanTestCases({
    TestPlanID: testPlanID,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_PlAN_TEST_CASES',
        Message: 'MSG_GET_PlAN_TEST_CASES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<PlanTestCase>) => {
    if (error) {
      console.log('fetchPlanTestCase error')
      return
    }
    if (!rows?.length) {
      return
    }
    fetchPlanTestCases(testPlanID, offset + limit, limit)
  })
}

onMounted(() => {
  fetchAPIs(0, 100)
  fetchTestPlans(0, 100)
  fetchTestCases(0, 100)
})

const selectedPlan = ref([] as unknown as Array<TestPlan>)

const onDeleteTestPlanClick = () => {
  selectedPlan.value.forEach((v) => {
    testPlan.deleteTestPlan({
      ID: v.ID,
      Message: {
        Error: {
          Title: 'MSG_DELETE_TEST_PLAN',
          Message: 'MSG_DELETE_TEST_PLAN_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const testCasePath = (_testCase?: TestCase) => {
  if (!_testCase) {
    return undefined
  }
  const path = testCase.path(_testCase)
  if (path) {
    return path
  }
  return apis.path(allPaths.value.find((el) => el.ID === _testCase.ApiID))
}

const runPreConds = (_testCase: TestCase, condIndex: number, done: () => void, error: (err: Error) => void) => {
  let preConds = testCaseCond.getConds(_testCase.ID, CondType.PreCondition)
  if (condIndex > preConds.length) {
    done()
    return
  }
  preConds = preConds.sort((a: TestCaseCond, b: TestCaseCond) => {
    return a.Index > b.Index ? 1 : -1
  })
  const cond = preConds[condIndex]
  const _case = testCase.testcase(cond.CondTestCaseID)
  if (!_case) {
    return
  }
  _case.InputVal = testCase.input(_case)
  void post(testCasePath(_case) as string, _case.InputVal)
    .then((resp: unknown) => {
      _case.Output = (resp as Record<string, unknown>).Info as Record<string, unknown>
      runPreConds(_testCase, condIndex + 1, done, error)
    })
    .catch((err: Error) => {
      console.log(testCasePath(_case), err)
      error(err)
    })
}

const runCleaner = (_testCase: TestCase, condIndex: number) => {
  let cleaners = testCaseCond.getConds(_testCase.ID, CondType.Cleaner)
  if (condIndex > cleaners.length) {
    return
  }
  cleaners = cleaners.sort((a: TestCaseCond, b: TestCaseCond) => {
    return a.Index > b.Index ? 1 : -1
  })
  const cond = cleaners[condIndex]
  const _case = testCase.testcase(cond.CondTestCaseID)
  if (!_case) {
    return
  }
  _case.InputVal = testCase.input(_case)
  void post(testCasePath(_case) as string, _case.InputVal)
    .then(() => {
      runCleaner(_testCase, condIndex + 1)
    })
    .catch((err: Error) => {
      console.log(testCasePath(_case), err)
    })
}

const runTestCase = (_testCase: TestCase, done: () => void, error: (err: Error) => void) => {
  void post(testCasePath(_testCase) as string, _testCase.InputVal)
    .then((resp: unknown) => {
      _testCase.Error = undefined
      _testCase.Output = ((resp as Record<string, unknown>).Info) as Record<string, unknown>
      done()
    })
    .catch((err: Error) => {
      _testCase.Error = err
      error(err)
    })
}

const runPlanTestCase = (_case: PlanTestCase) => {
  const _testCase = testCase.testcase(_case.TestCaseID)
  if (!_testCase) {
    return
  }
  runPreConds(_testCase, 0, () => {
    runTestCase(_testCase, () => {
      runCleaner(_testCase, 0)
    }, (err: Error) => {
      console.log('runTestCase', err)
      runCleaner(_testCase, 0)
    })
  }, (err: Error) => {
    console.log('runPreConds', err)
  })
}

const onFetchTestPlanCaseClick = () => {
  selectedPlan.value.forEach((v) => {
    fetchPlanTestCases(v.ID, 0, 100)
  })
}

const onExecuteTestPlanClick = () => {
  selectedPlan.value.forEach((v) => {
    const cases = planTestCase.testcases(v.ID)
    cases?.forEach((planTestCase) => {
      runPlanTestCase(planTestCase)
    })
  })
}

</script>

<style lang='sass' scoped>
.filter
  min-width: 220px
</style>
