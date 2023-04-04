export interface Arg {
  Name: string
  Type: string
}

export interface TestCase {
  ID: string
  Domain: string
  Path: string
  Name: string
  Args: Array<Arg>
  PreCondition: Array<string>
  Cleaner: Array<string>
}
