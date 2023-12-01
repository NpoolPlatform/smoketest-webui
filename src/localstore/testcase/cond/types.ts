import { BaseRequest } from 'src/npoolstore/request'
import { Arg } from '../base/arg'
import { CondType } from './def'

export interface TestCaseCond {
  ID: string
  CondType: CondType
  TestCaseID: string
  CondTestCaseID: string
  Index: number
  ArgumentMap: string
  Args: Array<Arg>
  Editing: boolean
  OldIndex: number
}

export interface CreateTestCaseCondRequest extends BaseRequest {
  ID?: string
  TestCaseID: string
  CondTestCaseID: string
  ArgumentMap: string
  Index: number
  CondType: CondType
}

export interface CreateTestCaseCondResponse {
  Info: TestCaseCond
}

export interface UpdateTestCaseCondRequest extends BaseRequest {
  ID: string
  ArgumentMap?: string
  CondType?: CondType
  Index?: number
}

export interface UpdateTestCaseCondResponse {
  Info: TestCaseCond
}

export interface GetTestCaseCondsRequest extends BaseRequest {
  Offset: number
  Limit: number
}

export interface GetTestCaseCondsResponse {
  Infos: Array<TestCaseCond>
  Total: number
}

export interface DeleteTestCaseCondRequest extends BaseRequest {
  ID: string
}

export interface DeleteTestCaseCondResponse {
  Info: TestCaseCond
}
