import { MyRequest, BaseRequest } from 'npool-cli-v4'

export interface Recommend {
  ID: string;
  AppID: string;
  GoodID: string;
  GoodName: string;
  RecommenderID: string;
  RecommenderUsername: string;
  RecommenderFirstName: string;
  RecommenderLastName: string;
  RecommenderEmailAddress: string;
  RecommenderPhoneNo: string;
  Message: string;
  RecommendIndex: number;
  CreatedAt: number;
  UpdatedAt: number;
}

export interface GetRecommendsRequest extends BaseRequest {
  Offset: number;
  Limit: number;
}

export interface GetRecommendsResponse {
  Infos: Recommend[];
  Total: number;
}

export interface CreateRecommendRequest extends MyRequest{
  AppID: string;
  GoodID: string;
  RecommenderID: string;
  Message: string;
  RecommendIndex: number;
}

export interface CreateRecommendResponse {
  Info: Recommend;
}

export interface UpdateRecommendRequest extends MyRequest{
  ID: string;
  AppID: string;
  Message: string;
  RecommendIndex: number;
}

export interface UpdateRecommendResponse {
  Info: Recommend;
}
