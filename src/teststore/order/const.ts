enum API {
  GET_APP_ORDERS = '/order/v1/get/app/orders',
  CREATE_USER_ORDER = '/order/v1/create/user/order',
  UPDATE_ORDER = '/order/v1/update/order',
  GET_ORDER = '/order/v1/get/order',
}

const OrderTimeoutSeconds = 6 * 60 * 60
enum OrderType {
  DefaultOrderType = 'DefaultOrderType',
  Normal = 'Normal',
  Offline = 'Offline',
  Airdrop = 'Airdrop',
}

const OrderTypes = [
  'ALL',
  OrderType.Normal,
  OrderType.Offline,
  OrderType.Airdrop
]

enum OrderState {
  DEFAULT_STATE = 'DefaultState',
  WAIT_PAYMENT = 'WaitPayment',
  PAID = 'Paid',
  PAYMENT_TIMEOUT = 'PaymentTimeout',
  USER_CANCELED = 'UserCanceled',
  CANCELED = 'Canceled',
  IN_SERVICE = 'InService',
  EXPIRED = 'Expired',
}
export { API, OrderTimeoutSeconds, OrderState, OrderType, OrderTypes }
