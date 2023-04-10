export interface Arg {
  Name: string
  Type: string
}

export enum CondType {
  PreCondition = 'PreCondition',
  Cleaner = 'Cleaner'
}

export enum ArgType {
  Input = 'Input',
  Output = 'Output'
}

export interface ArgMap {
  ID: string
  Type: ArgType
  Src: string
  Dest: string
}

export interface Cond {
  ID: string
  Index: number
  Type: CondType
  ArgMap: Array<ArgMap>
}

export interface TestCase {
  ID?: string
  ApiID: string
  Name: string
  Module: string
  Args: Array<Arg>
  PreConds: Array<Cond>
  Cleaners: Array<Cond>
  Collapsed: boolean
}

export interface TestCaseState {
  TestCases: Array<TestCase>
}
