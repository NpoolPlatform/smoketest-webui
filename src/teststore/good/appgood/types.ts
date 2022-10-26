import { BaseRequest } from 'npool-cli-v4'

export enum BenefitType {
  DefaultBenefitType = 'DefaultBenefitType',
  BenefitTypePlatform = 'BenefitTypePlatform',
  BenefitTypePool = 'BenefitTypePool',
}
export const BenefitTypes = [
  BenefitType.BenefitTypePlatform,
  BenefitType.BenefitTypePool
]

export enum GoodType {
  DefaultGoodType = 'DefaultGoodType',
  GoodTypeClassicMining = 'GoodTypeClassicMining',
  GoodTypeUnionMining = 'GoodTypeUnionMining',
  GoodTypeTechniqueFee = 'GoodTypeTechniqueFee',
  GoodTypeElectricityFee = 'GoodTypeElectricityFee',
}
export const GoodTypes = [
  GoodType.GoodTypeClassicMining,
  GoodType.GoodTypeUnionMining,
  GoodType.GoodTypeTechniqueFee,
  GoodType.GoodTypeElectricityFee
]
export interface GoodCoinInfo {
  CoinTypeID: string;
  CoinLogo: string;
  CoinName: string;
  CoinUnit: string;
  CoinPreSale: boolean;
}
export interface Good {
  ID: string;
  DeviceInfoID: string;
  DeviceType: string;
  DeviceManufacturer: string;
  DevicePowerComsuption: number;
  DeviceShipmentAt: number;
  DevicePosters: string[];
  DurationDays: number;
  CoinTypeID: string;
  CoinLogo: string;
  CoinName: string;
  CoinUnit: string;
  CoinPreSale: boolean;
  InheritFromGoodID: string;
  InheritFromGoodName: string;
  InheritFromGoodType: GoodType;
  InheritFromGoodBenefitType: BenefitType;
  VendorLocationID: string;
  VendorLocationCountry: string;
  VendorLocationProvince: string;
  VendorLocationCity: string;
  VendorLocationAddress: string;
  GoodType: GoodType;
  BenefitType: BenefitType;
  Price: string;
  Title: string;
  Unit: string;
  UnitAmount: number;
  TestOnly: boolean;
  Posters: string[];
  Labels: string[];
  VoteCount: number;
  Rating: number;
  SupportCoins: GoodCoinInfo[];
  SupportCoinTypeIDs: string[];
  GoodStockID: string;
  Total: number;
  Locked: number;
  InService: number;
  Sold: number;
  DeliveryAt: number;
  StartAt: number;
  CreatedAt: number;
  UpdatedAt: number;
  DeletedAt: number;
}

export interface AppGood {
  ID: string;
  AppID: string;
  GoodID: string;
  Online: boolean;
  Visible: boolean;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
  PromotionStartAt: number;
  PromotionEndAt: number;
  PromotionMessage: string;
  PromotionPrice: string;
  PromotionPosters: string[];
  RecommenderID: string;
  RecommenderEmailAddress: string;
  RecommenderPhoneNO: string;
  RecommenderUsername: string;
  RecommenderFirstName: string;
  RecommenderLastName: string;
  RecommendMessage: string;
  RecommendIndex: number;
  RecommendAt: number;
  DeviceType: string;
  DeviceManufacturer: string;
  DevicePowerComsuption: number;
  DeviceShipmentAt: number;
  DevicePosters: string[];
  DurationDays: number;
  VendorLocationCountry: string;
  CoinTypeID: string;
  CoinLogo: string;
  CoinName: string;
  CoinUnit: string;
  CoinPreSale: boolean;
  GoodType: GoodType;
  BenefitType: BenefitType;
  GoodName: string;
  Unit: string;
  UnitAmount: number;
  TestOnly: boolean;
  Posters: string[];
  Labels: string[];
  VoteCount: number;
  Rating: number;
  SupportCoins: GoodCoinInfo[];
  GoodTotal: number;
  Locked: number;
  InService: number;
  Sold: number;
  SubGoods: Good[];
  Must: boolean;
  Commission: boolean;
  StartAt: number;
  CreatedAt: number;
}

export interface GetAppGoodsRequest extends BaseRequest {
  Offset: number;
  Limit: number;
}

export interface GetAppGoodsResponse {
  Infos: AppGood[];
  Total: number;
}

export interface UpdateAppGoodRequest extends BaseRequest {
  ID: string;
  Online: boolean;
  Visible: boolean;
  GoodName: string;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
}

export interface UpdateAppGoodResponse {
  Info: AppGood;
}
