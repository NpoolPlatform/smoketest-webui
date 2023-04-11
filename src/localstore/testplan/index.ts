import { defineStore } from 'pinia'
import { TestCaseInstance, TestPlan, TestPlanState } from './types'

export const useTestPlanStore = defineStore('local-testplan', {
  state: (): TestPlanState => ({
    TestPlans: [] as Array<TestPlan>,
    TestCases: new Map<string, Array<TestCaseInstance>>()
  }),
  getters: {
    testcases (): (id: string) => Array<TestCaseInstance> | undefined {
      return (id: string) => {
        return this.TestCases.get(id)
      }
    }
  },
  actions: {}
})

export * from './types'
