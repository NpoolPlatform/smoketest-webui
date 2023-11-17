<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='testCases'
      :columns='(columns as never)'
      :rows-per-page-options='[15]'
      :style='{maxWidth:"100%"}'
    >
      <template #top-right>
        <div class='row items-end'>
          <q-input
            dense
            :label='$t("MSG_SEARCH_NAME")'
            v-model='name'
            :style='{maxWidth:"240px"}'
          >
            <template #append>
              <q-icon name='search' />
            </template>
          </q-input>
          <q-toggle dense v-model='showDeprecated' size='xs'>
            显示废弃用例
          </q-toggle>
          <input
            ref='loadFileButton'
            type='file'
            style='display: none;'
            @change='uploadFile'
            accept='.json'
          >
          <q-btn class='btn vertical-bottom' dense @click='loadFileButton?.click()'>
            {{ $t("MSG_IMPORT") }}
          </q-btn>
          <q-btn class='btn' dense @click='onBatchCreate(loadedTestCases, 0)'>
            {{ $t("MSG_BATCH_CREATE") }}
          </q-btn>
          <q-select
            v-model='module'
            use-input
            hide-selected
            fill-input
            input-debounce='0'
            :options='options'
            dense
            @filter-abort='onAbortFilter'
            :label='$t("MSG_MODULE")'
            class='filter'
          />
          <q-btn class='btn' dense @click='onCreateClick'>
            {{ $t('MSG_CREATE') }}
          </q-btn>
          <q-btn class='btn' dense @click='onFetchAPIsClick'>
            {{ $t('MSG_FETCH_APIS') }}
          </q-btn>
          <q-btn class='btn' dense @click='onExportClick'>
            {{ $t('MSG_EXPORT') }}
          </q-btn>
        </div>
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
            <q-btn dense class='btn' @click='onExecTestCaseClick(props.row)' :disable='props.row.Deprecated'>
              执行
            </q-btn>
            <q-btn dense class='btn' @click='onCollapseClick(props.row)'>
              折叠/展开
            </q-btn>
            <q-btn dense class='btn' @click='onEditTestCaseClick(props.row)' :disable='props.row.Deprecated'>
              编辑
            </q-btn>
            <q-btn disable dense class='btn' @click='onDeleteTestCaseClick(props.row)'>
              删除
            </q-btn>
            <q-btn dense class='btn' @click='onDepracateTestCaseClick(props.row)'>
              废弃
            </q-btn>
            <q-btn dense class='btn' @click='onSaveTestCaseClick(props.row)'>
              保存
            </q-btn>
            <q-btn dense class='btn' @click='onCloneTestCaseClick(props.row)' :disable='props.row.Deprecated'>
              克隆
            </q-btn>
          </q-td>
          <q-td colspan='100%' class='test-case-header' />
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>Description</div>
          </q-td>
          <q-td colspan='4'>
            <q-input dense v-model='props.row.Description' />
          </q-td>
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>PreConds</div>
          </q-td>
          <q-td colspan='4'>
            <div
              v-for='cond in testCaseCond.getConds(props.row.ID, CondType.PreCondition)'
              :key='cond.ID'
            >
              <q-tr>
                <q-td>
                  <q-input dense v-model='cond.Index' :disable='!cond.Editing' label='Index' />
                </q-td>
                <q-td>{{ testCaseByID(cond.CondTestCaseID)?.Name }}</q-td>
                <q-td>{{ testCaseByID(cond.CondTestCaseID)?.ModuleName }}</q-td>
                <q-td>{{ testCasePath(testCaseByID(cond.CondTestCaseID)) }}</q-td>
                <q-td>
                  <q-btn dense class='btn' @click='onModifyCondClick(cond)' :disable='cond.Editing'>
                    修改
                  </q-btn>
                  <q-btn dense class='btn' @click='onConfirmModifyCondClick(cond)' :disable='!cond.Editing'>
                    确定
                  </q-btn>
                  <q-btn dense class='btn' @click='onCancelModifyCondClick(cond)' :disable='!cond.Editing'>
                    取消
                  </q-btn>
                  <q-btn @click='onDeleteTestCaseCondClick(cond)'>
                    -
                  </q-btn>
                </q-td>
              </q-tr>
            </div>
            <div class='row' v-show='props.row.AddingPreCond'>
              <q-select
                v-model='preCondTestCase'
                :options='condTestCases'
                use-input
                hide-selected
                fill-input
                input-debounce='0'
                @filter='onTestCaseFilter'
                @filter-abort='onAbortFilter'
                :option-label='(item) => item.ID + ": " + item.Name + ": " + testCasePath(item)'
                dense
                :label='$t("MSG_PATH")'
                class='filter'
              />
              <q-btn dense class='btn' @click='onConfirmCreatePreCondClick(props.row)'>
                确定
              </q-btn>
              <q-btn dense class='btn' @click='onCancelCreatePreCondClick(props.row)'>
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
          <q-td colspan='4'>
            <div
              v-for='cond in testCaseCond.getConds(props.row.ID, CondType.Cleaner)'
              :key='cond.ID'
            >
              <q-tr>
                <q-td>
                  <q-input
                    dense
                    v-model.number='cond.Index'
                    :disable='!cond.Editing'
                    label='Index'
                    :rules='[val => !!val || "Field is required"]'
                  />
                </q-td>
                <q-td>{{ testCaseByID(cond.CondTestCaseID)?.Name }}</q-td>
                <q-td>{{ testCaseByID(cond.CondTestCaseID)?.ModuleName }}</q-td>
                <q-td>{{ testCasePath(testCaseByID(cond.CondTestCaseID)) }}</q-td>
                <q-td>
                  <q-btn dense class='btn' @click='onModifyCondClick(cond)' :disable='cond.Editing'>
                    修改
                  </q-btn>
                  <q-btn dense class='btn' @click='onConfirmModifyCondClick(cond)' :disable='!cond.Editing'>
                    确定
                  </q-btn>
                  <q-btn dense class='btn' @click='onCancelModifyCondClick(cond)' :disable='!cond.Editing'>
                    取消
                  </q-btn>
                  <q-btn @click='onDeleteTestCaseCondClick(cond)'>
                    -
                  </q-btn>
                </q-td>
                <q-td>
                  <div
                    class='row'
                    v-for='arg in cond.Args ? cond.Args : []'
                    :key='arg.Name'
                  >
                    <q-field class='cleaner-arg' dense label='Argument Name' stack-label>
                      {{ arg.Name }}
                    </q-field>
                    <q-select
                      label='From TestCase Arg'
                      dense
                      :options='testCase.cleanerArgSrcs(props.row, testCaseCond.getConds(props.row.ID))'
                      :option-label='(item) => fromArgMapLabel(item)'
                      class='filter'
                      v-model='arg.From'
                      :disable='!arg.Editing'
                      @update:model-value='onUpdateCleanerArg(arg.From, cond)'
                    />
                    <q-btn dense class='btn' @click='onModifyCleanerArgClick(arg)'>
                      修改
                    </q-btn>
                    <q-btn dense class='btn' @click='onConfirmCreateCleanerArgClick(props.row, arg)'>
                      确定
                    </q-btn>
                    <q-btn dense class='btn' @click='onCancelCreateCleanerArgClick(props.row)'>
                      取消
                    </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </div>
            <div class='row' v-show='props.row.AddingCleaner'>
              <q-select
                v-model='cleanerTestCase'
                :options='condTestCases'
                use-input
                hide-selected
                fill-input
                input-debounce='0'
                @filter='onTestCaseFilter'
                @filter-abort='onAbortFilter'
                :option-label='(item) => item.ID + ": " + item.Name + ": " + testCasePath(item)'
                dense
                :label='$t("MSG_PATH")'
                class='filter'
                @update:model-value='(val) => onCleanerTestCaseUpdated(props.row, val)'
              />
              <q-btn dense class='btn' @click='onConfirmCreateCleanerClick(props.row)'>
                确定
              </q-btn>
              <q-btn dense class='btn' @click='onCancelCreateCleanerClick(props.row)'>
                取消
              </q-btn>
              <div>
                <div
                  class='row'
                  v-for='arg in cleanerTestCase?.Args ? cleanerTestCase?.Args : []'
                  :key='arg.Name'
                >
                  <q-field class='cleaner-arg' dense label='Argument Name' stack-label>
                    {{ arg.Name }}
                  </q-field>
                  <q-select
                    label='From TestCase Arg'
                    dense
                    :options='testCase.cleanerArgSrcs(props.row, testCaseCond.getConds(props.row.ID))'
                    :option-label='(item) => fromArgMapLabel(item)'
                    class='filter'
                    v-model='arg.From'
                    :disable='!arg.Editing'
                  />
                  <q-btn dense class='btn' @click='onConfirmCreateCleanerArgClick(props.row, arg)'>
                    确定
                  </q-btn>
                  <q-btn dense class='btn' @click='onCancelCreateCleanerArgClick(props.row)'>
                    取消
                  </q-btn>
                </div>
              </div>
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
          <q-td colspan='2'>
            <div
              v-for='(arg, index) in props.row.Args'
              :key='index'
              class='row'
            >
              <q-input
                dense
                v-model='arg.Name'
                :disable='!arg.Editing'
                label='Argument Name'
              />
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
                :options='testCase.argSrcs(testCaseCond.getConds(props.row.ID, CondType.PreCondition))'
                :option-label='(item) => fromArgMapLabel(item)'
                :disable='!arg.Editing'
                class='filter'
                v-model='arg.From'
              />
              <q-select
                label='Parent Arg ID'
                dense
                :options='props.row.Args ? props.row.Args.map((arg: Arg) => arg.ID) : []'
                :option-label='(item) => fromArgLabel(props.row, item)'
                option-value='ID'
                :disable='!arg.Editing'
                class='filter'
                v-model='arg.ParentID'
              />
              <q-input
                dense
                v-model='arg.Value'
                v-if='arg.Type !== "Boolean"'
                :disable='!arg.Editing'
                label='Argument Value'
              />
              <q-toggle
                dense
                v-model='arg.Value'
                v-if='arg.Type === "Boolean"'
                :disable='!arg.Editing'
              />
              <q-toggle v-if='arg.Type === "String"' v-model='arg.Random' :disable='!arg.Editing'>
                随机
              </q-toggle>
              <q-btn dense class='btn' @click='onModifyArgClick(arg)' :disable='arg.Editing'>
                修改
              </q-btn>
              <q-btn dense class='btn' @click='onConfirmModifyArgClick(props.row, arg)' :disable='!arg.Editing'>
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
                :options='testCase.argSrcs(testCaseCond.getConds(props.row.ID, CondType.PreCondition))'
                :option-label='(item) => fromArgMapLabel(item)'
                class='filter'
                v-model='newArg.From'
              />
              <q-select
                label='Parent Arg ID'
                dense
                :options='props.row.Args ? props.row.Args.map((arg: Arg) => arg.ID) : []'
                :option-label='(item) => fromArgLabel(props.row, item)'
                option-value='ID'
                class='filter'
                v-model='newArg.ParentID'
              />
              <q-input
                dense
                v-model='newArg.Value'
                v-if='newArg.Type !== "Boolean"'
                label='Argument Value'
              />
              <q-toggle
                dense
                v-model='newArg.Value'
                v-if='newArg.Type === "Boolean"'
              />
              <q-toggle v-if='newArg.Type === "String"' v-model='newArg.Random'>
                随机
              </q-toggle>
              <q-btn dense class='btn' @click='onConfirmCreateArgClick(props.row)'>
                确定
              </q-btn>
              <q-btn dense class='btn' @click='onCancelCreateArgClick(props.row)'>
                取消
              </q-btn>
            </div>
            <q-btn @click='onCreateArgClick(props.row)'>
              +
            </q-btn>
          </q-td>
          <q-td colspan='2'>
            <div class='row'>
              <pre class='arguments' v-html='JSON.stringify(testCase.args(props.row), null, 2)' />
              <pre class='arguments' v-html='JSON.stringify(testCase.input(props.row), null, 2)' />
            </div>
          </q-td>
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>Output</div>
          </q-td>
          <q-td colspan='4'>
            <div class='row'>
              <pre v-if='!props.row.Error' class='output arguments' v-html='JSON.stringify(props.row.OutputVal, null, 2)' />
              <div v-else class='output arguments error' v-html='props.row.Error' />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-input type='textarea' v-model='executionLog' />
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
          filled
          v-model='target.ModuleName'
          use-input
          hide-selected
          fill-input
          input-debounce='0'
          :options='displayModules'
          dense
          @filter='onModuleFilter'
          @filter-abort='onAbortFilter'
          :label='$t("MSG_MODULE")'
          class='filter'
          :disable='target.ModuleName !== undefined && target.ModuleName.length > 0'
        />
        <q-select
          v-model='testCaseAPI'
          use-input
          hide-selected
          fill-input
          input-debounce='0'
          :options='modulePaths'
          :option-label='(item) => item.PathPrefix + item.Path'
          dense
          @filter='onPathFilter'
          @filter-abort='onAbortFilter'
          :label='$t("MSG_PATH")'
          class='filter'
        />
        <q-input
          v-model='target.Name'
          :label='$t("MSG_NAME")'
        />
        <q-select
          filled
          v-model='target.TestCaseType'
          use-input
          hide-selected
          fill-input
          input-debounce='0'
          :options='TestCaseTypes'
          dense
          :label='$t("MSG_TEST_CASE_TYPE")'
          class='filter'
        />
        <q-select
          filled
          v-model='target.TestCaseClass'
          use-input
          hide-selected
          fill-input
          input-debounce='0'
          :options='TestCaseClasses'
          dense
          :label='$t("MSG_TEST_CASE_CLASS")'
          class='filter'
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
import { saveAs } from 'file-saver'
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  TestCase,
  useTestCaseStore,
  useLocalAPIStore,
  API,
  ArgDefs,
  Arg,
  TestCaseCond,
  CondType,
  ArgMap,
  useTestCaseCondStore,
  useModuleStore,
  Module,
  TestCaseTypes,
  TestCaseClasses,
  ArgSrc
} from 'src/localstore'
import { NotifyType, formatTime } from 'npool-cli-v4'
import { post } from 'src/boot/axios'
import { QSelect, uid } from 'quasar'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface BlobContent {
  TestCases: Array<TestCase>
  Conds: Array<TestCaseCond>
}

