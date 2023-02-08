import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultChannel" */
export enum NotifChannel {
  DefaultChannel = 'DefaultChannel',
  ChannelEmail = 'ChannelEmail',
  ChannelSMS = 'ChannelSMS',
}

export interface SendState {
  AnnouncementID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  Title: string;
  Content: string;
  Channel: NotifChannel;
  /** @format int64 */
  CreatedAt: number;
}

export interface GetAppSendStatesRequest extends BaseRequest {
  AppID: string;
  Channel: NotifChannel;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppSendStatesResponse {
  Infos: SendState[];
  /** @format int64 */
  Total: number;
}

export interface GetAppUserSendStatesRequest extends BaseRequest {
  TargetAppID: string;
  TargetUserID: string;
  Channel: NotifChannel;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppUserSendStatesResponse {
  Infos: SendState[];
  /** @format int64 */
  Total: number;
}

export interface GetNAppSendStatesRequest extends BaseRequest {
  TargetAppID: string;
  Channel: NotifChannel;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetNAppSendStatesResponse {
  Infos: SendState[];
  /** @format int64 */
  Total: number;
}

export interface GetSendStatesRequest extends BaseRequest {
  AppID: string;
  UserID: string;
  Channel: NotifChannel;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetSendStatesResponse {
  Infos: SendState[];
  /** @format int64 */
  Total: number;
}
