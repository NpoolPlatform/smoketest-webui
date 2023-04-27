import { doActionWithError } from 'npool-cli-v4'
import { defineStore } from 'pinia'
import { TestCaseCond } from './cond'
import { API } from './const'
import {
  Arg, ArgSrc, ArgType
} from './base/arg'
import {
  CreateTestCaseRequest, CreateTestCaseResponse,
  DeleteTestCaseRequest, DeleteTestCaseResponse,
  GetTestCasesRequest, GetTestCasesResponse,
  TestCase,
  UpdateTestCaseRequest, UpdateTestCaseResponse
} from './types'
import { CondType } from './cond/def'
import { TestCaseState } from './state'
import { uid } from 'quasar'

export const useTestCaseStore = defineStore('local-testcase', {
  state: (): TestCaseState => ({
    TestCases: [] as Array<TestCase>,
    Total: 0
  }),
  getters: {
    args (): (testCase: TestCase, argID?: string) => Record<string, unknown> {
      return (testCase: TestCase, argID?: string) => {
        const arg = {} as Record<string, unknown>
        if (!testCase.Args) {
          return {}
        }
        let args = testCase.Args
        if (argID) {
          args = testCase.Args.filter((el) => el.ParentID === argID)
        }
        args.forEach((v) => {
          if (v.ParentID && !argID) {
            return
          }
          if (v.Type === 'Object') {
            arg[v.Name] = this.args(testCase, v.ID)
            return
          }
          arg[v.Name] = v.Type
        })
        return arg
      }
    },
    input (): (testCase: TestCase, argID?: string) => Record<string, unknown> {
      return (testCase: TestCase, argID?: string) => {
        if (!testCase.Args) {
          return {}
        }
        let args = testCase.Args
        if (argID) {
          args = testCase.Args.filter((el) => el.ParentID === argID)
        }
        const input = {} as Record<string, unknown>
        args.forEach((v: Arg) => {
          if (v.ParentID && !argID) {
            return
          }
          if (v.From) {
            const _case = this.TestCases.find((el) => el.ID === v.From?.TestCaseID)
            switch (v.From.Type) {
              case ArgType.Input:
                input[v.Name] = _case?.InputVal?.[v.From.Src]
                break
              case ArgType.Output:
                input[v.Name] = _case?.Output?.[v.From.Src]
                break
            }
            return input
          }
          switch (v.Type) {
            case 'String':
              if (v.Random) {
                input[v.Name] = uid()
              } else {
                input[v.Name] = v.Value?.toString()
              }
              break
            case 'Number':
              input[v.Name] = Number(v.Value)
              break
            case 'Object':
              input[v.Name] = this.input(testCase, v.ID)
              break
            case 'Decimal':
              input[v.Name] = v.Value?.toString()
              break
            case 'Array':
              input[v.Name] = v.Value?.toString().split(',')
          }
        })
        return input
      }
    },
    testCase2ArgSrc (): (testCase: TestCase) => Array<ArgSrc> {
      return (testCase: TestCase) => {
        const srcs = [] as Array<ArgSrc>
        for (const key of Object.keys(this.input(testCase))) {
          srcs.push({
            TestCaseID: testCase.ID,
            Src: key,
            Type: ArgType.Input
          })
        }
        if (testCase.Output) {
          for (const key of Object.keys(testCase.Output)) {
            srcs.push({
              TestCaseID: testCase.ID,
              Src: key,
              Type: ArgType.Output
            })
          }
        }
        return srcs
      }
    },
    argSrcs (): (conds: Array<TestCaseCond>) => Array<ArgSrc> {
      return (conds: Array<TestCaseCond>) => {
        let srcs = [] as ArgSrc[]
        conds.forEach((v) => {
          if (v.CondType === CondType.Cleaner) {
            return
          }
          const _case = this.TestCases.find((el) => el.ID === v.CondTestCaseID)
          if (!_case) {
            return
          }
          srcs = [...srcs, ...this.testCase2ArgSrc(_case)]
        })
        return srcs
      }
    },
    cleanerArgSrcs (): (testCase: TestCase, conds: Array<TestCaseCond>) => Array<ArgSrc> {
      return (testCase: TestCase, conds: Array<TestCaseCond>) => {
        const srcs = this.argSrcs(conds)
        return [...srcs, ...this.testCase2ArgSrc(testCase)]
      }
    },
    testcase (): (id: string) => TestCase | undefined {
      return (id: string) => {
        return this.TestCases.find((el) => el.ID === id)
      }
    },
    path (): (testCase?: TestCase) => string | undefined {
      return (testCase?: TestCase) => {
        if (!testCase) {
          return undefined
        }
        return testCase.ApiPathPrefix.replace('/api', '') + testCase.ApiPath
      }
    }
  },
  actions: {
    createTestCase (req: CreateTestCaseRequest, done: (error: boolean, testcase?: TestCase) => void) {
      doActionWithError<CreateTestCaseRequest, CreateTestCaseResponse>(
        API.CREATE_TEST_CASE,
        req,
        req.Message,
        (resp: CreateTestCaseResponse): void => {
          const v = resp.Info
          try {
            v.InputVal = JSON.parse(v.Input) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Input, e)
          }
          try {
            v.Output = JSON.parse(v.Expectation) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Expectation, e)
          }
          try {
            v.Args = [...JSON.parse(v.InputDesc) as Array<Arg>]
          } catch (e) {
            console.log('Invalid arguments', v.InputDesc, e)
          }
          v.Collapsed = true
          this.TestCases.push(v)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    updateTestCase (req: UpdateTestCaseRequest, done: (error: boolean, testcase?: TestCase) => void) {
      doActionWithError<UpdateTestCaseRequest, UpdateTestCaseResponse>(
        API.UPDATE_TEST_CASE,
        req,
        req.Message,
        (resp: UpdateTestCaseResponse): void => {
          const v = resp.Info
          try {
            v.InputVal = JSON.parse(v.Input) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Input, e)
          }
          try {
            v.Output = JSON.parse(v.Expectation) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Expectation, e)
          }
          try {
            v.Args = [...JSON.parse(v.InputDesc) as Array<Arg>]
          } catch (e) {
            console.log('Invalid arguments', v.InputDesc, e)
          }
          const index = this.TestCases.findIndex((el) => el.ID === v.ID)
          this.TestCases.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    deleteTestCase (req: DeleteTestCaseRequest, done: (error: boolean, testcase?: TestCase) => void) {
      doActionWithError<DeleteTestCaseRequest, DeleteTestCaseResponse>(
        API.DELETE_TSET_CASE,
        req,
        req.Message,
        (resp: DeleteTestCaseResponse): void => {
          const index = this.TestCases.findIndex((el) => el.ID === resp.Info.ID)
          this.TestCases.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    getTestCases (req: GetTestCasesRequest, done: (error: boolean, testcases?: Array<TestCase>) => void) {
      doActionWithError<GetTestCasesRequest, GetTestCasesResponse>(
        API.GET_TEST_CASES,
        req,
        req.Message,
        (resp: GetTestCasesResponse): void => {
          resp.Infos.forEach((v) => {
            v.Collapsed = true
            try {
              v.InputVal = JSON.parse(v.Input) as Record<string, unknown>
            } catch (e) {
              console.log('Invalid arguments', v.Input, e)
            }
            try {
              v.Output = JSON.parse(v.Expectation) as Record<string, unknown>
            } catch (e) {
              console.log('Invalid arguments', v.Expectation, e)
            }
            try {
              v.Args = [...JSON.parse(v.InputDesc) as Array<Arg>]
            } catch (e) {
              console.log('Invalid arguments', v.InputDesc, e)
            }
            const index = this.TestCases.findIndex((el) => el.ID === v.ID)
            this.TestCases.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
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
export * from './base/arg'
export * from './cond'