const loadedTestCases = ref(undefined as unknown as BlobContent)
const loadFileButton = ref<HTMLInputElement>()
const executionLog = ref('')

const uploadFile = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      loadedTestCases.value = JSON.parse(reader.result as string) as BlobContent
    }
    reader.readAsText(filename)
  }
}

const onUpdateCleanerArg = (arg: ArgSrc | undefined, cond: TestCaseCond) => {
  const argArr = JSON.parse(cond.ArgumentMap) as Array<Arg>
  argArr.forEach((el) => {
    if (el.From) {
      if (el.From?.Src === arg?.Src) {
        el.From.TestCaseID = arg.TestCaseID
      }
    }
  })
  testCaseCond.updateTestCaseCond({
    ID: cond.ID,
    ArgumentMap: JSON.stringify(argArr),
    Message: {
      Error: {
        Title: 'MSG_DELETE_TEST_CASE_COND',
        Message: 'MSG_DELETE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
  console.log('argArr: ', argArr)
}

const onBatchCreateConds = (_loadedTestCases: BlobContent, index: number) => {
  if (index >= _loadedTestCases.Conds.length) {
    return
  }

  const _cond = _loadedTestCases.Conds[index]
  testCaseCond.createTestCaseCond({
    ID: _cond.ID,
    TestCaseID: _cond.TestCaseID,
    CondTestCaseID: _cond.CondTestCaseID,
    ArgumentMap: _cond.ArgumentMap,
    Index: _cond.Index,
    CondType: _cond.CondType,
    Message: {
      Error: {
        Title: 'MSG_CREATE_TEST_CASE_COND',
        Message: 'MSG_CREATE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      console.log('Cond Exists')
    }
    onBatchCreateConds(_loadedTestCases, index + 1)
  })
}

const onBatchCreate = (_loadedTestCases: BlobContent, index: number) => {
  if (index >= _loadedTestCases.TestCases.length) {
    onBatchCreateConds(_loadedTestCases, 0)
  }

  const _case = _loadedTestCases.TestCases[index]
  const _apiID = apis.getAPIByPath(_case.ApiPathPrefix, _case.ApiPath)?.EntID as string
  const _moduleID = _module.module(undefined, _case.ModuleName)?.ID as string
  testCase.createTestCase({
    ID: _case.ID,
    Name: _case.Name,
    Description: _case.Description,
    ModuleID: _moduleID,
    ApiID: _apiID,
    Input: JSON.stringify(_case.InputVal),
    InputDesc: JSON.stringify(_case.Args),
    Expectation: JSON.stringify(_case.OutputVal),
    TestCaseType: _case.TestCaseType,
    TestCaseClass: _case.TestCaseClass,
    Message: {
      Error: {
        Title: 'MSG_CREATE_TEST_CASE',
        Message: 'MSG_CREATE_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      console.log('TestCase Exists!')
    }
    onBatchCreate(_loadedTestCases, index + 1)
  })
}

const module = ref('')

const testCase = useTestCaseStore()
const name = ref('')

const testCases = computed(() => {
  if (showDeprecated.value) {
    return testCase.TestCases.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ModuleName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ApiPath?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
  }
  return testCase.TestCases.filter((el) => !el.Deprecated && (el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ModuleName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ApiPath?.toLowerCase()?.includes?.(name.value?.toLowerCase())))
})

const testCaseCond = useTestCaseCondStore()
const apis = useLocalAPIStore()
const _module = useModuleStore()

const testCaseConds = computed(() => {
  return testCaseCond.Conds
})

const testCaseByID = (id: string) => {
  return condTestCases.value.find((el) => el.ID === id)
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    align: 'left',
    field: (row: TestCase) => row.ID
  },
  {
    name: 'Module',
    label: t('MSG_MODULE'),
    align: 'left',
    sortable: true,
    field: (row: TestCase) => row.ModuleName
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    sortable: true,
    field: (row: TestCase) => row.Name
  },
  {
    name: 'Path',
    label: t('MSG_PATH'),
    align: 'left',
    sortable: true,
    field: (row: TestCase) => testCasePath(row)
  }
])

const options = ref([] as string[])
const moduleFilter = ref('')
const displayModules = computed(() => options.value?.filter((el) => el.toLowerCase().includes(moduleFilter.value?.toLowerCase())))

const log = (_log: string) => {
  executionLog.value = _log
}

const runCleaner = async (_testCase: TestCase) => {
  const cleaners = testCaseCond.getConds(_testCase.ID, CondType.Cleaner)
  cleaners.sort((a: TestCaseCond, b: TestCaseCond) => {
    return a.Index > b.Index ? 1 : -1
  })
  for (const v of cleaners) {
    const _case = testCase.testcase(v.CondTestCaseID)
    if (!_case) {
      continue
    }
    _case.InputVal = testCase.input(_case)
    try {
      const resp = await post(testCasePath(_case) as string, _case.InputVal)
      _case.OutputVal = (resp as Record<string, unknown>).Info as Record<string, unknown>
      if (!_case.OutputVal) {
        _case.OutputVal = (resp as Record<string, unknown>).Infos as Record<string, unknown>
      }
      log(`TestCase: ${JSON.stringify(_case)} Success`)
    } catch (err) {
      console.log(testCasePath(_case), err)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log(`TestCase: ${JSON.stringify(_case)} Fail: ${err}`)
    }
  }
}

const onExecTestCaseClick = async (_testCase: TestCase) => {
  if (_testCase.Deprecated) {
    return
  }
  if (_testCase.Collapsed) {
    await runPreConds(_testCase)
  }
  _testCase.InputVal = testCase.input(_testCase)
  void post(testCasePath(_testCase) as string, _testCase.InputVal)
    .then(async (resp: unknown) => {
      _testCase.Error = undefined
      _testCase.OutputVal = ((resp as Record<string, unknown>).Info) as Record<string, unknown>
      if (_testCase.OutputVal == null) {
        _testCase.OutputVal = ((resp as Record<string, unknown>).Infos) as Record<string, unknown>
      }
      log(`TestCase: ${JSON.stringify(_testCase)} Success`)
      await runCleaner(_testCase)
    })
    .catch(async (err: Error) => {
      _testCase.Error = err
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log(`TestCase: ${JSON.stringify(_testCase)} Fail: ${err}`)
      await runCleaner(_testCase)
    })
}

const runPreConds = async (_testCase: TestCase) => {
  const preConds = testCaseCond.getConds(_testCase.ID, CondType.PreCondition)
  preConds.sort((a: TestCaseCond, b: TestCaseCond) => {
    return a.Index > b.Index ? 1 : -1
  })
  for (const v of preConds) {
    const _case = testCase.testcase(v.CondTestCaseID)
    if (!_case) {
      continue
    }
    _case.InputVal = testCase.input(_case)
    try {
      const resp = await post(testCasePath(_case) as string, _case.InputVal)
      _case.OutputVal = (resp as Record<string, unknown>).Info as Record<string, unknown>
      if (!_case.OutputVal) {
        _case.OutputVal = (resp as Record<string, unknown>).Infos as Record<string, unknown>
      }
      log(`TestCase: ${JSON.stringify(_case)} Success`)
    } catch (err) {
      console.log(testCasePath(_case), err)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log(`TestCase: ${JSON.stringify(_case)} Fail: ${err}`)
    }
  }
}

const onCollapseClick = async (testCase: TestCase) => {
  testCase.Collapsed = !testCase.Collapsed
  if (!testCase.Collapsed && !testCase.Deprecated) {
    await runPreConds(testCase)
  }
}

const onEditTestCaseClick = (testCase: TestCase) => {
  target.value = testCase
  testCaseAPI.value = apis.APIs.find((el) => el.EntID === testCase.ApiID) as API
  showing.value = true
  updating.value = true
}

const onCloneTestCaseClick = (testCase: TestCase) => {
  target.value = { ...testCase }
  showing.value = true
  cloning.value = true
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
  testCase.Deprecated = true
}

const onSaveTestCaseClick = (_testCase: TestCase) => {
  _testCase.InputVal = testCase.input(_testCase)
  testCase.updateTestCase({
    ID: _testCase.ID,
    Name: _testCase.Name,
    Description: _testCase.Description,
    Input: JSON.stringify(_testCase.InputVal),
    InputDesc: JSON.stringify(_testCase.Args),
    Expectation: JSON.stringify(_testCase.OutputVal),
    Deprecated: _testCase.Deprecated,
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

const onExportClick = () => {
  const blobContent = {
    TestCases: testCases.value,
    Conds: testCaseConds.value
  } as BlobContent
  const blob = new Blob([JSON.stringify(blobContent)], { type: 'text/plain;charset=utf-8' })
  const filename = 'testcase-' + formatTime(new Date().getTime() / 1000) + '.json'
  saveAs(blob, filename)
}

const showing = ref(false)
const updating = ref(false)
const cloning = ref(false)
const showDeprecated = ref(false)

const target = ref({
  Args: [] as Arg[]
} as TestCase)
const targetInput = computed(() => testCase.input(target.value))

watch(targetInput, () => {
  target.value.InputVal = targetInput.value
})

watch(module, () => {
  if (module.value === 'Clear') {
    module.value = ''
  }
})

watch(() => target.value.ModuleName, () => {
  target.value.ModuleID = _module.Modules.find((el) => el.Name === target.value.ModuleName)?.ID as string
})

const pathFilter = ref('')
const modulePaths = computed(() => apis.getModuleAPIs(showing.value ? target.value.ModuleName : module.value).filter((el) => {
  return el.PathPrefix.indexOf(pathFilter.value) >= 0 || el.Path.indexOf(pathFilter.value) >= 0
}))

const testcaseFilter = ref('')
const condTestCases = computed(() => {
  return testCase.TestCases.filter((el) => !el.Deprecated && (el.Name?.toLowerCase()?.includes?.(testcaseFilter.value?.toLowerCase()) || el.ModuleName?.toLowerCase()?.includes?.(testcaseFilter.value?.toLowerCase()) || el.ApiPath?.toLowerCase()?.includes?.(testcaseFilter.value?.toLowerCase())))
})

const allPaths = computed(() => apis.APIs)
const testCaseAPI = ref(undefined as unknown as API)

watch(testCaseAPI, () => {
  target.value.ApiID = testCaseAPI.value?.EntID
})

const testCasePath = (_testCase?: TestCase) => {
  if (!_testCase) {
    return undefined
  }
  const path = testCase.path(_testCase)
  if (path) {
    return path
  }
  return apis.path(allPaths.value.find((el) => el.EntID === _testCase.ApiID))
}

const preCondTestCase = ref(undefined as unknown as TestCase)
const cleanerTestCase = ref(undefined as unknown as TestCase)

const onCreateClick = () => {
  showing.value = true
  testCaseAPI.value = undefined as unknown as API
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    ModuleName: module.value,
    Args: [] as Arg[]
  } as TestCase
}

const cloneCond = (testCaseID: string, conds: Array<TestCaseCond>, index: number) => {
  if (index >= conds.length) {
    return
  }

  const cond = conds[index]
  testCaseCond.createTestCaseCond({
    TestCaseID: testCaseID,
    CondTestCaseID: cond.CondTestCaseID,
    ArgumentMap: cond.ArgumentMap,
    Index: cond.Index,
    CondType: cond.CondType,
    Message: {
      Error: {
        Title: 'MSG_CLONE_TEST_CASE_COND',
        Message: 'MSG_CLONE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    cloneCond(testCaseID, conds, index + 1)
  })
}

const onTestCaseFilter = (val: string, update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void) => {
  update(() => {
    testcaseFilter.value = val
  })
}

const onPathFilter = (val: string, update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void) => {
  update(() => {
    pathFilter.value = val
  })
}

const onModuleFilter = (val: string, update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void) => {
  update(() => {
    moduleFilter.value = val
  })
}

const onAbortFilter = () => {
  console.log('delayed filter aborted')
}

const onSubmit = () => {
  showing.value = false
  target.value.InputVal = testCase.input(target.value)

  if (updating.value) {
    testCase.updateTestCase({
      ID: target.value.ID,
      Name: target.value.Name,
      Description: target.value.Description,
      Input: JSON.stringify(target.value.InputVal),
      InputDesc: JSON.stringify(target.value.Args),
      Expectation: JSON.stringify(target.value.OutputVal),
      Deprecated: target.value.Deprecated,
      TestCaseType: target.value.TestCaseType,
      TestCaseClass: target.value.TestCaseClass,
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

  const testCaseID = target.value.ID

  testCase.createTestCase({
    Name: target.value.Name,
    Description: target.value.Description,
    ModuleID: target.value.ModuleID,
    ApiID: target.value.ApiID,
    Input: JSON.stringify(target.value.InputVal),
    InputDesc: JSON.stringify(target.value.Args),
    Expectation: JSON.stringify(target.value.OutputVal),
    TestCaseType: target.value.TestCaseType,
    TestCaseClass: target.value.TestCaseClass,
    Message: {
      Error: {
        Title: 'MSG_CREATE_TEST_CASE',
        Message: 'MSG_CREATE_TEST_CASE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, _case?: TestCase) => {
    if (error) {
      return
    }
    if (!cloning.value) {
      return
    }
    const conds = testCaseCond.getConds(testCaseID)
    cloneCond(_case?.ID as string, conds, 0)
  })
}

const onModifyCondClick = (_testCaseCond: TestCaseCond) => {
  if (!_testCaseCond.Editing) {
    _testCaseCond.OldIndex = _testCaseCond.Index
  }
  _testCaseCond.Editing = true
}

const onConfirmModifyCondClick = (_testCaseCond: TestCaseCond) => {
  testCaseCond.updateTestCaseCond({
    ID: _testCaseCond.ID,
    Index: _testCaseCond.Index,
    Message: {
      Error: {
        Title: 'MSG_DELETE_TEST_CASE_COND',
        Message: 'MSG_DELETE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (!error) {
      _testCaseCond.Editing = false
    }
  })
}

const onCancelModifyCondClick = (_testCaseCond: TestCaseCond) => {
  _testCaseCond.Editing = false
  _testCaseCond.Index = _testCaseCond.OldIndex
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
  newArg.value.ID = uid()
  _testCase.Args.push(newArg.value)
  newArg.value = {} as Arg
  _testCase.InputVal = testCase.input(_testCase)
  testCase.updateTestCase({
    ID: _testCase.ID,
    Input: JSON.stringify(_testCase.InputVal),
    InputDesc: JSON.stringify(_testCase.Args),
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

const onCancelCreateArgClick = (testCase: TestCase) => {
  testCase.AddingArg = false
  newArg.value = {} as Arg
}

const onModifyArgClick = (arg: Arg) => {
  arg.Editing = true
}

const onConfirmModifyArgClick = (_testCase: TestCase, arg: Arg) => {
  arg.Editing = false
  const index = _testCase.Args.findIndex((el) => el.Name === arg.Name)
  _testCase.Args.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, arg)
  _testCase.InputVal = testCase.input(_testCase)
  testCase.updateTestCase({
    ID: _testCase.ID,
    Input: JSON.stringify(_testCase.InputVal),
    InputDesc: JSON.stringify(_testCase.Args),
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

const onDeleteArgClick = (_testCase: TestCase, arg: Arg) => {
  _testCase.Args = _testCase.Args.filter((el) => el.Name !== arg.Name)
  _testCase.InputVal = testCase.input(_testCase)
  testCase.updateTestCase({
    ID: _testCase.ID,
    Input: JSON.stringify(_testCase.InputVal),
    InputDesc: JSON.stringify(_testCase.Args),
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

const onCreatePreCondClick = (testCase: TestCase) => {
  testCase.AddingPreCond = true
}

const onConfirmCreatePreCondClick = (_testCase: TestCase) => {
  _testCase.AddingPreCond = false
  const _case = testCase.testcase(preCondTestCase.value.ID)
  if (!_case) {
    return
  }
  const conds = testCaseCond.getConds(_testCase.ID, CondType.PreCondition)
  const newIndex = conds.length
  testCaseCond.createTestCaseCond({
    TestCaseID: _testCase.ID,
    CondTestCaseID: preCondTestCase.value.ID,
    ArgumentMap: JSON.stringify(preCondTestCase.value.Args),
    Index: newIndex,
    CondType: CondType.PreCondition,
    Message: {
      Error: {
        Title: 'MSG_DELETE_TEST_CASE_COND',
        Message: 'MSG_DELETE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
  testcaseFilter.value = ''
  if (!_case.OutputVal) {
    _case.InputVal = testCase.input(_case)
    void post(testCasePath(_case) as string, _case.InputVal)
      .then((resp: unknown) => {
        _case.OutputVal = ((resp as Record<string, unknown>).Info) as Record<string, unknown>
        if (!_case.OutputVal) {
          _case.OutputVal = ((resp as Record<string, unknown>).Infos) as Record<string, unknown>
        }
        _testCase.InputVal = testCase.input(_testCase)
      })
      .catch((err: Error) => {
        _case.Error = err
      })
    return
  }
  _testCase.InputVal = testCase.input(_testCase)
}

const onCancelCreatePreCondClick = (testCase: TestCase) => {
  testCase.AddingPreCond = false
  testcaseFilter.value = ''
}

const onDeleteTestCaseCondClick = (cond: TestCaseCond) => {
  testCaseCond.deleteTestCaseCond({
    ID: cond.ID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_TEST_CASE_COND',
        Message: 'MSG_DELETE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCreateCleanerClick = (testCase: TestCase) => {
  testCase.AddingCleaner = true
}

const onConfirmCreateCleanerClick = (_testCase: TestCase) => {
  _testCase.AddingCleaner = false
  const _case = testCase.testcase(cleanerTestCase.value.ID)
  if (!_case) {
    return
  }
  const conds = testCaseCond.getConds(_testCase.ID, CondType.Cleaner)
  console.log('conds:', conds)
  console.log('_case:', _case)
  const newIndex = conds.length
  testCaseCond.createTestCaseCond({
    TestCaseID: _testCase.ID,
    CondTestCaseID: addingCleaner.value.CondTestCaseID,
    ArgumentMap: JSON.stringify(addingCleaner.value.Args),
    Index: newIndex,
    CondType: CondType.Cleaner,
    Message: {
      Error: {
        Title: 'MSG_DELETE_TEST_CASE_COND',
        Message: 'MSG_DELETE_TEST_CASE_COND_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
  testcaseFilter.value = ''
}

const onCancelCreateCleanerClick = (testCase: TestCase) => {
  testCase.AddingCleaner = false
  testcaseFilter.value = ''
}

const fromArgMapLabel = (from: ArgMap) => {
  const testcase = testCase.testcase(from.TestCaseID)
  if (!testcase) {
    return 'Invalid'
  }
  return testCasePath(testcase) as string + ':' + testcase.Name + ':' + from.Type + ':' + from.Src
}

const fromArgLabel = (testCase: TestCase, argID: string) => {
  if (!testCase.Args) {
    return 'Invalid'
  }
  const arg = testCase.Args.find((el) => el.ID === argID)
  if (!arg) {
    return 'Invalid'
  }
  return arg.Name + ':' + arg.ID
}

const addingCleaner = ref(undefined as unknown as TestCaseCond)

const onCleanerTestCaseUpdated = (_testCase: TestCase, cleanerTestCase: TestCase) => {
  addingCleaner.value = {
    ID: uid(),
    Index: 0,
    CondType: CondType.Cleaner,
    TestCaseID: _testCase.ID,
    CondTestCaseID: cleanerTestCase.ID,
    Args: [],
    ArgumentMap: '',
    OldIndex: 0,
    Editing: false
  }
  console.log('CleanerTestCase: ', cleanerTestCase.Args)
  if (cleanerTestCase.Args) {
    addingCleaner.value.Args.push(...cleanerTestCase.Args)
  }
  addingCleaner.value.Args.forEach((v) => {
    v.Editing = true
  })
}

const onModifyCleanerArgClick = (arg: Arg) => {
  arg.Editing = true
}

const onConfirmCreateCleanerArgClick = (_testCase: TestCase, arg: Arg) => {
  arg.Editing = false
  const index = addingCleaner.value?.Args?.findIndex((el) => el.Name === arg.Name)
  if (index < 0) {
    return
  }
  addingCleaner.value?.Args?.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, arg)
  // console.log('Arg: ', arg)
}

const onCancelCreateCleanerArgClick = (arg: Arg) => {
  arg.Editing = false
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

const fetchModules = (offset: number, limit: number) => {
  _module.getModules({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_MODULES',
        Message: 'MSG_GET_MODULES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Module[]) => {
    if (error || !rows?.length) {
      options.value.push('Clear')
      return
    }
    options.value.push(...rows.map((el) => el.Name).filter((el) => el.includes('npool.top')))
    fetchModules(offset + limit, limit)
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
  fetchModules(0, 100)
  fetchTestCases(0, 100)
  fetchTestCaseConds(0, 100)
})

</script>

<style lang='sass' scoped>
.test-case-header
  font-weight: normal

.arguments
  background-color: black
  color: $light-green-13
  font-weight: bold
  padding: 20px
  margin-right: 10px
  width: 500px

.output
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
  width: 240px
</style>
