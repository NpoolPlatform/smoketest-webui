import { BaseRequest } from 'npool-cli-v4'

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
  UserID: string;
  Value: string;
  Circulation: string;
  /** @format int64 */
  StartAt: number;
  /** @format int64 */
  DurationDays: number;
  /** @format int64 */
  EndAt: number;
  CouponID: string;
  CouponName: string;
  Message: string;
  Expired: boolean;
  Valid: boolean;
  Used: boolean;
  /** @format int64 */
  UsedAt: number;
  UsedByOrderID: string;
  GoodID: string;
  Threshold: string;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateCouponRequest extends BaseRequest {
  TargetUserID: string;
  CouponType: CouponType;
  CouponID: string;
}

export interface CreateCouponResponse {
  Info: Coupon;
}

export interface GetCouponsRequest extends BaseRequest {
  AppID: string;
  UserID: string;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetCouponsResponse {
  Infos: Coupon[];
  /** @format int64 */
  Total: number;
}

export interface GetAppCouponsRequest extends BaseRequest {
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetAppCouponsResponse {
  Infos: Coupon[];
  /** @format int64 */
  Total: number;
}
