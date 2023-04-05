import { defineStore } from 'pinia'
import { TestCase, TestCaseState, CondType } from './types'
import { uid } from 'quasar'

const uid1 = uid()
const uid2 = uid()

const testCases = [
  {
    Name: '为其他应用创建用户',
    ID: uid(),
    Path: '/v1/create/app/user',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Args: {
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
    ],
    Collapsed: false
  },
  {
    Name: '创建用户',
    ID: uid1,
    Path: '/v1/create/user',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Args: {
      AAA: 'string',
      BBB: 'number'
    },
    PreConds: [],
    Cleaners: [],
    Collapsed: true
  }, {
    Name: '创建应用',
    ID: uid2,
    Path: '/v1/create/app',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Args: [],
    PreConds: [],
    Cleaners: [],
    Collapsed: true
  }, {
    Name: '为其他应用创建用户',
    ID: uid(),
    Path: '/v1/create/app/user',
    Module: 'good-manager.npool.top',
    PathPrefix: '/api/good',
    Args: {
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
    ],
    Collapsed: true
  }
]

export const useTestCaseStore = defineStore('testCase', {
  state: (): TestCaseState => ({
    TestCases: testCases as Array<TestCase>
  }),
  getters: {},
  actions: {}
})

export * from './types'
