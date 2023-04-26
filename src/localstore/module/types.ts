import { BaseRequest } from 'npool-cli-v4'

export interface Module {
  ID: string
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
  ID: string
}

export interface DeleteModuleResponse {
  Info: Module
}

export interface UpdateModuleRequest extends BaseRequest {
  ID: string
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
