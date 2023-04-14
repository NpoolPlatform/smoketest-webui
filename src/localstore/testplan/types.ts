import { BaseRequest } from 'npool-cli-v4'

export interface TestPlan {
  ID?: string
  Creator: string
  Applier: string
  Title: string
  Description: string
}

export enum TestResult {
  FAIL = 'FAIL',
  PASS = 'PASS',
  SKIP = 'SKIP'
}

export interface TestCaseInstance {
  Index: number
  ID: string
  CaseID: string
  Executed: boolean
  Result: TestResult
  PlanID: string
}

export interface CreateTestCaseInstanceRequest extends BaseRequest {
  CaseID: string
  PlanID: string
}

export interface CreateTestCaseInstanceResponse {
  Info: TestCaseInstance
}

export interface CreateTestPlanRequest extends BaseRequest {
  Name: string
  ResponsibleUserID: string
  Deadline?: number
}

export interface CreateTestPlanResponse {
  Info: TestPlan
}

export interface UpdateTestPlanRequest extends BaseRequest {
  ID: string
  Name?: string
  ResponsibleUserID?: string
  Deadline?: number
}

export interface UpdateTestPlanResponse {
  Info: TestPlan
}

export interface GetTestPlansRequest extends BaseRequest {
  Offset: number
  Limit: number
}

export interface GetTestPlansResponse {
  Infos: Array<TestPlan>
}

export interface DeleteTestPlanRequest extends BaseRequest {
  ID: string
}

export interface DeleteTestPlanResponse {
  Info: TestPlan
}

export interface TestPlanState {
  TestPlans: Array<TestPlan>
  TestCases: Map<string, Array<TestCaseInstance>>
}
