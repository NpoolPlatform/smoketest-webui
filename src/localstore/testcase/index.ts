import { defineStore } from 'pinia'
import { ArgSrc, ArgType, TestCase, TestCaseState } from './types'

export const useTestCaseStore = defineStore('local-testcase', {
  state: (): TestCaseState => ({
    TestCases: [] as Array<TestCase>
  }),
  getters: {
    args (): (testCase: TestCase) => Record<string, unknown> {
      return (testCase: TestCase) => {
        const arg = {} as Record<string, unknown>
        testCase.Args.forEach((v) => {
          arg[v.Name] = v.Type
        })
        return arg
      }
    },
    input (): (testCase: TestCase) => Record<string, unknown> {
      return (testCase: TestCase) => {
        const input = {} as Record<string, unknown>
        testCase.Args.forEach((v) => {
          switch (v.Type) {
            case 'String':
              input[v.Name] = ''
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
        const srcs = [] as ArgSrc[]
        testCase.PreConds.forEach((v) => {
          const _case = this.TestCases.find((el) => el.ID === v.ID)
          if (!_case) {
            return
          }
          for (const key of Object.keys(this.input(_case))) {
            srcs.push({
              ID: v.ID,
              Src: key,
              Type: ArgType.Input
            })
          }
          if (_case.Output) {
            for (const key of Object.keys(_case.Output)) {
              srcs.push({
                ID: v.ID,
                Src: key,
                Type: ArgType.Output
              })
            }
          }
        })
        return srcs
      }
    }
  },
  actions: {}
})

export * from './types'
