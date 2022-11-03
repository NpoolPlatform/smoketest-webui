import { Account, NotifyType, useAdminUserAccountStore } from 'npool-cli-v4'

const account = useAdminUserAccountStore()

export const getAppUserAccounts = (offset: number, limit: number) => {
  account.getAppUserAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS',
        Message: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<Account>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getAppUserAccounts(offset + limit, limit)
  })
}
