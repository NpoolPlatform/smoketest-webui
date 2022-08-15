enum API {
  UPDATE_WITHDRAW_REVIEW = '/review/v2/update/withdrawreview',
  GET_WITHDRAW_REVIEWS = '/review/v2/get/withdrawreviews',
}
enum WithdrawState {
  DefaultWithdrawReviewState = 'DefaultWithdrawReviewState',
  Reviewing = 'Reviewing',
  Transferring = 'Transferring',
  Rejected = 'Rejected',
  TransactionFail = 'TransactionFail',
  Successful = 'Successful',
}
enum KycState {
  DefaultReviewState = 'DefaultReviewState',
  Approved = 'Approved',
  Wait = 'Wait',
  Rejected ='Rejected'
}
enum ReviewState {
  DefaultReviewState = 'DefaultReviewState',
  Approved = 'Approved',
  Wait = 'Wait',
  Rejected ='Rejected'
}
enum WithdrawTrigger {
  DefaultTriggerType = 'DefaultTriggerType',
  AutoReviewed = 'AutoReviewed',
  LargeAmount = 'LargeAmount',
  InsufficientFunds = 'InsufficientFunds',
  InsufficientGas = 'InsufficientGas'
}
export {
  API,
  WithdrawTrigger,
  WithdrawState,
  KycState,
  ReviewState
}
