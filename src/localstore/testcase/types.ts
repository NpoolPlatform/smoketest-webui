import { BaseRequest } from 'npool-cli-v4'
import { Arg, TestCaseClass, TestCaseType } from './base/arg'

export interface TestCase {
  ID: string
  Name: string
  Description: string
  ModuleID: string
  ModuleName: string
  ApiID: string
  ApiPath: string
  ApiPathPrefix: string
  ApiServiceName: string
  ApiProtocol: string
  ApiMethod: string
  ApiDeprecated: boolean
  Input: string
  InputVal: Record<string, unknown>
  InputDesc: string
  Expectation: string
  OutputDesc: string
  Deprecated: boolean
  TestCaseType: TestCaseType
  TestCaseClass: TestCaseClass
  // Local parsed
  Args: Array<Arg>
  Collapsed: boolean
  AddingArg: boolean
  AddingPreCond: boolean
  AddingCleaner: boolean
  OutputVal: Record<string, unknown>
  OutputArgs: Record<string, unknown>
  Result: Record<string, unknown>
  Error?: Error
  CreatedAt: number
  UpdatedAt: number
}

export interface CreateTestCaseRequest extends BaseRequest {
  ID?: string
  Name: string
  Description: string
  ModuleID: string
  ApiID: string
  Input?: string
  InputDesc?: string
  Expectation?: string
  TestCaseType: TestCaseType
  TestCaseClass: TestCaseClass
}

export interface CreateTestCaseResponse {
  Info: TestCase
}

export interface UpdateTestCaseRequest extends BaseRequest {
  ID: string
  Name?: string
  Description?: string
  Expectation?: string
  Input?: string
  InputDesc?: string
  TestCaseType?: TestCaseType
  TestCaseClass?: TestCaseClass
  Deprecated?: boolean
}

export interface UpdateTestCaseResponse {
  Info: TestCase
}

export interface GetTestCasesRequest extends BaseRequest {
  ModuleID?: string
  Offset: number
  Limit: number
}

export interface GetTestCasesResponse {
  Infos: Array<TestCase>
}

export interface DeleteTestCaseRequest extends BaseRequest {
  ID: string
}

export interface DeleteTestCaseResponse {
  Info: TestCase
}
