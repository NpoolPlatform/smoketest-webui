<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='testCases'
      :columns='columns'
    >
      <template #top-right>
        <q-select
          v-model='module'
          :options='options'
          dense
          :label='$t("MSG_MODULE")'
          class='filter'
        />
        <q-btn dense @click='onFetchAPIsClick'>
          {{ $t('MSG_FETCH_APIS') }}
        </q-btn>
        <q-btn dense @click='onCreateClick'>
          {{ $t('MSG_CREATE') }}
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
        </q-tr>
      </template>
      <template #body='props'>
        <q-tr :props='props'>
          <q-td auto-width class='bg-cyan-6 test-case-header' />
          <q-td
            v-for='col in props.cols'
            :key='col.name'
            :props='props'
            class='bg-cyan-6 test-case-header'
          >
            {{ col.value }}
          </q-td>
          <q-td class='bg-cyan-6 test-case-header'>
            <q-btn @click='onExecTestCase(props.row)'>
              执行
            </q-btn>
            <q-btn @click='onCollapse(props.row)'>
              折叠/展开
            </q-btn>
            <q-btn @click='onCollapse(props.row)'>
              编辑
            </q-btn>
            <q-btn @click='onCollapse(props.row)'>
              删除
            </q-btn>
            <q-btn @click='onCollapse(props.row)'>
              废弃
            </q-btn>
            <q-btn @click='onCollapse(props.row)'>
              保存
            </q-btn>
          </q-td>
          <q-td colspan='100%' class='bg-cyan-6 test-case-header' />
        </q-tr>
        <q-tr :props='props' v-show='!props.row.Collapsed'>
          <q-td auto-width />
          <q-td>
            <div>Arguments</div>
          </q-td>
          <q-td>
            <div>
              <pre class='arguments' v-html='JSON.stringify(props.row.Args, null, 2)' />
            </div>
          </q-td>
          <q-td colspan='100%'>
            <div
              v-for='arg in props.row.Args'
              :key='arg.Name'
              class='row'
            >
              <q-input v-model='arg.Name' :disable='!arg.Editing' label='Argument Name' />
              <q-select
                label='Argument Type'
                :options='ArgDefs'
                v-model='arg.Type'
                :disable='!arg.Editing'
                class='filter'
              />
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
            <div>PreConds</div>
          </q-td>
          <q-td colspan='100%'>
            <div
              v-for='cond in props.row.PreConds'
              :key='cond'
            >
              <q-tr>
                <q-td>{{ cond.Index }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.Name }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.Module }}</q-td>
                <q-td>{{ apiPath(testCaseByID(cond.ID)?.ApiID) }}</q-td>
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
                :option-label='(item) => item.ID + ": " + item.Name + ": " + apiPath(item.ApiID)'
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
                <q-td>{{ testCaseByID(cond.ID)?.Module }}</q-td>
                <q-td>{{ apiPath(testCaseByID(cond.ID)?.ApiID) }}</q-td>
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
                :option-label='(item) => item.ID + ": " + item.Name + ": " + apiPath(item.ApiID)'
                dense
                :label='$t("MSG_PATH")'
                class='filter'
              />
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
        <span>{{ $t('MSG_CREATE_ROLE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model='target.Module'
          :options='options'
          dense
          :label='$t("MSG_MODULE")'
          class='filter'
          :disable='target.Module !== undefined && target.Module.length > 0'
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
import { TestCase, useTestCaseStore, useLocalAPIStore, API, ArgDefs, Arg, Cond, CondType } from 'src/localstore'
import { NotifyType } from 'npool-cli-v4'
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
    field: (row: TestCase) => apiPath(row.ApiID)
  },
  {
    name: 'Module',
    label: t('MSG_MODULE'),
    align: 'left',
    field: (row: TestCase) => row.Module
  }
])

watch(module, () => {
  if (module.value === 'Clear') {
    module.value = ''
  }
})

const options = ref([] as string[])

const onExecTestCase = (testCase: TestCase) => {
  console.log(testCase)
}

const onCollapse = (testCase: TestCase) => {
  testCase.Collapsed = !testCase.Collapsed
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
const target = ref({
  Module: module.value,
  Args: [] as Arg[],
  PreConds: [] as Cond[],
  Cleaners: [] as Cond[]
} as TestCase)

watch(module, () => {
  target.value.Module = module.value
})

const modulePaths = computed(() => apis.getModuleAPIs(showing.value ? target.value.Module : module.value))
const allPaths = computed(() => apis.APIs)
const testCaseAPI = ref(undefined as unknown as API)

watch(testCaseAPI, () => {
  target.value.ApiID = testCaseAPI.value?.ID
})

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

const preCondTestCase = ref(undefined as unknown as TestCase)
const cleanerTestCase = ref(undefined as unknown as TestCase)

const onCreateClick = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    Module: module.value
  } as TestCase
}

const onSubmit = () => {
  showing.value = false
  target.value.ID = uid()
  testCase.TestCases.push(target.value)
}

const onCancel = () => {
  onMenuHide()
}

const newArg = ref({} as Arg)
const onCreateArgClick = (testCase: TestCase) => {
  testCase.AddingArg = true
}

const onConfirmCreateArgClick = (testCase: TestCase) => {
  testCase.AddingArg = false
  testCase.Args.push(newArg.value)
  newArg.value = {} as Arg
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

const onConfirmCreatePreCondClick = (testCase: TestCase) => {
  testCase.AddingPreCond = false
  testCase.PreConds.push({
    ID: preCondTestCase.value.ID,
    Index: 0,
    Type: CondType.PreCondition,
    ArgMap: []
  } as Cond)
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
  testCase.Cleaners.push({
    ID: cleanerTestCase.value.ID,
    Index: 0,
    Type: CondType.Cleaner,
    ArgMap: []
  } as Cond)
}

const onCancelCreateCleanerClick = (testCase: TestCase) => {
  testCase.AddingCleaner = false
}

const onDeleteCleanerClick = (testCase: TestCase, cond: Cond) => {
  testCase.Cleaners = testCase.Cleaners.filter((el) => el.ID !== cond.ID)
}

</script>

<style lang='sass' scoped>
.test-case-header
  color: white
  font-weight: bold

.arguments
  background-color: black
  color: $light-green-13
  font-weight: bold

.filter
  min-width: 220px
</style>
