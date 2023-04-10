import { defineStore } from 'pinia'
import { TestCase, TestCaseState } from './types'

export const useTestCaseStore = defineStore('testCase', {
  state: (): TestCaseState => ({
    TestCases: [] as Array<TestCase>
  }),
  getters: {},
  actions: {}
})

export * from './types'
