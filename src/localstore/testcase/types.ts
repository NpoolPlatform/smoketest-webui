export interface Arg {
  Name: string
  Type: string
  Editing: boolean
}

export enum CondType {
  PreCondition = 'PreCondition',
  Cleaner = 'Cleaner'
}

export enum ArgType {
  Input = 'Input',
  Output = 'Output'
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

export interface ArgSrc {
  ID: string
  Type: ArgType
  Src: string
}

export interface ArgMap extends ArgSrc {
  Dst: string
}

export interface Cond {
  ID: string
  Index: number
  Type: CondType
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
  AddingArg: boolean
  AddingPreCond: boolean
  AddingCleaner: boolean
  Input: Record<string, unknown>
  Output: Record<string, unknown>
  Expectation: Record<string, unknown>
  ArgMap: Array<ArgMap>
}

export interface TestCaseState {
  TestCases: Array<TestCase>
}
