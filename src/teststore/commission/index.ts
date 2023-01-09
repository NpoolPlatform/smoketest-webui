import { defineStore } from 'pinia'
import { API } from './const'
import {
  UpdateCommissionRequest,
  UpdateCommissionResponse,
  Commission,
  GetCommissionsRequest,
  GetCommissionsResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminCommissionStore = defineStore('admin-commission-v4', {
  state: () => ({
    Commissions: {
      Commissions: [] as Array<Commission>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getCommissions (req: GetCommissionsRequest, done: (error: boolean, rows: Array<Commission>) => void) {
      doActionWithError<GetCommissionsRequest, GetCommissionsResponse>(
        API.GET_COMMISSIONS,
        req,
        req.Message,
        (resp: GetCommissionsResponse): void => {
          this.Commissions.Commissions.push(...resp.Infos)
          this.Commissions.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Commission>)
        }
      )
    },
    updateCommission (req: UpdateCommissionRequest, done: (error: boolean, row: Commission) => void) {
      doActionWithError<UpdateCommissionRequest, UpdateCommissionResponse>(
        API.UPDATE_COMMISSION,
        req,
        req.Message,
        (resp: UpdateCommissionResponse): void => {
          const index = this.Commissions.Commissions.findIndex((el) => el.UserID === resp.Info.UserID)
          this.Commissions.Commissions.splice(index, 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Commission)
        }
      )
    }
  }
})
