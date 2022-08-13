import { defineStore } from 'pinia'
import {
  doActionWithError,
  InvalidID,
  remain
} from 'npool-cli-v2'
import {
  Order,
  GetOrdersRequest,
  GetOrdersResponse,
  CreateUserOrderResponse,
  CreateUserOrderRequest
} from './types'
import { API, OrderTimeoutSeconds, OrderState } from './const'

export const useAdminLocalOrderStore = defineStore('adminlocalorder', {
  state: () => ({
    Orders: [] as Array<Order>,
    Total: 0
  }),
  getters: {
    getOrderByID () {
      return (id:string) => {
        return this.Orders.find((order) => order.ID === id)
      }
    },
    getOrderState () {
      return (order: Order) => {
        if (!order) {
          return 'MSG_ERROR'
        }

        if (order.PaymentID === InvalidID) {
          return 'MSG_INVALID_PAYMENT'
        }
        if (order.State === OrderState.PAYMENT_TIMEOUT) {
          return 'MSG_CANCELED_BY_TIMEOUT'
        }
        if (order.State === OrderState.WAIT_PAYMENT) {
          return remain(order.CreatedAt + OrderTimeoutSeconds)
        }
        if (order.State === OrderState.EXPIRED) {
          return 'MSG_DONE'
        }
        if (order.State === OrderState.CANCELED || order.State === OrderState.USER_CANCELED) {
          return 'MSG_PAYMENT_CANCELED'
        }
        if (order.State === OrderState.PAID) {
          return 'MSG_WAIT_FOR_START'
        }
        return 'MSG_IN_SERVICE'
      }
    },
    orderPaid (): (order: Order) => boolean {
      return (order: Order) => {
        return order.State === OrderState.PAID || order.State === OrderState.IN_SERVICE || order.State === OrderState.EXPIRED
      }
    },
    validateOrder () {
      return (order: Order) => {
        if (!order) {
          return false
        }
        if (order.PaymentID === InvalidID) {
          return false
        }
        if (order.State === OrderState.PAYMENT_TIMEOUT) {
          return false
        }
        if (order.State === OrderState.EXPIRED) {
          return false
        }
        if (order.State === OrderState.CANCELED) {
          return false
        }
        if (order.State === OrderState.USER_CANCELED) {
          return false
        }
        return true
      }
    }
  },
  actions: {
    getAppOrders (req: GetOrdersRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetOrdersRequest, GetOrdersResponse>(
        API.GET_APP_ORDERS,
        req,
        req.Message,
        (resp: GetOrdersResponse): void => {
          resp.Infos.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1).forEach((el) => {
            const index = this.Orders.findIndex((oel) => oel.ID === el.ID)
            this.Orders.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, el)
          })
          this.Total = resp.Total
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    },
    createUserOrder (req: CreateUserOrderRequest, handler: (orderID: string, error: boolean) => void) {
      doActionWithError<CreateUserOrderRequest, CreateUserOrderResponse>(
        API.CREATE_USER_ORDER,
        req,
        req.Message,
        (resp: CreateUserOrderResponse): void => {
          this.Orders.splice(0, 0, resp.Info)
          this.Total += 1
          handler(resp.Info.ID, false)
        },
        () => {
          handler('', true)
        }
      )
    }
  }
})

export * from './types'
export { OrderState } from './const'
