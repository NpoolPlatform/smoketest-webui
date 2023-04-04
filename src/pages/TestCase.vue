<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_TEST_CASE")'
      row-key='ID'
      :rows='testCases'
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
          <q-td colspan='80%' class='arguments'>
            <pre v-html='JSON.stringify(props.row.Arguments, null, 2)' />
          </q-td>
          <q-td>
            <div>
              <q-btn>编辑</q-btn>
            </div>
            <div>
              <q-btn>保存</q-btn>
            </div>
          </q-td>
        </q-tr>
        <q-tr :props='props'>
          <q-td auto-width />
          <q-td>
            <div>PreConditions</div>
          </q-td>
          <q-td colspan='100%'>
            <div
              v-for='cond in props.row.PreConditions'
              :key='cond'
            >
              {{ cond }}
            </div>
          </q-td>
        </q-tr>
        <q-tr :props='props'>
          <q-td auto-width />
          <q-td>
            <div>Cleaners</div>
          </q-td>
          <q-td colspan='100%'>
            <div
              v-for='cond in props.row.Cleaners'
              :key='cond'
            >
              {{ cond }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang='ts'>
import { uid } from 'quasar'
import { ref } from 'vue'

const uid1 = ref(uid())
const uid2 = ref(uid())

const testCases = [
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
    PreConditions: [
      uid1,
      uid2
    ],
    Cleaners: [
      uid1,
      uid2
    ]
  }
]

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
