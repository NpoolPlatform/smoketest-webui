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

/** @default "DefaultUsedFor" */
export enum UsedFor {
  DefaultUsedFor = 'DefaultUsedFor',
  Signup = 'Signup',
  Signin = 'Signin',
  Update = 'Update',
  Contact = 'Contact',
  SetWithdrawAddress = 'SetWithdrawAddress',
  Withdraw = 'Withdraw',
  CreateInvitationCode = 'CreateInvitationCode',
  SetCommission = 'SetCommission',
  SetTransferTargetUser = 'SetTransferTargetUser',
  Transfer = 'Transfer',
  WithdrawalRequest = 'WithdrawalRequest',
  WithdrawalCompleted = 'WithdrawalCompleted',
  DepositReceived = 'DepositReceived',
  KYCApproved = 'KYCApproved',
  KYCRejected = 'KYCRejected',
  Purchase = 'Purchase',
  AffiliatePurchase = 'AffiliatePurchase',
  Announcement = 'Announcement',
}

export const UsedFors = [
  UsedFor.Contact,
  UsedFor.SetWithdrawAddress,
  UsedFor.Signin,
  UsedFor.Signup,
  UsedFor.Update,
  UsedFor.Withdraw,
  UsedFor.CreateInvitationCode,
  UsedFor.SetCommission,
  UsedFor.SetTransferTargetUser,
  UsedFor.Transfer,
  UsedFor.WithdrawalRequest,
  UsedFor.WithdrawalCompleted,
  UsedFor.DepositReceived,
  UsedFor.KYCApproved,
  UsedFor.KYCRejected,
  UsedFor.Announcement,
  UsedFor.Purchase,
  UsedFor.AffiliatePurchase
]

export interface MyCoupon {
  ID: string;
  CouponType: CouponType;
  Value?: string;
  Name?: string;
}

export interface EventInspire {
  ID: string;
  AppID: string;
  AppName: string;
  EventType: UsedFor;
  Coupons: MyCoupon[];
  Credits: string;
  CreditsPerUSD: string;
  /** @format int64 */
  MaxConsecutive: number;
  GoodID: string;
  GoodName: string;
  /** @format int64 */
  InviterLayers: number;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
  /** @format int64 */
  DeletedAt: number;
}

export interface CreateEventInspireRequest extends BaseRequest {
  AppID?: string;
  EventType: UsedFor;
  Coupons: MyCoupon[];
  Credits: string;
  CreditsPerUSD: string;
  /** @format int64 */
  MaxConsecutive: number;
  GoodID: string;
  /** @format int64 */
  InviterLayers: number;
}

export interface CreateEventInspireResponse {
  Info: EventInspire;
}

export interface GetEventInspiresRequest extends BaseRequest {
  AppID?: string;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetEventInspiresResponse {
  Infos: EventInspire[];
  /** @format int64 */
  Total: number;
}

export interface UpdateEventInspireRequest extends BaseRequest {
  ID: string;
  AppID: string;
  Coupons: MyCoupon[];
  Credits: string;
  CreditsPerUSD: string;
  /** @format int64 */
  MaxConsecutive: number;
  /** @format int64 */
  InviterLayers: number;
}

export interface UpdateEventInspireResponse {
  Info: EventInspire;
}
