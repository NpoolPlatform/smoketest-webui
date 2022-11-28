import { NotifyType, Order, useAdminOrderStore } from 'npool-cli-v4'

const order = useAdminOrderStore()

export const getAppOrders = (offset: number, limit: number) => {
  order.getAppOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (orders: Array<Order>, error: boolean) => {
    if (error || orders.length < limit) {
      return
    }
    getAppOrders(offset + limit, limit)
  })
}
