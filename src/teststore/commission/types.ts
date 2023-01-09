import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultSettleInterval" */
export enum SettleInterval {
  DefaultSettleInterval = 'DefaultSettleInterval',
  SettleAggregate = 'SettleAggregate',
  SettleMonthly = 'SettleMonthly',
  SettleYearly = 'SettleYearly',
  SettleEveryOrder = 'SettleEveryOrder',
}

/** @default "DefaultSettleMode" */
export enum SettleMode {
  DefaultSettleMode = 'DefaultSettleMode',
  SettleWithGoodValue = 'SettleWithGoodValue',
  SettleWithPaymentAmount = 'SettleWithPaymentAmount',
}

/** @default "DefaultSettleType" */
export enum SettleType {
  DefaultSettleType = 'DefaultSettleType',
  GoodOrderPercent = 'GoodOrderPercent',
  LimitedOrderPercent = 'LimitedOrderPercent',
  AmountThreshold = 'AmountThreshold',
  NoCommission = 'NoCommission',
}

export interface Commission {
  ID: string;
  UserID: string;
  Username: string;
  EmailAddress: string;
  PhoneNO: string;
  FirstName: string;
  LastName: string;
  Kol: boolean;
  SettleType: SettleType;
  SettleMode: SettleMode;
  SettleInterval: SettleInterval;
  GoodID: string;
  GoodName: string;
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  Percent: string;
  Amount: string;
  Threshold: string;
  /** @format int64 */
  StartAt: number;
  /** @format int64 */
  EndAt: number;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface GetCommissionsRequest extends BaseRequest {
  SettleType: SettleType;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetCommissionsResponse {
  Infos: Commission[];
  /** @format int64 */
  Total: number;
}

export interface UpdateCommissionRequest extends BaseRequest {
  ID: string;
  Value: string;
  /** @format int64 */
  StartAt: number;
}

export interface UpdateCommissionResponse {
  Info: Commission;
}

export interface GetAppCommissionsRequest extends BaseRequest {
  /** @format int64 */
  EndAt?: number;
  SettleType: SettleType;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetAppCommissionsResponse {
  Infos: Commission[];
  /** @format int64 */
  Total: number;
}
