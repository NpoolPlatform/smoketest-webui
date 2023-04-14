import { defineStore } from 'pinia'
import { CreateTestCaseInstanceRequest, CreateTestPlanRequest, CreateTestPlanResponse, TestCaseInstance, TestPlan, TestPlanState } from './types'
import { uid } from 'quasar'
import { doActionWithError } from 'npool-cli-v4'
import { API } from './const'

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
  actions: {
    createTestCase (req: CreateTestCaseInstanceRequest, done: (error: boolean, row?: TestCaseInstance) => void) {
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
    },
    createTestPlan (req: CreateTestPlanRequest, done: (error: boolean, row?: TestPlan) => void) {
      doActionWithError<CreateTestPlanRequest, CreateTestPlanResponse>(
        API.CREATE_TEST_PLAN,
        req,
        req.Message,
        (resp: CreateTestPlanResponse): void => {
          this.TestPlans.push(resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
