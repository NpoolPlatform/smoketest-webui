import { defineStore } from 'pinia'
import { CreateTestCaseInstanceRequest, TestCaseInstance, TestPlan, TestPlanState } from './types'
import { uid } from 'quasar'

export const useTestPlanStore = defineStore('local-testplan', {
  state: (): TestPlanState => ({
    TestPlans: [] as Array<TestPlan>,
    TestCases: new Map<string, Array<TestCaseInstance>>()
  }),
  getters: {
    testcases (): (id: string) => Array<TestCaseInstance> | undefined {
      return (id: string) => {
        console.log(id, this.TestCases.get(id))
        return this.TestCases.get(id)
      }
    }
  },
  actions: {
    createTestCase (req: CreateTestCaseInstanceRequest, done: (error: boolean, row: TestCaseInstance) => void) {
      let cases = this.TestCases.get(req.PlanID)
      if (!cases) {
        cases = [] as Array<TestCaseInstance>
      }
      cases.push({
        ID: uid(),
        CaseID: req.CaseID,
        PlanID: req.PlanID
      } as TestCaseInstance)
      this.TestCases.set(req.PlanID, cases)
      done(false, {} as TestCaseInstance)
    }
  }
})

export * from './types'
