import { BaseRequest, MyRequest } from 'npool-cli-v4'

/** @default "DefaultCouponType" */
export enum CouponType {
  DefaultCouponType = 'DefaultCouponType',
  FixAmount = 'FixAmount',
  Discount = 'Discount',
  SpecialOffer = 'SpecialOffer',
  ThresholdFixAmount = 'ThresholdFixAmount',
  ThresholdDiscount = 'ThresholdDiscount',
  GoodFixAmount = 'GoodFixAmount',
  GoodDiscount = 'GoodDiscount',
  GoodThresholdFixAmount = 'GoodThresholdFixAmount',
  GoodThresholdDiscount = 'GoodThresholdDiscount',
}

export interface Coupon {
  ID: string;
  CouponType: CouponType;
  AppID: string;
  Value: string;
  Circulation: string;
  ReleasedByUserID: string;
  /** @format int64 */
  StartAt: number;
  /** @format int64 */
  DurationDays: number;
  Message: string;
  Name: string;
  UserID: string;
  GoodID: string;
  Threshold: string;
  Allocated: string;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateCouponPoolRequest extends MyRequest {
  AppID: string
  UserID: string
  TargetAppID: string
  CouponType: string
  Value: string
  Circulation: string
  StartAt: number
  DurationDays: number
  Message: string
  Name: string
  TargetUserID: string
  GoodID: string
  Threshold?: string
}

export interface CreateCouponPoolResponse {
  Info: Coupon;
}

export interface GetCouponPoolsRequest extends BaseRequest{
  CouponType: CouponType;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetCouponPoolsResponse {
  Infos: Coupon[];
  /** @format int64 */
  Total: number;
}

export interface UpdateCouponPoolRequest extends MyRequest {
  ID: string;
  TargetAppID: string;
  CouponType: CouponType;
  Value: string;
  Circulation: string;
  /** @format int64 */
  StartAt: number;
  /** @format int64 */
  DurationDays: number;
  Message: string;
  Name: string;
  TargetUserID: string;
  GoodID: string;
  Threshold: string;
}

export interface UpdateCouponPoolResponse {
  Info: Coupon;
}

export interface GetAppCouponPoolsRequest extends BaseRequest {
  TargetAppID: string;
  CouponType: CouponType;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetAppCouponPoolsResponse {
  Infos: Coupon[];
  /** @format int64 */
  Total: number;
}
