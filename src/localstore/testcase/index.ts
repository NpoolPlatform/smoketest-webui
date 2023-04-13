import { doActionWithError } from 'npool-cli-v4'
import { defineStore } from 'pinia'
import { API } from './const'
import { Arg, ArgSrc, ArgType, CreateTestCaseRequest, CreateTestCaseResponse, DeleteTestCaseRequest, DeleteTestCaseResponse, GetTestCasesRequest, GetTestCasesResponse, TestCase, TestCaseState, UpdateTestCaseRequest, UpdateTestCaseResponse } from './types'

export const useTestCaseStore = defineStore('local-testcase', {
  state: (): TestCaseState => ({
    TestCases: [] as Array<TestCase>
  }),
  getters: {
    args (): (testCase: TestCase) => Record<string, unknown> {
      return (testCase: TestCase) => {
        const arg = {} as Record<string, unknown>
        if (!testCase.Args) {
          return {}
        }
        testCase.Args.forEach((v) => {
          arg[v.Name] = v.Type
        })
        return arg
      }
    },
    input (): (testCase: TestCase) => Record<string, unknown> {
      return (testCase: TestCase) => {
        if (!testCase.Args) {
          return {}
        }
        const input = {} as Record<string, unknown>
        testCase.Args.forEach((v) => {
          if (v.From) {
            const _case = this.TestCases.find((el) => el.ID === v.From?.ID)
            switch (v.From.Type) {
              case ArgType.Input:
                input[v.Name] = _case?.Input?.[v.From.Src]
                break
              case ArgType.Output:
                input[v.Name] = _case?.Output?.[v.From.Src]
                break
            }
            return input
          }
          switch (v.Type) {
            case 'String':
              input[v.Name] = v.Value?.toString()
              break
            case 'Number':
              input[v.Name] = 0
              break
            case 'Object':
              input[v.Name] = {}
              break
            case 'Decimal':
              input[v.Name] = '0.0'
              break
          }
        })
        return input
      }
    },
    argSrcs (): (testCase: TestCase) => Array<ArgSrc> {
      return (testCase: TestCase) => {
        if (!testCase.PreConds) {
          return []
        }
        const srcs = [] as ArgSrc[]
        testCase.PreConds.forEach((v) => {
          const _case = this.TestCases.find((el) => el.ID === v.TestCaseID)
          if (!_case) {
            return
          }
          for (const key of Object.keys(this.input(_case))) {
            srcs.push({
              ID: v.TestCaseID,
              Src: key,
              Type: ArgType.Input
            })
          }
          if (_case.Output) {
            for (const key of Object.keys(_case.Output)) {
              srcs.push({
                ID: v.TestCaseID,
                Src: key,
                Type: ArgType.Output
              })
            }
          }
        })
        return srcs
      }
    },
    cleanerArgSrcs (): (testCase: TestCase) => Array<ArgSrc> {
      return (testCase: TestCase) => {
        const srcs = this.argSrcs(testCase)
        for (const key of Object.keys(this.input(testCase))) {
          srcs.push({
            ID: testCase.ID,
            Src: key,
            Type: ArgType.Input
          })
        }
        if (testCase.Output) {
          for (const key of Object.keys(testCase.Output)) {
            srcs.push({
              ID: testCase.ID,
              Src: key,
              Type: ArgType.Output
            })
          }
        }
        return srcs
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
            v.Input = JSON.parse(v.Arguments) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Arguments, e)
          }
          try {
            v.Output = JSON.parse(v.Expectation) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Expectation, e)
          }
          try {
            v.Args = [...JSON.parse(v.ArgTypeDescription) as Array<Arg>]
          } catch (e) {
            console.log('Invalid arguments', v.ArgTypeDescription, e)
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
            v.Input = JSON.parse(v.Arguments) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Arguments, e)
          }
          try {
            v.Output = JSON.parse(v.Expectation) as Record<string, unknown>
          } catch (e) {
            console.log('Invalid arguments', v.Expectation, e)
          }
          try {
            v.Args = [...JSON.parse(v.ArgTypeDescription) as Array<Arg>]
          } catch (e) {
            console.log('Invalid arguments', v.ArgTypeDescription, e)
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
              v.Input = JSON.parse(v.Arguments) as Record<string, unknown>
            } catch (e) {
              console.log('Invalid arguments', v.Arguments, e)
            }
            try {
              v.Output = JSON.parse(v.Expectation) as Record<string, unknown>
            } catch (e) {
              console.log('Invalid arguments', v.Expectation, e)
            }
            try {
              v.Args = [...JSON.parse(v.ArgTypeDescription) as Array<Arg>]
            } catch (e) {
              console.log('Invalid arguments', v.ArgTypeDescription, e)
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
