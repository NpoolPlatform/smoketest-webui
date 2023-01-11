import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppCouponsRequest,
  GetAppCouponsResponse,
  CreateCouponRequest,
  CreateCouponResponse,
  Coupon,
  GetCouponsRequest,
  GetCouponsResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchAllocatedCouponStore = defineStore('church-allocatedcoupon-v4', {
  state: () => ({
    AllocatedCoupons: {
      AllocatedCoupons: [] as Array<Coupon>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppCoupons (req: GetAppCouponsRequest, done: (error: boolean, rows: Array<Coupon>) => void) {
      doActionWithError<GetAppCouponsRequest, GetAppCouponsResponse>(
        API.GET_APP_ALLOCATEDCOUPONS,
        req,
        req.Message,
        (resp: GetAppCouponsResponse): void => {
          this.AllocatedCoupons.AllocatedCoupons.push(...resp.Infos)
          this.AllocatedCoupons.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Coupon>)
        }
      )
    },
    getCoupons (req: GetCouponsRequest, done: (error: boolean, rows: Array<Coupon>) => void) {
      doActionWithError<GetCouponsRequest, GetCouponsResponse>(
        API.GET_APP_ALLOCATEDCOUPONS,
        req,
        req.Message,
        (resp: GetCouponsResponse): void => {
          this.AllocatedCoupons.AllocatedCoupons.push(...resp.Infos)
          this.AllocatedCoupons.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Coupon>)
        }
      )
    },
    createCoupon (req: CreateCouponRequest, done: (error: boolean, row: Coupon) => void) {
      doActionWithError<CreateCouponRequest, CreateCouponResponse>(
        API.CREATE_ALLOCATEDCOUPON,
        req,
        req.Message,
        (resp: CreateCouponResponse): void => {
          this.AllocatedCoupons.AllocatedCoupons.push(resp.Info)
          this.AllocatedCoupons.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Coupon)
        }
      )
    }
  }
})
