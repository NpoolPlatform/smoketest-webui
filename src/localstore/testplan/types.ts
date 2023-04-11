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

export interface TestPlanState {
  TestPlans: Array<TestPlan>
  TestCases: Map<string, Array<TestCaseInstance>>
}
