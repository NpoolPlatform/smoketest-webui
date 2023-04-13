import { BaseRequest } from 'npool-cli-v4'

export enum ArgType {
  Input = 'Input',
  Output = 'Output'
}

export interface ArgSrc {
  ID: string
  Type: ArgType
  Src: string
}

export interface ArgMap extends ArgSrc {
  Dst: string
}

export interface Arg {
  Name: string
  Type: string
  Editing: boolean
  From?: ArgSrc
  Value: string | number | null | undefined
}

export enum CondType {
  PreCondition = 'PreCondition',
  Cleaner = 'Cleaner'
}

export enum ArgDef {
  Number = 'Number',
  String = 'String',
  Object = 'Object',
  Decimal = 'Decimal'
}

export const ArgDefs = [
  ArgDef.Number,
  ArgDef.String,
  ArgDef.Object,
  ArgDef.Decimal
]

export interface Cond {
  ID: string
  Index: number
  CondType: CondType
  TestCaseID: string
  RelatedTestCaseID: string
  Args: Array<Arg>
}

export enum TestCaseType {
  Manual = 'Manual',
  Automatic = 'Automatic'
}

export interface RelatedTestCase {
  ID: string
  CondType: CondType
  TestCaseID: string
  RelatedTestCaseID: string
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
  Arguments: string
  ArgTypeDescription: string
  Args: Array<Arg>
  PreConds: Array<Cond>
  Cleaners: Array<Cond>
  Collapsed: boolean
  AddingArg: boolean
  AddingPreCond: boolean
  AddingCleaner: boolean
  Input: Record<string, unknown>
  Output: Record<string, unknown>
  Result: Record<string, unknown>
  Expectation: string
  Depracated: boolean
  TestCaseType: TestCaseType
  RelatedTestCases: Array<Cond>
  Error: Error
  CreatedAt: number
  UpdatedAt: number
}

export interface CreateTestCaseRequest extends BaseRequest {
  Name: string
  Description: string
  ModuleName: string
  ApiID: string
  Arguments: string
  Expectation: string
  ArgTypeDescription?: string
}

export interface CreateTestCaseResponse {
  Info: TestCase
}

export interface UpdateTestCaseRequest extends BaseRequest {
  ID: string
  Name?: string
  Description?: string
  Expectation?: string
  Arguments?: string
  TestCaseType?: TestCaseType
  Deprecated?: boolean
  ArgTypeDescription?: string
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

export interface TestCaseState {
  TestCases: Array<TestCase>
}
