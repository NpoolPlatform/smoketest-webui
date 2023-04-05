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
              {{ cond }}
            </div>
          </q-td>
          <q-td>
            <q-btn>编辑</q-btn>
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
              {{ cond }}
            </div>
          </q-td>
          <q-td>
            <q-btn>编辑</q-btn>
            <q-btn>保存</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang='ts'>
import { uid } from 'quasar'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestCase } from 'src/types/types'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const uid1 = ref(uid())
const uid2 = ref(uid())

const testCases = [
  {
    Name: '为其他应用创建用户',
    ID: uid(),
    Path: '/v1/create/app/user',
    Domain: 'good-manager.npool.top',
    Arguments: {
      AAA: 'string',
      BBB: 'number'
    },
    PreConds: [
      uid1,
      uid2
    ],
    Cleaners: [
      uid1,
      uid2
    ]
  },
  {
    Name: '创建用户',
    ID: uid1,
    Path: '/v1/create/user',
    Domain: 'good-manager.npool.top',
    Arguments: {
      AAA: 'string',
      BBB: 'number'
    }
  }, {
    Name: '创建应用',
    ID: uid2,
    Path: '/v1/create/app',
    Domain: 'good-manager.npool.top'
  }, {
    Name: '为其他应用创建用户',
    ID: uid(),
    Path: '/v1/create/app/user',
    Domain: 'good-manager.npool.top',
    Arguments: {
      AAA: 'string',
      BBB: 'number'
    },
    PreConds: [
      uid1,
      uid2
    ],
    Cleaners: [
      uid1,
      uid2
    ]
  }
]

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
    name: 'Domain',
    label: t('MSG_DOMAIN'),
    align: 'left',
    field: (row: TestCase) => row.Domain
  }
])

</script>

<style lang='sass' scoped>
.test-case-header
  color: white
  font-weight: bold

.arguments
  background-color: black
  color: $light-green-13
  font-weight: bold
</style>
