import { BaseRequest } from 'src/npoolstore/request'

/** @default "DefaultMethod" */
export enum Method {
  DefaultMethod = 'DefaultMethod',
  GET = 'GET',
  POST = 'POST',
  STREAM = 'STREAM',
}

/** @default "DefaultProtocol" */
export enum Protocol {
  DefaultProtocol = 'DefaultProtocol',
  GRPC = 'GRPC',
  HTTP = 'HTTP',
}

export interface API {
  ID: number
  EntID: string
  Protocol: Protocol
  ServiceName: string
  Method: Method
  MethodName: string
  Path: string
  Exported: boolean
  PathPrefix: string
  Domains: string[]
  Depracated: boolean
  /** @format int64 */
  CreatedAt: number
  /** @format int64 */
  UpdatedAt: number
}

export interface GetAPIsRequest extends BaseRequest {
  Domain?: string
  Exported?: boolean
  Depracated?: boolean
  /** @format int32 */
  Offset: number
  /** @format int32 */
  Limit: number
}

export interface GetAPIsResponse {
  Infos: API[]
  /** @format int64 */
  Total: number
}

export type GetDomainsRequest = BaseRequest

export interface GetDomainsResponse {
  Infos: string[]
}
