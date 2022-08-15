import { ReqMessage } from 'npool-cli-v2'
import { ReviewState, WithdrawTrigger } from './const'

interface WithdrawReview {
  WithdrawID: string;
  WithdrawState: string;
  ReviewID: string;
  UserID: string;
  KycState: string;
  EmailAddress: string;
  PhoneNO: string;
  Reviewer: string;
  ObjectType: string;
  Domain: string;
  CreatedAt: number;
  UpdatedAt: number;
  Message: string;
  State: ReviewState;
  Trigger: WithdrawTrigger;
  Amount: string;
  FeeAmount: string;
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  Address: string;
  PlatformTransactionID: string;
  ChainTransactionID: string;
}

interface UpdateReviewResponse {
  Info: WithdrawReview
}

interface BaseRequest {
  NotificationMessage: ReqMessage;
}
interface UpdateReviewRequest extends BaseRequest{
  ReviewID: string;
  UserID: string;
  LangID: string;
  State: string;
  Message: string;
}

interface GetWithdrawReviewsRequest extends BaseRequest{
  offset: number;
  limit: number;
}
interface GetWithdrawReviewsResponse {
  Infos: Array<WithdrawReview>;
  Total: number;
}
export {
  WithdrawReview,
  UpdateReviewRequest,
  UpdateReviewResponse,
  BaseRequest,
  GetWithdrawReviewsRequest,
  GetWithdrawReviewsResponse
}
