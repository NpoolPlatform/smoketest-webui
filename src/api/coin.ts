import { Coin, CoinDescription, NotifyType, useAdminAppCoinStore, useAdminCoinDescriptionStore } from 'npool-cli-v4'

const coin = useAdminAppCoinStore()
export const getCoins = (offset : number, limit: number) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, coins: Array<Coin>) => {
    if (error || coins.length < limit) {
      return
    }
    getCoins(offset + limit, limit)
  })
}

const description = useAdminCoinDescriptionStore()
export const getCoinDescriptions = (offset : number, limit: number) => {
  description.getCoinDescriptions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_DESCRIPTIONS',
        Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, descriptions: Array<CoinDescription>) => {
    if (error || descriptions.length < limit) {
      return
    }
    getCoinDescriptions(offset + limit, limit)
  })
}
