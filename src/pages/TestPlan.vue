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
      selection='single'
      v-model:selected='selectedTestCase'
      @row-click='onTestCaseClick'
    >
      <template #top-right>
        <q-btn dense @click='onAddTestCaseClick'>
          {{ $t('MSG_ADD_TEST_CASE') }}
        </q-btn>
        <q-btn dense @click='onDeleteTestCaseClick'>
          {{ $t('MSG_DELETE_TEST_CASE') }}
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
        <span>{{ $t('MSG_ADD_TEST_CASE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>
          {{ selectedPlan?.[0]?.Name }}
        </q-item-label>
        <br>
        <q-select
          v-model='targetTestCase'
          :options='testCases'
          :option-label='(item) => item.ID + ": " + item.Name + ": " + apiPath(item.ApiID)'
          dense
          :label='$t("MSG_TEST_CASE")'
          class='filter'
        />
        <q-input
          v-model='targetPlanTestCase.Index'
          :label='$t("MSG_INDEX")'
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
  CondType,
  TestCaseResult
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
const testCases = computed(() => allTestCases.value.filter((v) => {
  const index = planTestCases.value?.findIndex((el) => v.ID === el.TestCaseID)
  return index === undefined || index < 0
}))

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
  updatingTestPlan.value = false
}

const onTestPlanMenuHide = () => {
  showingTestPlan.value = false
  updatingTestPlan.value = false
  targetTestPlan.value = {} as TestPlan
}

const onTestPlanSubmit = () => {
  showingTestPlan.value = false
  if (updatingTestPlan.value) {
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
    updatingTestPlan.value = false
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
const updatingTestCase = ref(false)
const targetTestCase = ref({} as TestCase)
const targetPlanTestCase = ref({} as PlanTestCase)

const onAddTestCaseClick = () => {
  if (selectedPlan.value.length === 0) {
    return
  }
  showingTestCase.value = true
  updatingTestCase.value = false
}

const selectedTestCase = ref([] as Array<PlanTestCase>)

const onDeleteTestCaseClick = () => {
  selectedTestCase.value.forEach((v) => {
    planTestCase.deletePlanTestCase({
      ID: v.ID,
      Message: {
        Error: {
          Title: 'MSG_DELETE_PLAN_TEST_CASE',
          Message: 'MSG_DELETE_PLAN_TEST_CASE_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const onTestCaseSubmit = () => {
  showingTestCase.value = false
  if (updatingTestCase.value) {
    updatingTestCase.value = false
    planTestCase.updatePlanTestCase({
      ID: targetPlanTestCase.value.ID,
      Index: targetPlanTestCase.value.Index,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_PLAN_TEST_CASE',
          Message: 'MSG_UPDATE_PLAN_TEST_CASE_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  planTestCase.createPlanTestCase({
    TestCaseID: targetTestCase.value.ID,
    TestPlanID: selectedPlan.value?.[0]?.ID,
    Index: targetPlanTestCase.value.Index,
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
  updatingTestCase.value = false
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

const fetchTestCaseConds = (offset: number, limit: number) => {
  testCaseCond.getTestCaseConds({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_TEST_CASE_CONDS',
        Message: 'MSG_GET_TEST_CASE_CONDS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<TestCaseCond>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    fetchTestCases(offset + limit, limit)
  })
}

onMounted(() => {
  fetchAPIs(0, 100)
  fetchTestPlans(0, 100)
  fetchTestCases(0, 100)
  fetchTestCaseConds(0, 100)
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
  if (condIndex >= preConds.length) {
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
  console.log('runCleaner', condIndex)
  let cleaners = testCaseCond.getConds(_testCase.ID, CondType.Cleaner)
  console.log('runCleaner', condIndex, cleaners.length)
  if (condIndex >= cleaners.length) {
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
  console.log('runCleaner', condIndex, _case)
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
  _testCase.InputVal = testCase.input(_testCase)
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
      planTestCase.updatePlanTestCase({
        ID: _case.ID,
        Result: TestCaseResult.Passed,
        TestCaseOutput: JSON.stringify(_testCase.Output),
        Message: {
          Error: {
            Title: 'MSG_UPDATE_TEST_PLAN_CASE',
            Message: 'MSG_UPDATE_TEST_PLAN_CASE_FAIL',
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, () => {
        // TODO
      })
      runCleaner(_testCase, 0)
    }, (err: Error) => {
      planTestCase.updatePlanTestCase({
        ID: _case.ID,
        Result: TestCaseResult.Failed,
        TestCaseOutput: JSON.stringify(err),
        Message: {
          Error: {
            Title: 'MSG_UPDATE_TEST_PLAN_CASE',
            Message: 'MSG_UPDATE_TEST_PLAN_CASE_FAIL',
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, () => {
        // TODO
      })
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

const onTestCaseClick = (event: PointerEvent, _case: PlanTestCase) => {
  showingTestCase.value = true
  updatingTestCase.value = true
  targetPlanTestCase.value = _case
  targetTestCase.value = testCase.testcase(_case.TestCaseID) as TestCase
}

</script>

<style lang='sass' scoped>
.filter
  min-width: 220px
</style>
