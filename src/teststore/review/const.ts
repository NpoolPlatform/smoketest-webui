enum API {
  UPDATE_WITHDRAW_REVIEW = '/review/v2/update/review',
}
enum WithdrawReviewState {
  DefaultReviewState = 'DefaultReviewState',
  Approved = 'Approved',
  Wait = 'Wait',
  Rejected = 'Rejected'
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
  WithdrawReviewState
}
