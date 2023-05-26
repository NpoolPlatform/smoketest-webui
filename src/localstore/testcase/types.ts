import { BaseRequest } from 'npool-cli-v4'
import { Arg } from './base/arg'

export enum TestCaseType {
  Manual = 'Manual',
  Automatic = 'Automatic'
}

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
  InputDesc: string
  Expectation: string
  OutputDesc: string
  Depracated: boolean
  TestCaseType: TestCaseType
  // Local parsed
  Args: Array<Arg>
  Collapsed: boolean
  AddingArg: boolean
  AddingPreCond: boolean
  AddingCleaner: boolean
  InputVal: Record<string, unknown>
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
  ModuleName: string
  ApiID: string
  Input?: string
  InputDesc?: string
  Expectation?: string
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
