import { BaseRequest } from 'npool-cli-v4'

export enum TestPlanState {
  WaitStart = 'WaitStart',
  InProgress = 'InProgress',
  Finished = 'Finished',
  Overdue = 'Overdue'
}

export enum TestPlanResult {
  Passed = 'Passed',
  Failed = 'Failed'
}

export interface TestPlan {
  ID?: string
  Name: string
  State: TestPlanState
  CreatedBy: string
  Email: string
  Executor: string
  ExecutorEmail: string
  Fails: number
  Passes: number
  Skips: number
  RunDuration: number
  Result: TestPlanResult
  Deadline: number
}

export interface CreateTestPlanRequest extends BaseRequest {
  ID?: string
  Name: string
  CreatedBy: string
  Exectuor?: string
  Deadline?: number
}

export interface CreateTestPlanResponse {
  Info: TestPlan
}

export interface UpdateTestPlanRequest extends BaseRequest {
  ID: string
  Name?: string
  State?: TestPlanState
  Executor?: string
  Deadline?: number
  Fails?: number
  Passes?: number
  Skips?: number
  RunDuration?: number
  Result?: TestPlanResult
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
  Total: number
}

export interface DeleteTestPlanRequest extends BaseRequest {
  ID: string
}

export interface DeleteTestPlanResponse {
  Info: TestPlan
}
