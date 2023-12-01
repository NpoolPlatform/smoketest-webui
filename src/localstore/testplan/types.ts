import { BaseRequest } from 'src/npoolstore/request'

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
  ID?: number
  EntID?: string
  Name: string
  State: TestPlanState
  CreatedBy: string
  CreatorEmail: string
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
  EntID?: string
  Name: string
  CreatedBy: string
  Exectuor?: string
  Deadline?: number
}

export interface CreateTestPlanResponse {
  Info: TestPlan
}

export interface UpdateTestPlanRequest extends BaseRequest {
  ID: number
  EntID: string
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
  ID: number
  EntID: string
}

export interface DeleteTestPlanResponse {
  Info: TestPlan
}
