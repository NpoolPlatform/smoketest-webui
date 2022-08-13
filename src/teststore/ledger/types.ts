import { BaseRequest } from 'npool-cli-v2'

export enum IOType {
  Incoming = 'Incoming',
  Outcoming = 'Outcoming'
}

export enum IOSubType {
  Payment = 'Payment',
  MiningBenefit = 'MiningBenefit',
  Commission = 'Commission',
  TechniqueFeeCommission = 'TechniqueFeeCommission',
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal'
}

export interface Withdraw {
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  Amount: string;
  CreatedAt: number;
  Address: string;
  AddressLabels: string;
  State: string;
  Message: string;
}

export interface GetAppWithdrawsRequest extends BaseRequest {
  Offset: number;
  Limit: number;
}

export interface GetAppWithdrawsResponse {
  Infos: Withdraw[];
  Total: number;
}
