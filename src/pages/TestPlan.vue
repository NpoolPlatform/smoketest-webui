<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_PLAN")'
      row-key='ID'
      :rows='testPlans'
      :columns='(testPlanColumns as never)'
      selection='single'
      v-model:selected='selectedPlan'
      @row-click='(evt, row, index) => onTestPlanClick(row)'
    >
      <template #top-right>
        <input
          ref='loadFileButton'
          type='file'
          :style='{display:"none"}'
          @change='uploadFile'
          accept='.json'
        >
        <q-btn class='btn' dense @click='loadFileButton?.click()'>
          {{ $t("MSG_IMPORT") }}
        </q-btn>
        <q-btn class='btn' dense @click='onBatchCreate(loadedTestPlans, 0)'>
          {{ $t('MSG_BATCH_CREATE') }}
        </q-btn>
        <q-btn class='btn' dense @click='onCreateTestPlanClick'>
          {{ $t('MSG_CREATE') }}
        </q-btn>
        <q-btn class='btn' dense @click='onFetchTestPlanCaseClick'>
          {{ $t('MSG_FETCH_PLAN_TEST_CASE') }}
        </q-btn>
        <q-btn class='btn' dense @click='onExecuteTestPlanClick'>
          {{ $t('MSG_EXECUTE') }}
        </q-btn>
        <q-btn class='btn' dense @click='onDeleteTestPlanClick'>
          {{ $t('MSG_DELETE') }}
        </q-btn>
        <q-btn class='btn' dense @click='onCloneTestPlanClick'>
          {{ $t('MSG_CLONE') }}
        </q-btn>
        <q-btn class='btn' dense @click='onExportClick'>
          {{ $t('MSG_EXPORT') }}
        </q-btn>
      </template>
    </q-table>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='planTestCases'
      :columns='(testCaseColumns as never)'
      selection='single'
      v-model:selected='selectedTestCase'
    >
      <template #top-right>
        <q-btn dense class='btn' @click='onAddTestCaseClick'>
          {{ $t('MSG_ADD_TEST_CASE') }}
        </q-btn>
      </template>
      <template #header='props'>
        <q-tr :props='props'>
          <q-th auto-width />
          <q-th
            v-for='col in props.cols'
            :key='col.name'
            :props='props'
          >
            {{ col.label }}
          </q-th>
          <q-th :style='{textAlign:"left"}'>
            {{ t('MSG_OPERATION') }}
          </q-th>
          <q-th :style='{textAlign:"left"}'>
            {{ t('MSG_RESULT') }}
          </q-th>
        </q-tr>
      </template>
      <template #body='props'>
        <q-tr :props='props'>
          <q-td auto-width class='test-case-header' />
          <q-td
            v-for='col in props.cols'
            :key='col.name'
            :props='props'
            class='test-case-header'
          >
            {{ col.value }}
          </q-td>
          <q-td class='test-case-header'>
            <q-btn class='btn' @click='onTestCaseCollapsed(props.row)'>
              展开
            </q-btn>
            <q-btn class='btn' @click='onTestCaseClick(props.row)'>
              编辑
            </q-btn>
            <q-btn disable class='btn' @click='onDeleteTestCaseClick(props.row)'>
              删除
            </q-btn>
          </q-td>
          <q-td :style='{align:"left"}'>
            <q-btn-toggle
              :options='[
                {label: "Pass", value: true},
                {label: "Fail", value: false}
              ]'
              dense size='xs'
              v-model='props.row.Pass'
              @update:model-value='(value) => onTestCasePass(props.row, value)'
            />
          </q-td>
          <q-td colspan='100%' class='test-case-header' />
        </q-tr>
        <q-tr v-if='props.row.Collapsed'>
          <q-td auto-width class='test-case-header' />
          <q-td>
            <div>Input</div>
          </q-td>
          <q-td colspan='6'>
            <pre class='arguments' v-html='JSON.stringify(props.row.InputVal, null, 2)' />
          </q-td>
        </q-tr>
        <q-tr v-if='props.row.Collapsed'>
          <q-td auto-width class='test-case-header' />
          <q-td>
            <div>Output</div>
          </q-td>
          <q-td colspan='6'>
            <pre class='arguments' v-html='JSON.stringify(props.row.OutputVal, null, 2)' />
          </q-td>
        </q-tr>
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
          :options='filterTestCases'
          use-input
          hide-selected
          fill-input
          input-debounce='0'
          @filter='onTestCaseFilter'
          hint='With hide-selected and fill-input'
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
import { saveAs } from 'file-saver'
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
import { NotifyType, useLocalUserStore, formatTime } from 'npool-cli-v4'
import { post } from 'src/boot/axios'
import { QSelect } from 'quasar'

interface BlobContent {
  TestPlans: Array<TestPlan>
  PlanTestCases: Array<PlanTestCase>
}

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
const planTestCases = computed(() => planTestCase.testcases(selectedPlan.value?.[0]?.ID as string)?.sort((a: PlanTestCase, b: PlanTestCase) => {
  return a.Index > b.Index ? 1 : -1
}))

