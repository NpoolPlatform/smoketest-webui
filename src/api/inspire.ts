import { NotifyType } from 'npool-cli-v4'
import { useAdminCouponStore } from 'src/teststore/coupon/coupon'
import { Coupon, CouponType } from 'src/teststore/coupon/coupon/types'

const coupon = useAdminCouponStore()
export const getCouponPools = (offset: number, limit: number, type: CouponType) => {
  coupon.getCouponPools({
    Offset: offset,
    Limit: limit,
    CouponType: type,
    Message: {
      Error: {
        Title: 'MSG_GET_COUPONS',
        Message: 'MSG_GET_COUPONS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, resp: Array<Coupon>) => {
    if (error || resp.length < limit) {
      return
    }
    getCouponPools(offset + limit, limit, type)
  })
}
