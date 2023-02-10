import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultAnnouncementType" */
export enum AnnouncementType {
  DefaultAnnouncementType = 'DefaultAnnouncementType',
  AllUsers = 'AllUsers',
  AppointUsers = 'AppointUsers',
}

export const AnnouncementTypes = [
  AnnouncementType.AllUsers,
  AnnouncementType.AppointUsers
]

export interface AnnouncementUser {
  ID: string;
  AnnouncementID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  Title: string;
  Content: string;
  AnnouncementType: AnnouncementType;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateAnnouncementUsersRequest extends BaseRequest {
  AppID?: string;
  UserIDs: string[];
  AnnouncementID: string;
}

export interface CreateAnnouncementUsersResponse {
  Infos: Array<AnnouncementUser>
}

export interface DeleteAnnouncementUserRequest extends BaseRequest {
  ID: string;
}

export interface DeleteAnnouncementUserResponse {
  Info: AnnouncementUser
}

export interface GetAnnouncementUsersRequest extends BaseRequest {
  AppID?: string;
  AnnouncementID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAnnouncementUsersResponse {
  Infos: AnnouncementUser[];
  /** @format int64 */
  Total: number;
}

export interface GetAppAnnouncementUsersRequest extends BaseRequest {
  AppID?: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppAnnouncementUsersResponse {
  Infos: AnnouncementUser[];
  /** @format int64 */
  Total: number;
}
