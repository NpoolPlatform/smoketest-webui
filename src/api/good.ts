import { AppGood, NotifyType, Promotion, Recommend, useAdminAppGoodStore, useAdminPromotionStore, useAdminRecommendStore } from 'npool-cli-v4'

const appGood = useAdminAppGoodStore()

export const getAppGoods = (offset: number, limit: number) => {
  appGood.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<AppGood>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

const promotion = useAdminPromotionStore()
export const getPromotions = (offset: number, limit: number) => {
  promotion.getPromotions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_PROMOTIONS',
        Message: 'MSG_GET_GOOD_PROMOTIONS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Promotion>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getPromotions(offset + limit, limit)
  })
}

const recommend = useAdminRecommendStore()
export const getRecommends = (offset: number, limit: number) => {
  recommend.getRecommends({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_RECOMMENDS',
        Message: 'MSG_GET_GOOD_RECOMMENDS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Recommend>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getRecommends(offset + limit, limit)
  })
}
