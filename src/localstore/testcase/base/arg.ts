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

export const ArgDefs = [
  ArgDef.Number,
  ArgDef.String,
  ArgDef.Object,
  ArgDef.Decimal,
  ArgDef.Array,
  ArgDef.Boolean
]
