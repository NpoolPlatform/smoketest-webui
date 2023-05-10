import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v4'
import { API } from './const'
import { PlanTestCaseState } from './state'
import {
  CreatePlanTestCaseRequest,
  CreatePlanTestCaseResponse,
  DeletePlanTestCaseRequest,
  DeletePlanTestCaseResponse,
  GetPlanTestCasesRequest,
  GetPlanTestCasesResponse,
  PlanTestCase,
  TestCaseResult,
  UpdatePlanTestCaseRequest,
  UpdatePlanTestCaseResponse
} from './types'

export const usePlanTestCaseStore = defineStore('local-plantestcase', {
  state: (): PlanTestCaseState => ({
    TestCases: [] as Array<PlanTestCase>,
    Total: 0
  }),
  getters: {
    testcases (): (id: string) => Array<PlanTestCase> | undefined {
      return (id: string) => {
        return this.TestCases.filter((el) => el.TestPlanID === id)
      }
    }
  },
  actions: {
    createPlanTestCase (req: CreatePlanTestCaseRequest, done: (error: boolean, row?: PlanTestCase) => void) {
      doActionWithError<CreatePlanTestCaseRequest, CreatePlanTestCaseResponse>(
        API.CREATE_PLAN_TEST_CASE,
        req,
        req.Message,
        (resp: CreatePlanTestCaseResponse): void => {
          try {
            resp.Info.OutputVal = JSON.parse(resp.Info.Output) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid Output', resp.Info.Output, e)
          }
          this.TestCases.push(resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    updatePlanTestCase (req: UpdatePlanTestCaseRequest, done: (error: boolean, row?: PlanTestCase) => void) {
      doActionWithError<UpdatePlanTestCaseRequest, UpdatePlanTestCaseResponse>(
        API.UPDATE_PLAN_TEST_CASE,
        req,
        req.Message,
        (resp: UpdatePlanTestCaseResponse): void => {
          try {
            resp.Info.OutputVal = JSON.parse(resp.Info.Output) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid Output', resp.Info.Output, e)
          }
          resp.Info.Pass = resp.Info.Result === TestCaseResult.Passed
          const index = this.TestCases.findIndex((el) => el.ID === resp.Info.ID)
          this.TestCases.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    getPlanTestCases (req: GetPlanTestCasesRequest, done: (error: boolean, rows: Array<PlanTestCase>) => void) {
      doActionWithError<GetPlanTestCasesRequest, GetPlanTestCasesResponse>(
        API.GET_PLAN_TEST_CASES,
        req,
        req.Message,
        (resp: GetPlanTestCasesResponse): void => {
          resp.Infos.forEach((v) => {
            const index = this.TestCases.findIndex((el) => el.ID === v.ID)
            try {
              v.OutputVal = JSON.parse(v.Output) as Record<string, unknown>
            } catch (e) {
              console.log('Invalid Output', v.Output, e)
            }
            v.Pass = v.Result === TestCaseResult.Passed
            this.TestCases.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
          })
          done(false, resp.Infos)
        }, () => {
          done(true, [])
        }
      )
    },
    deletePlanTestCase (req: DeletePlanTestCaseRequest, done: (error: boolean, row?: PlanTestCase) => void) {
      doActionWithError<DeletePlanTestCaseRequest, DeletePlanTestCaseResponse>(
        API.DELETE_PLAN_TEST_CASE,
        req,
        req.Message,
        (resp: DeletePlanTestCaseResponse): void => {
          const index = this.TestCases.findIndex((el) => el.ID === resp.Info.ID)
          this.TestCases.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
