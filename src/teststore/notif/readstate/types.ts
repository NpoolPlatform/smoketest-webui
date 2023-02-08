import { BaseRequest } from 'npool-cli-v4'

export interface ReadState {
  AnnouncementID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  Title: string;
  Content: string;
  /** @format int64 */
  CreatedAt: number;
}

export interface CreateReadStateRequest extends BaseRequest {
  AppID: string;
  UserID: string;
  AnnouncementID: string;
}

export interface CreateReadStateResponse {
  Info: ReadState;
}

export interface GetAppReadStatesRequest extends BaseRequest {
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppReadStatesResponse {
  Infos: ReadState[];
  /** @format int64 */
  Total: number;
}

export interface GetAppUserReadStatesRequest extends BaseRequest {
  TargetAppID: string;
  TargetUserID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppUserReadStatesResponse {
  Infos: ReadState[];
  /** @format int64 */
  Total: number;
}

export interface GetNAppReadStatesRequest extends BaseRequest {
  TargetAppID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetNAppReadStatesResponse {
  Infos: ReadState[];
  /** @format int64 */
  Total: number;
}

export interface GetReadStateRequest extends BaseRequest {
  AppID: string;
  UserID: string;
  AnnouncementID: string;
}

export interface GetReadStateResponse {
  Info: ReadState;
}

export interface GetReadStatesRequest extends BaseRequest {
  AppID: string;
  UserID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetReadStatesResponse {
  Infos: ReadState[];
  /** @format int64 */
  Total: number;
}
