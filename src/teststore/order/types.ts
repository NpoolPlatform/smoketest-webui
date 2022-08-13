import { BaseRequest } from 'npool-cli-v2'
import { OrderState, OrderType } from './const'

interface Order {
  ID: string;
  ParentOrderID: string;
  ParentOrderGoodID: string;
  ParentOrderGoodName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  GoodID: string;
  GoodName: string;
  GoodUnit: string;
  GoodServicePeriodDays: number;
  GoodUnitPrice: string;
  GoodValue: string;
  Units: number;
  PaymentID: string;
  PaymentCoinTypeID: string;
  PaymentCoinName: string;
  PaymentCoinLogo: string;
  PaymentCoinUnit: string;
  PaymentCoinUSDCurrency: string;
  PaymentLiveUSDCurrency: string;
  PaymentLocalUSDCurrency: string;
  PaymentAddress: string;
  PaymentAmount: string;
  PayWithBalanceAmount: string;
  PayWithParent: boolean;
  FixAmountID: string;
  FixAmountName: string;
  FixAmountAmount: string;
  DiscountID: string;
  DiscountName: string;
  DiscountPercent: number;
  SpecialOfferID: string;
  SpecialOfferAmount: string;
  CreatedAt: number;
  PaidAt: number;
  State: OrderState;
  OrderType: string;
  Start: number;
  End: number;
}

interface GetOrdersRequest extends BaseRequest {
  Offset?: number;
  Limit?: number;
}

interface GetOrdersResponse {
  Infos: Array<Order>;
  Total: number;
}

interface CreateUserOrderRequest extends BaseRequest {
  TargetUserID: string;
  GoodID: string;
  Units: number;
  PaymentCoinID?: string;
  ParentOrderID?: string;
  PayWithBalanceAmount?: string;
  FixAmountID?: string;
  DiscountID?: string;
  SpecialOfferID?: string;
  OrderType?: OrderType;
}

interface CreateUserOrderResponse {
  Info: Order;
}

interface GetOrderResponse {
  Info: Order;
}

export {
  Order,
  GetOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  CreateUserOrderRequest,
  CreateUserOrderResponse
}
