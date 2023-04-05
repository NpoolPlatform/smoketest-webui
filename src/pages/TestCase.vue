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
        <q-btn dense>
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
          <q-td auto-width class='bg-blue test-case-header' />
          <q-td
            v-for='col in props.cols'
            :key='col.name'
            :props='props'
            class='bg-blue test-case-header'
          >
            {{ col.value }}
          </q-td>
          <q-td class='bg-blue test-case-header'>
            <q-btn @click='onExecTestCase(props.row)'>
              执行
            </q-btn>
          </q-td>
          <q-td colspan='100%' class='bg-blue test-case-header' />
        </q-tr>
        <q-tr :props='props'>
          <q-td auto-width />
          <q-td>
            <div>Arguments</div>
          </q-td>
          <q-td colspan='90%' class='arguments'>
            <pre v-html='JSON.stringify(props.row.Arguments, null, 2)' />
          </q-td>
          <q-td>
            <q-btn>编辑</q-btn>
            <q-btn>保存</q-btn>
          </q-td>
        </q-tr>
        <q-tr :props='props'>
          <q-td auto-width />
          <q-td>
            <div>PreConds</div>
          </q-td>
          <q-td colspan='90%'>
            <div
              v-for='cond in props.row.PreConds'
              :key='cond'
            >
              <q-tr>
                <q-td>{{ cond.Index }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.Name }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.Module }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.Path }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.PathPrefix }}</q-td>
                <q-td>
                  <q-btn dense>
                    删除
                  </q-btn>
                </q-td>
              </q-tr>
            </div>
          </q-td>
          <q-td>
            <q-btn>增加</q-btn>
            <q-btn>保存</q-btn>
          </q-td>
        </q-tr>
        <q-tr :props='props'>
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
                <q-td>{{ testCaseByID(cond.ID)?.Path }}</q-td>
                <q-td>{{ testCaseByID(cond.ID)?.PathPrefix }}</q-td>
                <q-td>
                  <q-btn dense>
                    删除
                  </q-btn>
                </q-td>
              </q-tr>
            </div>
          </q-td>
          <q-td>
            <q-btn>增加</q-btn>
            <q-btn>保存</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang='ts'>
import { uid } from 'quasar'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestCase, CondType } from 'src/types/types'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const uid1 = ref(uid())
const uid2 = ref(uid())
const module = ref('')

const testCases = [
  {
    Name: '为其他应用创建用户',
    ID: uid(),
    Path: '/v1/create/app/user',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Arguments: {
      AAA: 'string',
      BBB: 'number'
    },
    PreConds: [
      {
        ID: uid1,
        Index: 0,
        Type: CondType.PreCondition,
        ArgMap: []
      },
      {
        ID: uid2,
        Index: 1,
        Type: CondType.PreCondition,
        ArgMap: []
      }
    ],
    Cleaners: [
      {
        ID: uid1,
        Index: 0,
        Type: CondType.Cleaner
      },
      {
        ID: uid2,
        Index: 1,
        Type: CondType.Cleaner,
        ArgMap: []
      }
    ]
  },
  {
    Name: '创建用户',
    ID: uid1,
    Path: '/v1/create/user',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Arguments: {
      AAA: 'string',
      BBB: 'number'
    }
  }, {
    Name: '创建应用',
    ID: uid2,
    Path: '/v1/create/app',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good'
  }, {
    Name: '为其他应用创建用户',
    ID: uid(),
    Path: '/v1/create/app/user',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Arguments: {
      AAA: 'string',
      BBB: 'number'
    },
    PreConds: [
      {
        ID: uid1,
        Index: 0,
        Type: CondType.PreCondition,
        ArgMap: []
      },
      {
        ID: uid2,
        Index: 1,
        Type: CondType.PreCondition,
        ArgMap: []
      }
    ],
    Cleaners: [
      {
        ID: uid1,
        Index: 0,
        Type: CondType.Cleaner,
        ArgMap: []
      },
      {
        ID: uid2,
        Index: 1,
        Type: CondType.Cleaner,
        ArgMap: []
      }
    ]
  }
]

const testCaseByID = (id: string) => {
  return testCases.find((el) => el.ID === id)
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
    field: (row: TestCase) => row.Path
  },
  {
    name: 'Module',
    label: t('MSG_MODULE'),
    align: 'left',
    field: (row: TestCase) => row.Module
  },
  {
    name: 'PatPrefix',
    label: t('MSG_PATH_PREFIX'),
    align: 'left',
    field: (row: TestCase) => row.PathPrefix
  }
])

watch(module, () => {
  if (module.value === 'Clear') {
    module.value = ''
  }
})

const options = computed(() => [
  'good-manager.npool.top',
  'good-manager.npool.top',
  'Clear'
])

const onExecTestCase = (testCase: TestCase) => {
  console.log(testCase)
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
