import { BaseRequest } from 'npool-cli-v4'

export enum TestCaseResult {
  Skipped = 'Skipped',
  Passed = 'Passed',
  Failed = 'Failed'
}

export interface PlanTestCase {
  ID: string
  TestPlanID: string
  TestCaseID: string
  Description: string
  RunDuration: number
  TestUserID: string
  Result: TestCaseResult
  Index: number
  Output: string
  OutputVal: Record<string, unknown>
  Collapsed: boolean
  Pass: boolean
}

export interface CreatePlanTestCaseRequest extends BaseRequest {
  TestPlanID: string
  TestCaseID: string
  Description?: string
  Index?: number
}

export interface CreatePlanTestCaseResponse {
  Info: PlanTestCase
}

export interface UpdatePlanTestCaseRequest extends BaseRequest {
  ID: string
  TestCaseOutput?: string
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
  ID: string
}

export interface DeletePlanTestCaseResponse {
  Info: PlanTestCase
}
