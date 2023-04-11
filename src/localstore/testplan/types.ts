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
  ID: string
  CaseID: string
  Executed: boolean
  Result: TestResult
}

export interface TestPlanState {
  TestPlans: Array<TestPlan>
  TestCases: Map<string, Array<TestCaseInstance>>
}
