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
  PreConditions: Array<string>
  Cleaners: Array<string>
}
