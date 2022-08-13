import { doActionWithError } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppWithdrawsRequest,
  GetAppWithdrawsResponse,
  Withdraw
} from './types'

export const useAdminLedgerStore = defineStore('adminledger', {
  state: () => ({
    Withdraws: {
      Withdraws: [] as Array<Withdraw>,
      Total: 0
    }
  }),
  getters: {
    withdraws (): Array<Withdraw> {
      return this.Withdraws.Withdraws.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1)
    }
  },
  actions: {
    getAppWithdraws (req: GetAppWithdrawsRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetAppWithdrawsRequest, GetAppWithdrawsResponse>(
        API.GET_APP_WITHDRAWS,
        req,
        req.Message,
        (resp: GetAppWithdrawsResponse): void => {
          this.Withdraws.Withdraws.push(...resp.Infos)
          this.Withdraws.Total = resp.Total
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
export { AccountType } from './const'
