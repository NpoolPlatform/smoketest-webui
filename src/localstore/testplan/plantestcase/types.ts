import { TestCaseClass, TestCaseType } from 'src/localstore/testcase'
import { BaseRequest } from 'src/npoolstore/request'

export enum TestCaseResult {
  Skipped = 'Skipped',
  Passed = 'Passed',
  Failed = 'Failed'
}

export interface PlanTestCase {
  ID?: number
  EntID?: string
  TestPlanID: string
  TestCaseID: string
  TestCaseName: string
  TestCaseType: TestCaseType
  TestCaseClass: TestCaseClass
  Description: string
  RunDuration: number
  TestUserID: string
  TestUserEmail: string
  Result: TestCaseResult
  Index: number
  Input: string
  InputVal: Record<string, unknown>
  Output: string
  OutputVal: Record<string, unknown>
  ModuleID: string
  ModuleName: string
  ApiID: string
  ApiPath: string
  Collapsed: boolean
  Pass: boolean
}

export interface CreatePlanTestCaseRequest extends BaseRequest {
  EntID?: string
  TestPlanID: string
  TestCaseID: string
  Description?: string
  Index?: number
}

export interface CreatePlanTestCaseResponse {
  Info: PlanTestCase
}

export interface UpdatePlanTestCaseRequest extends BaseRequest {
  ID: number
  EntID: string
  Input?: string
  Output?: string
  Description?: string
  RunDuration?: number
  TestUserID?: string
  Index?: number
  Result?: TestCaseResult
}

export interface UpdatePlanTestCaseResponse {
  Info: PlanTestCase
}

export interface GetPlanTestCasesRequest extends BaseRequest {
  TestPlanID: string
  Offset: number
  Limit: number
}

export interface GetPlanTestCasesResponse {
  Infos: Array<PlanTestCase>
  Total: number
}

export interface DeletePlanTestCaseRequest extends BaseRequest {
  ID: number
  EntID: string
}

export interface DeletePlanTestCaseResponse {
  Info: PlanTestCase
}
