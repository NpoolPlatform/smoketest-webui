import { BaseRequest } from 'npool-cli-v4'

export interface Registration {
  ID: string;
  AppID: string;
  InviterID: string;
  InviterEmailAddress: string;
  InviterPhoneNO: string;
  InviterUsername: string;
  InviteeID: string;
  InviteeEmailAddress: string;
  InviteePhoneNO: string;
  InviteeUsername: string;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface GetRegistrationsRequest extends BaseRequest {
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetRegistrationsResponse {
  Infos: Registration[];
  /** @format int64 */
  Total: number;
}

export interface UpdateRegistrationRequest extends BaseRequest {
  ID: string;
  InviterID: string;
}

export interface UpdateRegistrationResponse {
  Info: Registration;
}
