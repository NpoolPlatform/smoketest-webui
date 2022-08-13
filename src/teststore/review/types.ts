import { ReqMessage } from 'npool-cli-v2'
import { WithdrawReviewState, WithdrawTrigger } from './const'

interface Review {
  EmailAddress: string;
  PhoneNO: string;
  Reviewer: string;
  ObjectType: string;
  ObjectID: string;
  Domain: string;
  CreatedAt: number;
  UpdatedAt: number;
  Message: string;
  State: WithdrawReviewState;
  Trigger: WithdrawTrigger;
  ObjectInfo: string;
}

interface UpdateReviewResponse {
  Info: Review
}

interface BaseRequest {
  NotificationMessage: ReqMessage;
}
interface UpdateReviewRequest extends BaseRequest{
  ID: string;
  UserID: string;
  State: string;
  Message: string;
}

export {
  Review,
  UpdateReviewRequest,
  UpdateReviewResponse,
  BaseRequest
}
