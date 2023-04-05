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
  ID: string
  Domain: string
  PathPrefix: string
  Path: string
  Name: string
  Args: Array<Arg>
  PreConds: Array<Cond>
  Cleaners: Array<Cond>
}
