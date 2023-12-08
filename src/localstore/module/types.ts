import { BaseRequest } from 'src/npoolstore/request'

export interface Module {
  ID: number
  EntID: string
  Name: string
  Description: string
  CreatedAt: number
}

export interface CreateModuleRequest extends BaseRequest {
  Name: string
  Description: string
}

export interface CreateModuleResponse {
  Info: Module
}

export interface DeleteModuleRequest extends BaseRequest {
  ID: number
  EntID: string
}

export interface DeleteModuleResponse {
  Info: Module
}

export interface UpdateModuleRequest extends BaseRequest {
  ID: number
  EntID: string
  Name?: string
  Description?: string
}

export interface UpdateModuleResponse {
  Info: Module
}

export interface GetModulesRequest extends BaseRequest {
  Offset: number
  Limit: number
}

export interface GetModulesResponse {
  Infos: Array<Module>
  Total: number
}
