export enum ArgType {
  Input = 'Input',
  Output = 'Output'
}

export interface ArgSrc {
  TestCaseID: string
  Type: ArgType
  Src: string
}

export interface ArgMap extends ArgSrc {
  Dst: string
}

export interface Arg {
  ID: string
  Name: string
  Type: string
  Editing: boolean
  From?: ArgSrc
  Value: string | number | null | undefined
  ParentID?: string
  Random: boolean
}

export enum ArgDef {
  Number = 'Number',
  String = 'String',
  Object = 'Object',
  Decimal = 'Decimal',
  Array = 'Array',
  Boolean = 'Boolean'
}

export const ArgDefs = Object.values(ArgDef)

export enum TestCaseType {
  Manual = 'Manual',
  Automatic = 'Automatic'
}

export const TestCaseTypes = Object.values(TestCaseType)

export enum TestCaseClass {
  Functionality = 'Functionality',
  Interface = 'Interface'
}

export const TestCaseClasses = Object.values(TestCaseClass)
