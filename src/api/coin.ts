import { NotificationType, useCoinStore } from 'npool-cli-v2'

const coin = useCoinStore()
export const getCoins = () => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}
