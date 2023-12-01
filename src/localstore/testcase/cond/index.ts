import { defineStore } from 'pinia'
import { Arg } from '../base/arg'
import { API } from './const'
import { CondType } from './def'
import { TestCaseCondState } from './state'
import {
  CreateTestCaseCondRequest, CreateTestCaseCondResponse,
  DeleteTestCaseCondRequest, DeleteTestCaseCondResponse,
  GetTestCaseCondsRequest, GetTestCaseCondsResponse,
  TestCaseCond,
  UpdateTestCaseCondRequest, UpdateTestCaseCondResponse
} from './types'
import { doActionWithError } from 'src/npoolstore/request'

export const useTestCaseCondStore = defineStore('local-testcasecond', {
  state: (): TestCaseCondState => ({
    Conds: [] as Array<TestCaseCond>,
    Total: 0
  }),
  getters: {
    getConds (): (testCaseID: string, condType?: CondType) => Array<TestCaseCond> {
      return (testCaseID: string, condType?: CondType) => {
        const conds = this.Conds.filter((el) => {
          if (el.TestCaseID !== testCaseID) {
            return false
          }
          if (condType && el.CondType !== condType) {
            return false
          }
          return true
        })
        conds.sort((a: TestCaseCond, b: TestCaseCond) => {
          return a.Index > b.Index ? 1 : -1
        })
        return conds
      }
    }
  },
  actions: {
    createTestCaseCond (req: CreateTestCaseCondRequest, done: (error: boolean, testcase?: TestCaseCond) => void) {
      doActionWithError<CreateTestCaseCondRequest, CreateTestCaseCondResponse>(
        API.CREATE_TEST_CASE_COND,
        req,
        req.Message,
        (resp: CreateTestCaseCondResponse): void => {
          const v = resp.Info
          try {
            v.Args = [...JSON.parse(v.ArgumentMap) as Array<Arg>]
          } catch (e) {
            console.log('Invalid arguments', v.ArgumentMap, e)
          }
          this.Conds.push(v)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    updateTestCaseCond (req: UpdateTestCaseCondRequest, done: (error: boolean, testcase?: TestCaseCond) => void) {
      doActionWithError<UpdateTestCaseCondRequest, UpdateTestCaseCondResponse>(
        API.UPDATE_TEST_CASE_COND,
        req,
        req.Message,
        (resp: UpdateTestCaseCondResponse): void => {
          const v = resp.Info
          try {
            v.Args = [...JSON.parse(v.ArgumentMap) as Array<Arg>]
          } catch (e) {
            console.log('Invalid arguments', v.ArgumentMap, e)
          }
          const index = this.Conds.findIndex((el) => el.ID === v.ID)
          this.Conds.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    deleteTestCaseCond (req: DeleteTestCaseCondRequest, done: (error: boolean, testcase?: TestCaseCond) => void) {
      doActionWithError<DeleteTestCaseCondRequest, DeleteTestCaseCondResponse>(
        API.DELETE_TSET_CASE_COND,
        req,
        req.Message,
        (resp: DeleteTestCaseCondResponse): void => {
          const index = this.Conds.findIndex((el) => el.ID === resp.Info.ID)
          this.Conds.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    getTestCaseConds (req: GetTestCaseCondsRequest, done: (error: boolean, testcases?: Array<TestCaseCond>) => void) {
      doActionWithError<GetTestCaseCondsRequest, GetTestCaseCondsResponse>(
        API.GET_TEST_CASES_COND,
        req,
        req.Message,
        (resp: GetTestCaseCondsResponse): void => {
          resp.Infos.forEach((v) => {
            try {
              v.Args = [...JSON.parse(v.ArgumentMap) as Array<Arg>]
            } catch (e) {
              console.log('Invalid arguments', v.ArgumentMap, e)
            }
            const index = this.Conds.findIndex((el) => el.ID === v.ID)
            this.Conds.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
          })
          done(false, resp.Infos)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
export * from './def'