const testCase = useTestCaseStore()
const allTestCases = computed(() => testCase.TestCases)
const testCases = computed(() => allTestCases.value.filter((v) => {
  const index = planTestCases.value?.findIndex((el) => v.ID === el.TestCaseID)
  return index === undefined || index < 0
}))

const filterTestCases = computed(() => {
  return testCases.value.filter((el) => !el.Deprecated && (el.Name?.toLowerCase()?.includes?.(testcaseFilter.value?.toLowerCase()) || el.ModuleName?.toLowerCase()?.includes?.(testcaseFilter.value?.toLowerCase()) || el.ApiPath?.toLowerCase()?.includes?.(testcaseFilter.value?.toLowerCase())))
})

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
const cloningTestPlan = ref(false)
const targetTestPlan = ref({} as TestPlan)

const onCreateTestPlanClick = () => {
  showingTestPlan.value = true
  updatingTestPlan.value = false
}

const onCloneTestPlanClick = () => {
  showingTestPlan.value = true
  updatingTestPlan.value = false
  cloningTestPlan.value = true
  targetTestPlan.value = { ...selectedPlan.value?.[0] }
}

const onTestPlanClick = (plan: TestPlan) => {
  showingTestPlan.value = true
  updatingTestPlan.value = true
  targetTestPlan.value = plan
}

const onTestPlanMenuHide = () => {
  showingTestPlan.value = false
  updatingTestPlan.value = false
  targetTestPlan.value = {} as TestPlan
}

