import { MyRequest, BaseRequest } from 'npool-cli-v4'

export interface Promotion {
  ID: string;
  AppID: string;
  GoodID: string;
  GoodName: string;
  Message: string;
  StartAt: number;
  EndAt: number;
  Price: string;
  Posters: string[];
  CreatedAt: number;
  UpdatedAt: number;
}

export interface CreatePromotionRequest extends MyRequest {
  AppID: string;
  GoodID: string;
  Message: string;
  StartAt: number;
  EndAt: number;
  Price: string;
  Posters: string[];
}

export interface CreatePromotionResponse {
  Info: Promotion;
}

export interface GetPromotionsRequest extends BaseRequest {
  Offset: number;
  Limit: number;
}

export interface GetPromotionsResponse {
  Infos: Promotion[];
  Total: number;
}

export interface UpdatePromotionRequest extends MyRequest {
  ID: string;
  AppID: string;
  Message: string;
  StartAt: number;
  EndAt: number;
  Price: string;
  Posters: string[];
}

export interface UpdatePromotionResponse {
  Info: Promotion;
}
