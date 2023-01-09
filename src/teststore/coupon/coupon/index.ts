import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppCouponPoolsRequest,
  GetAppCouponPoolsResponse,
  CreateCouponPoolRequest,
  CreateCouponPoolResponse,
  Coupon,
  GetCouponPoolsRequest,
  GetCouponPoolsResponse,
  UpdateCouponPoolRequest,
  UpdateCouponPoolResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchCouponStore = defineStore('church-coupon-v4', {
  state: () => ({
    CouponPools: {
      CouponPools: [] as Array<Coupon>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppCouponPools (req: GetAppCouponPoolsRequest, done: (error: boolean, rows: Array<Coupon>) => void) {
      doActionWithError<GetAppCouponPoolsRequest, GetAppCouponPoolsResponse>(
        API.GET_APP_COUPONPOOLS,
        req,
        req.Message,
        (resp: GetAppCouponPoolsResponse): void => {
          this.CouponPools.CouponPools.push(...resp.Infos)
          this.CouponPools.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Coupon>)
        }
      )
    },
    getCouponPools (req: GetCouponPoolsRequest, done: (error: boolean, rows: Array<Coupon>) => void) {
      doActionWithError<GetCouponPoolsRequest, GetCouponPoolsResponse>(
        API.GET_COUPONPOOLS,
        req,
        req.Message,
        (resp: GetCouponPoolsResponse): void => {
          this.CouponPools.CouponPools.push(...resp.Infos)
          this.CouponPools.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Coupon>)
        }
      )
    },
    createCouponPool (req: CreateCouponPoolRequest, done: (error: boolean, row: Coupon) => void) {
      doActionWithError<CreateCouponPoolRequest, CreateCouponPoolResponse>(
        API.CREATE_COUPONPOOL,
        req,
        req.NotifyMessage,
        (resp: CreateCouponPoolResponse): void => {
          this.CouponPools.CouponPools.push(resp.Info)
          this.CouponPools.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Coupon)
        }
      )
    },
    updateCouponPool (req: UpdateCouponPoolRequest, done: (error: boolean, row: Coupon) => void) {
      doActionWithError<UpdateCouponPoolRequest, UpdateCouponPoolResponse>(
        API.CREATE_COUPONPOOL,
        req,
        req.NotifyMessage,
        (resp: UpdateCouponPoolResponse): void => {
          const index = this.CouponPools.CouponPools.findIndex((el) => el.ID === resp.Info.ID)
          this.CouponPools.CouponPools.splice(index, 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Coupon)
        }
      )
    }
  }
})
