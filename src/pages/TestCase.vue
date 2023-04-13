<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='testCases'
      :columns='columns'
      :rows-per-page-options='[15]'
    >
      <template #top-right>
        <q-select
          v-model='module'
          :options='options'
          dense
          :label='$t("MSG_MODULE")'
          class='filter'
        />
        <q-btn dense @click='onCreateClick'>
          {{ $t('MSG_CREATE') }}
        </q-btn>
        <q-btn dense @click='onFetchAPIsClick'>
          {{ $t('MSG_FETCH_APIS') }}
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
          <q-th>{{ t('MSG_OPERATION') }}</q-th>
        </q-tr>
      </template>
      <template #body='props'>
        <q-tr :props='props'>
          <q-td auto-width class='bg-grey-6 test-case-header' />
          <q-td
            v-for='col in props.cols'
            :key='col.name'
            :props='props'
            class='bg-grey-6 test-case-header'
          >
            {{ col.value }}
          </q-td>
          <q-td class='bg-grey-6 test-case-header'>
            <q-btn @click='onExecTestCaseClick(props.row)'>
              执行
            </q-btn>
            <q-btn @click='onCollapseClick(props.row)'>
              折叠/展开
            </q-btn>
            <q-btn @click='onEditTestCaseClick(props.row)'>
              编辑
            </q-btn>
            <q-btn @click='onDeleteTestCaseClick(props.row)'>
              删除
            </q-btn>
            <q-btn @click='onDepracateTestCaseClick(props.row)'>
              废弃
            </q-btn>
            <q-btn @click='onSaveTestCaseClick(props.row)'>
              保存
            </q-btn>
          </q-td>
          <q-td colspan='100%' class='bg-grey-6 test-case-header' />
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>PreConds</div>
          </q-td>
          <q-td colspan='100%'>
            <div
              v-for='cond in props.row.PreConds'
              :key='cond'
            >
              <q-tr>
                <q-td>{{ cond.Index }}</q-td>
                <q-td>{{ testCaseByID(cond.TestCaseID)?.Name }}</q-td>
                <q-td>{{ testCaseByID(cond.TestCaseID)?.ModuleName }}</q-td>
                <q-td>{{ testCasePath(testCaseByID(cond.TestCaseID)) }}</q-td>
                <q-td>
                  <q-btn @click='onDeletePreCondClick(props.row, cond)'>
                    -
                  </q-btn>
                </q-td>
              </q-tr>
            </div>
            <div class='row' v-show='props.row.AddingPreCond'>
              <q-select
                v-model='preCondTestCase'
                :options='testCases'
                :option-label='(item) => item.ID + ": " + item.Name + ": " + testCasePath(item)'
                dense
                :label='$t("MSG_PATH")'
                class='filter'
              />
              <q-btn dense @click='onConfirmCreatePreCondClick(props.row)'>
                确定
              </q-btn>
              <q-btn dense @click='onCancelCreatePreCondClick(props.row)'>
                取消
              </q-btn>
            </div>
            <q-btn @click='onCreatePreCondClick(props.row)'>
              +
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>Cleaners</div>
          </q-td>
          <q-td colspan='90%'>
            <div
              v-for='cond in props.row.Cleaners'
              :key='cond'
            >
              <q-tr>
                <q-td>{{ cond.Index }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.Name }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.ModuleName }}</q-td>
                <q-td>{{ testCasePath(testCaseByID(cond.ID)) }}</q-td>
                <q-td>
                  <q-btn @click='onDeleteCleanerClick(props.row, cond)'>
                    -
                  </q-btn>
                </q-td>
              </q-tr>
            </div>
            <div class='row' v-show='props.row.AddingCleaner'>
              <q-select
                v-model='cleanerTestCase'
                :options='testCases'
                :option-label='(item) => item.ID + ": " + item.Name + ": " + testCasePath(item)'
                dense
                :label='$t("MSG_PATH")'
                class='filter'
                @update:model-value='(val) => onCleanerTestCaseUpdated(props.row, val)'
              />
              <div>
                <div
                  class='row'
                  v-for='arg in addingCleaner?.Args ? addingCleaner?.Args : []'
                  :key='arg.Name'
                >
                  <q-field class='cleaner-arg' dense label='Argument Name' stack-label>
                    {{ arg.Name }}
                  </q-field>
                  <q-select
                    label='From TestCase Arg'
                    dense
                    :options='testCase.cleanerArgSrcs(props.row)'
                    :option-label='(item) => fromArgLabel(item)'
                    class='filter'
                    v-model='arg.From'
                    :disable='!arg.Editing'
                  />
                  <q-btn dense @click='onModifyCreateCleanerArgClick(arg)'>
                    修改
                  </q-btn>
                  <q-btn dense @click='onConfirmCreateCleanerArgClick(props.row, arg)'>
                    确定
                  </q-btn>
                  <q-btn dense @click='onCancelCreateCleanerArgClick(props.row)'>
                    取消
                  </q-btn>
                </div>
              </div>
              <q-btn dense @click='onConfirmCreateCleanerClick(props.row)'>
                确定
              </q-btn>
              <q-btn dense @click='onCancelCreateCleanerClick(props.row)'>
                取消
              </q-btn>
            </div>
            <q-btn @click='onCreateCleanerClick(props.row)'>
              +
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>Arguments</div>
          </q-td>
          <q-td>
            <div class='row'>
              <pre class='arguments' v-html='JSON.stringify(testCase.args(props.row), null, 2)' />
              <pre class='arguments' v-html='JSON.stringify(testCase.input(props.row), null, 2)' />
            </div>
          </q-td>
          <q-td colspan='100%'>
            <div
              v-for='arg in props.row.Args'
              :key='arg.Name'
              class='row'
            >
              <q-input dense v-model='arg.Name' :disable='!arg.Editing' label='Argument Name' />
              <q-select
                label='Argument Type'
                dense
                :options='ArgDefs'
                v-model='arg.Type'
                :disable='!arg.Editing'
                class='filter'
              />
              <q-select
                label='From PreConds Arg'
                dense
                :options='testCase.argSrcs(props.row)'
                :option-label='(item) => fromArgLabel(item)'
                :disable='!arg.Editing'
                class='filter'
                v-model='arg.From'
              />
              <q-input dense v-model='arg.Value' :disable='!arg.Editing' label='Argument Value' />
              <q-btn @click='onModifyArgClick(arg)'>
                修改
              </q-btn>
              <q-btn @click='onConfirmModifyArgClick(props.row, arg)'>
                确定
              </q-btn>
              <q-btn @click='onDeleteArgClick(props.row, arg)'>
                -
              </q-btn>
            </div>
            <div class='row' v-show='props.row.AddingArg'>
              <q-input dense v-model='newArg.Name' label='Argument Name' />
              <q-select
                label='Argument Type'
                dense
                :options='ArgDefs'
                v-model='newArg.Type'
                class='filter'
              />
              <q-select
                label='From PreConds Arg'
                dense
                :options='testCase.argSrcs(props.row)'
                :option-label='(item) => fromArgLabel(item)'
                class='filter'
                v-model='newArg.From'
              />
              <q-input dense v-model='newArg.Value' label='Argument Value' />
              <q-btn dense @click='onConfirmCreateArgClick(props.row)'>
                确定
              </q-btn>
              <q-btn dense @click='onCancelCreateArgClick(props.row)'>
                取消
              </q-btn>
            </div>
            <q-btn @click='onCreateArgClick(props.row)'>
              +
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>Output</div>
          </q-td>
          <q-td>
            <div class='row'>
              <pre v-if='!props.row.Error' class='arguments' v-html='JSON.stringify(props.row.Output, null, 2)' />
              <div v-else class='arguments error' v-html='props.row.Error' />
            </div>
          </q-td>
        </q-tr>
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
        <span>{{ $t('MSG_CREATE_TEST_CASE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model='target.ModuleName'
          :options='options'
          dense
          :label='$t("MSG_MODULE")'
          class='filter'
          :disable='target.ModuleName !== undefined && target.ModuleName.length > 0'
        />
        <q-select
          v-model='testCaseAPI'
          :options='modulePaths'
          :option-label='(item) => item.PathPrefix + item.Path'
          dense
          :label='$t("MSG_PATH")'
          class='filter'
        />
        <q-input
          v-model='target.Name'
          :label='$t("MSG_NAME")'
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestCase, useTestCaseStore, useLocalAPIStore, API, ArgDefs, Arg, Cond, CondType, ArgMap } from 'src/localstore'
import { NotifyType } from 'npool-cli-v4'
import { post } from 'src/boot/axios'
import { uid } from 'quasar'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const module = ref('')

const testCase = useTestCaseStore()
const testCases = computed(() => testCase.TestCases)

const apis = useLocalAPIStore()

const testCaseByID = (id: string) => {
  return testCases.value.find((el) => el.ID === id)
}

const columns = computed(() => [
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: (row: TestCase) => row.Name
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    align: 'left',
    field: (row: TestCase) => row.ID
  },
  {
    name: 'Path',
    label: t('MSG_PATH'),
    align: 'left',
    field: (row: TestCase) => testCasePath(row)
  },
  {
    name: 'Module',
    label: t('MSG_MODULE'),
    align: 'left',
    field: (row: TestCase) => row.ModuleName
  }
])

watch(module, () => {
  if (module.value === 'Clear') {
    module.value = ''
  }
})

const options = ref([] as string[])

const onExecTestCaseClick = (_testCase: TestCase) => {
  void post(testCasePath(_testCase) as string, _testCase.Input)
    .then((resp: unknown) => {
      _testCase.Output = ((resp as Record<string, unknown>).Info) as Record<string, unknown>
    })
    .catch((err: Error) => {
      _testCase.Error = err
    })
}

const onCollapseClick = (testCase: TestCase) => {
  testCase.Collapsed = !testCase.Collapsed
}

const onEditTestCaseClick = (testCase: TestCase) => {
  target.value = testCase
  testCaseAPI.value = apis.APIs.find((el) => el.ID === testCase.ApiID) as API
  showing.value = true
  updating.value = true
}

const onDeleteTestCaseClick = (_testCase: TestCase) => {
  testCase.deleteTestCase({
    ID: _testCase.ID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_TEST_CASE',
        Message: 'MSG_DELETE_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onDepracateTestCaseClick = (testCase: TestCase) => {
  testCase.Depracated = true
}

const onSaveTestCaseClick = (_testCase: TestCase) => {
  testCase.updateTestCase({
    ID: _testCase.ID,
    Name: _testCase.Name,
    Description: _testCase.Description,
    Arguments: JSON.stringify(_testCase.Input),
    Expectation: JSON.stringify(_testCase.Output),
    Deprecated: _testCase.Depracated,
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

onMounted(() => {
  apis.getDomains({
    Message: {
      Error: {
        Title: 'MSG_GET_DOMAINS',
        Message: 'MSG_GET_DOMAINS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, domains: string[]) => {
    if (error) {
      return
    }
    options.value = domains
    options.value.push('Clear')
  })
})

const fetchAPIs = (offset: number, limit: number) => {
  apis.getAPIs({
    Domain: module.value.length > 0 ? module.value : undefined,
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

const onFetchAPIsClick = () => {
  fetchAPIs(0, 100)
}

const showing = ref(false)
const updating = ref(false)

const target = ref({
  ModuleName: module.value,
  Args: [] as Arg[],
  PreConds: [] as Cond[],
  Cleaners: [] as Cond[]
} as TestCase)
const targetInput = computed(() => testCase.input(target.value))

watch(targetInput, () => {
  target.value.Input = targetInput.value
})

watch(module, () => {
  target.value.ModuleName = module.value
})

const modulePaths = computed(() => apis.getModuleAPIs(showing.value ? target.value.ModuleName : module.value))
const allPaths = computed(() => apis.APIs)
const testCaseAPI = ref(undefined as unknown as API)

watch(testCaseAPI, () => {
  target.value.ApiID = testCaseAPI.value?.ID
})

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

const preCondTestCase = ref(undefined as unknown as TestCase)
const cleanerTestCase = ref(undefined as unknown as TestCase)

const onCreateClick = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    ModuleName: module.value,
    Args: [] as Arg[],
    PreConds: [] as Cond[],
    Cleaners: [] as Cond[]
  } as TestCase
}

const onSubmit = () => {
  showing.value = false
  if (updating.value) {
    testCase.updateTestCase({
      ID: target.value.ID,
      Name: target.value.Name,
      Description: target.value.Description,
      Arguments: JSON.stringify(target.value.Input),
      Expectation: JSON.stringify(target.value.Output),
      Deprecated: target.value.Depracated,
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
    updating.value = false
    return
  }

  testCase.createTestCase({
    Name: target.value.Name,
    Description: target.value.Description,
    ModuleName: target.value.ModuleName,
    ApiID: target.value.ApiID,
    Arguments: JSON.stringify(target.value.Input),
    Expectation: JSON.stringify(target.value.Output),
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

const onCancel = () => {
  onMenuHide()
}

const newArg = ref({} as Arg)
const onCreateArgClick = (testCase: TestCase) => {
  testCase.AddingArg = true
}

const onConfirmCreateArgClick = (_testCase: TestCase) => {
  _testCase.AddingArg = false
  if (!_testCase.Args) {
    _testCase.Args = []
  }
  _testCase.Args.push(newArg.value)
  newArg.value = {} as Arg
  _testCase.Input = testCase.input(_testCase)
}

const onCancelCreateArgClick = (testCase: TestCase) => {
  testCase.AddingArg = false
  newArg.value = {} as Arg
}

const onModifyArgClick = (arg: Arg) => {
  arg.Editing = true
}

const onConfirmModifyArgClick = (testCase: TestCase, arg: Arg) => {
  arg.Editing = false
  const index = testCase.Args.findIndex((el) => el.Name === arg.Name)
  testCase.Args.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, arg)
}

const onDeleteArgClick = (testCase: TestCase, arg: Arg) => {
  testCase.Args = testCase.Args.filter((el) => el.Name !== arg.Name)
}

const onCreatePreCondClick = (testCase: TestCase) => {
  testCase.AddingPreCond = true
}

const onConfirmCreatePreCondClick = (_testCase: TestCase) => {
  _testCase.AddingPreCond = false
  const _case = testCase.testcase(preCondTestCase.value.ID)
  if (!_case) {
    return
  }
  if (!_testCase.PreConds) {
    _testCase.PreConds = []
  }
  _testCase.PreConds.push({
    TestCaseID: preCondTestCase.value.ID,
    RelatedTestCaseID: _testCase.ID,
    Index: 0,
    CondType: CondType.PreCondition,
    ArgMap: []
  } as unknown as Cond)
  if (!_case.Output) {
    void post(testCasePath(_case) as string, _case.Input)
      .then((resp: unknown) => {
        _case.Output = ((resp as Record<string, unknown>).Info) as Record<string, unknown>
        _testCase.Input = testCase.input(_testCase)
      })
      .catch((err: Error) => {
        _case.Error = err
      })
    return
  }
  _testCase.Input = testCase.input(_testCase)
}

const onCancelCreatePreCondClick = (testCase: TestCase) => {
  testCase.AddingPreCond = false
}

const onDeletePreCondClick = (testCase: TestCase, cond: Cond) => {
  testCase.PreConds = testCase.PreConds.filter((el) => el.ID !== cond.ID)
}

const onCreateCleanerClick = (testCase: TestCase) => {
  testCase.AddingCleaner = true
}

const onConfirmCreateCleanerClick = (testCase: TestCase) => {
  testCase.AddingCleaner = false
  testCase.Cleaners.push(addingCleaner.value)
}

const onCancelCreateCleanerClick = (testCase: TestCase) => {
  testCase.AddingCleaner = false
}

const onDeleteCleanerClick = (testCase: TestCase, cond: Cond) => {
  testCase.Cleaners = testCase.Cleaners.filter((el) => el.ID !== cond.ID)
}

const fromArgLabel = (from: ArgMap) => {
  const testcase = testCase.testcase(from.ID)
  if (!testcase) {
    return 'Invalid'
  }
  return testCasePath(testcase) as string + ':' + testcase.Name + ':' + from.Type + ':' + from.Src
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
    fetchAPIs(offset + limit, limit)
  })
}

const addingCleaner = ref(undefined as unknown as Cond)

const onCleanerTestCaseUpdated = (_testCase: TestCase, cleanerTestCase: TestCase) => {
  addingCleaner.value = {
    ID: uid(),
    Index: 0,
    CondType: CondType.Cleaner,
    TestCaseID: _testCase.ID,
    RelatedTestCaseID: cleanerTestCase.ID,
    Args: [...cleanerTestCase.Args]
  }
  addingCleaner.value.Args.forEach((v) => {
    v.Editing = true
  })
}

const onModifyCreateCleanerArgClick = (arg: Arg) => {
  arg.Editing = true
}

const onConfirmCreateCleanerArgClick = (_testCase: TestCase, arg: Arg) => {
  arg.Editing = false
  const index = addingCleaner.value.Args.findIndex((el) => el.Name === arg.Name)
  if (index < 0) {
    return
  }
  addingCleaner.value.Args.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, arg)
}

const onCancelCreateCleanerArgClick = (arg: Arg) => {
  arg.Editing = false
}

onMounted(() => {
  fetchTestCases(0, 100)
})

</script>

<style lang='sass' scoped>
.test-case-header
  color: white
  font-weight: bold

.arguments
  background-color: black
  color: $light-green-13
  font-weight: bold
  padding: 20px
  margin-right: 10px
  width: 800px

pre
  white-space: pre-wrap
  white-space: -moz-pre-wrap
  white-space: -pre-wrap
  white-space: -o-pre-wrap
  word-wrap: break-word

.error
  color: red

.filter
  min-width: 120px

.cleaner-arg
  width: 320px
</style>