const clonePlanTestcase = (testPlanID: string, testcases: Array<PlanTestCase>, index: number) => {
  if (index >= testcases.length) {
    return
  }

  const testcase = testcases[index]
  planTestCase.createPlanTestCase({
    TestCaseID: testcase.TestCaseID,
    TestPlanID: testPlanID,
    Index: testcase.Index,
    Message: {
      Error: {
        Title: 'MSG_CLONE_PLAN_TEST_CASE',
        Message: 'MSG_CLONE_PLAN_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    clonePlanTestcase(testPlanID, testcases, index + 1)
  })
}

const onTestPlanSubmit = () => {
  showingTestPlan.value = false
  if (updatingTestPlan.value) {
    testPlan.updateTestPlan({
      ID: targetTestPlan.value.ID as string,
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

  const testPlanID = targetTestPlan.value.ID

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
  }, (error: boolean, _testplan?: TestPlan) => {
    if (error) {
      return
    }
    if (!cloningTestPlan.value) {
      return
    }
    const testcases = planTestCase.testcases(testPlanID as string)
    clonePlanTestcase(_testplan?.ID as string, testcases as [], 0)
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

const onDeleteTestCaseClick = (_case: PlanTestCase) => {
  planTestCase.deletePlanTestCase({
    ID: _case.ID as string,
    Message: {
      Error: {
        Title: 'MSG_DELETE_PLAN_TEST_CASE',
        Message: 'MSG_DELETE_PLAN_TEST_CASE_FAIL',
        Popup: true
      }
    }
  }, () => {
    // TODO
  })
}

const onTestCaseSubmit = () => {
  showingTestCase.value = false
  if (updatingTestCase.value) {
    updatingTestCase.value = false
    planTestCase.updatePlanTestCase({
      ID: targetPlanTestCase.value.ID as string,
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
    TestPlanID: selectedPlan.value?.[0]?.ID as string,
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
    fetchTestCaseConds(offset + limit, limit)
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
      ID: v.ID as string,
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

const loadedTestPlans = ref(undefined as unknown as BlobContent)

const loadFileButton = ref<HTMLInputElement>()

const uploadFile = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      loadedTestPlans.value = JSON.parse(reader.result as string) as BlobContent
    }
    reader.readAsText(filename)
  }
}

const onBatchCreateTestCases = (_loadedTestPlans: BlobContent, index: number) => {
  if (index >= _loadedTestPlans.PlanTestCases.length) {
    return
  }

  const _testcase = _loadedTestPlans.PlanTestCases[index]
  planTestCase.createPlanTestCase({
    ID: _testcase.ID,
    TestCaseID: _testcase.TestCaseID,
    TestPlanID: _testcase.TestPlanID,
    Index: _testcase.Index,
    Message: {
      Error: {
        Title: 'MSG_CREATE_PLAN_TEST_CASE',
        Message: 'MSG_CREATE_PLAN_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      console.log('Cond Exists')
    }
    onBatchCreateTestCases(_loadedTestPlans, index + 1)
  })
}

const onBatchCreate = (_loadedTestPlans: BlobContent, index: number) => {
  if (index >= _loadedTestPlans.TestPlans.length) {
    onBatchCreateTestCases(_loadedTestPlans, 0)
  }
  const _testplan = _loadedTestPlans.TestPlans[index]
  console.log(_testplan)
  testPlan.createTestPlan({
    ID: _testplan.ID,
    Name: _testplan.Name,
    CreatedBy: logined.User.ID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_TEST_PLAN',
        Message: 'MSG_CREATE_TEST_PLAN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      console.log('TestPlan Exists!')
    }
    onBatchCreate(_loadedTestPlans, index + 1)
  })
}

const onExportClick = () => {
  const blobContent = {
    TestPlans: testPlans.value,
    PlanTestCases: planTestCases.value
  } as BlobContent
  const blob = new Blob([JSON.stringify(blobContent)], { type: 'text/plain;charset=utf-8' })
  const filename = 'testplan-' + formatTime(new Date().getTime() / 1000) + '.json'
  saveAs(blob, filename)
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
      _case.OutputVal = (resp as Record<string, unknown>).Info as Record<string, unknown>
      _testCase.OutputVal = (resp as Record<string, unknown>).Info as Record<string, unknown>
      runPreConds(_testCase, condIndex + 1, done, error)
    })
    .catch((err: Error) => {
      console.log(testCasePath(_case), err)
      error(err)
    })
}

const runCleaner = (_testCase: TestCase, condIndex: number) => {
  let cleaners = testCaseCond.getConds(_testCase.ID, CondType.Cleaner)
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
  _case.InputVal = testCase.input(_case)
  void post(testCasePath(_case) as string, _case.InputVal)
    .then(() => {
      runCleaner(_testCase, condIndex + 1)
    })
    .catch((err: Error) => {
      console.log(testCasePath(_case), err)
    })
}

const runTestCase = (_testCase: TestCase, done: (output: Record<string, unknown>) => void, error: (err: Error) => void) => {
  _testCase.InputVal = testCase.input(_testCase)
  void post(testCasePath(_testCase) as string, _testCase.InputVal)
    .then((resp: unknown) => {
      _testCase.Error = undefined
      _testCase.OutputVal = ((resp as Record<string, unknown>).Info) as Record<string, unknown>
      done(((resp as Record<string, unknown>).Info) as Record<string, unknown>)
    })
    .catch((err: Error) => {
      _testCase.Error = err
      error(err)
    })
}

const validateTestCaseResult = (_testCase: TestCase, output?: Record<string, unknown>): boolean => {
  let passed = true
  Object.keys(_testCase.OutputVal).forEach((k) => {
    if (_testCase.OutputVal[k] !== output?.[k]) {
      if (Array.isArray(_testCase.OutputVal[k]) && Array.isArray(output?.[k])) {
        if (JSON.stringify(_testCase.OutputVal[k]) === JSON.stringify(output?.[k])) {
          return passed
        }
      }
      passed = false
    }
  })
  return passed
}

const reportTestCaseResult = (_case: PlanTestCase, output?: Record<string, unknown>, err?: Error) => {
  const _testCase = testCase.testcase(_case.TestCaseID) as TestCase
  if (!_testCase) {
    return
  }
  let passed = TestCaseResult.Passed
  if (output) {
    passed = validateTestCaseResult(_testCase, output) ? TestCaseResult.Passed : TestCaseResult.Failed
  }
  if (err) {
    passed = TestCaseResult.Failed
  }
  planTestCase.updatePlanTestCase({
    ID: _case.ID as string,
    Result: passed,
    Output: JSON.stringify(output),
    Input: _testCase.Input,
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
}

const runPlanTestCase = (_case: PlanTestCase) => {
  const _testCase = testCase.testcase(_case.TestCaseID)
  if (!_testCase) {
    return
  }
  runPreConds(_testCase, 0, () => {
    runTestCase(_testCase, (output: Record<string, unknown>) => {
      reportTestCaseResult(_case, output)
      runCleaner(_testCase, 0)
    }, (err: Error) => {
      reportTestCaseResult(_case, undefined, err)
      runCleaner(_testCase, 0)
    })
  }, (err: Error) => {
    console.log('runPreConds', err)
  })
}

const onFetchTestPlanCaseClick = () => {
  selectedPlan.value.forEach((v) => {
    fetchPlanTestCases(v.ID as string, 0, 100)
  })
}

const onExecuteTestPlanClick = () => {
  selectedPlan.value.forEach((v) => {
    let cases = planTestCase.testcases(v.ID as string)
    if (typeof cases !== 'undefined') {
      cases = cases.sort((a: PlanTestCase, b: PlanTestCase) => {
        return a.Index > b.Index ? 1 : -1
      })
    }
    cases?.forEach((planTestCase) => {
      runPlanTestCase(planTestCase)
    })
  })
}

const onTestCaseClick = (_case: PlanTestCase) => {
  showingTestCase.value = true
  updatingTestCase.value = true
  targetPlanTestCase.value = _case
  targetTestCase.value = testCase.testcase(_case.TestCaseID) as TestCase
}

const onTestCasePass = (_case: PlanTestCase, pass: boolean) => {
  planTestCase.updatePlanTestCase({
    ID: _case.ID as string,
    Result: pass ? TestCaseResult.Passed : TestCaseResult.Failed,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_TEST_CASE',
        Message: 'MSG_UPDATE_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onTestCaseCollapsed = (_case: PlanTestCase) => {
  _case.Collapsed = !_case.Collapsed
}

const testcaseFilter = ref('')

const onTestCaseFilter = (val: string, update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void) => {
  update(() => {
    testcaseFilter.value = val
  })
}

</script>

<style lang='sass' scoped>
.filter
  min-width: 220px
</style>
