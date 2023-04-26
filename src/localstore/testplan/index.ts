import { defineStore } from 'pinia'
import {
  CreateTestPlanRequest,
  CreateTestPlanResponse,
  DeleteTestPlanRequest,
  DeleteTestPlanResponse,
  GetTestPlansRequest,
  GetTestPlansResponse,
  TestPlan,
  UpdateTestPlanRequest,
  UpdateTestPlanResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'
import { API } from './const'
import { TestPlanState } from './state'

export const useTestPlanStore = defineStore('local-testplan', {
  state: (): TestPlanState => ({
    TestPlans: [] as Array<TestPlan>,
    Total: 0
  }),
  getters: {},
  actions: {
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
    },
    updateTestPlan (req: UpdateTestPlanRequest, done: (error: boolean, row?: TestPlan) => void) {
      doActionWithError<UpdateTestPlanRequest, UpdateTestPlanResponse>(
        API.UPDATE_TEST_PLAN,
        req,
        req.Message,
        (resp: UpdateTestPlanResponse): void => {
          const index = this.TestPlans.findIndex((el) => el.ID === resp.Info.ID)
          this.TestPlans.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    getTestPlans (req: GetTestPlansRequest, done: (error: boolean, rows: Array<TestPlan>) => void) {
      doActionWithError<GetTestPlansRequest, GetTestPlansResponse>(
        API.GET_TEST_PLANS,
        req,
        req.Message,
        (resp: GetTestPlansResponse): void => {
          resp.Infos.forEach((v) => {
            const index = this.TestPlans.findIndex((el) => el.ID === v.ID)
            this.TestPlans.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
          })
          done(false, resp.Infos)
        }, () => {
          done(true, [])
        }
      )
    },
    deleteTestPlan (req: DeleteTestPlanRequest, done: (error: boolean, row?: TestPlan) => void) {
      doActionWithError<DeleteTestPlanRequest, DeleteTestPlanResponse>(
        API.DELETE_TEST_PLAN,
        req,
        req.Message,
        (resp: DeleteTestPlanResponse): void => {
          const index = this.TestPlans.findIndex((el) => el.ID === resp.Info.ID)
          this.TestPlans.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
export * from './plantestcase'
