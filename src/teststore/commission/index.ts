import { defineStore } from 'pinia'
import { API } from './const'
import {
  CreateCommissionRequest,
  CreateCommissionResponse,
  UpdateCommissionRequest,
  UpdateCommissionResponse,
  Commission,
  GetAppCommissionsRequest,
  GetAppCommissionsResponse,
  GetCommissionsRequest,
  GetCommissionsResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchCommissionStore = defineStore('church-commission-v4', {
  state: () => ({
    Commissions: {
      Commissions: [] as Array<Commission>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppCommissions (req: GetAppCommissionsRequest, done: (error: boolean, rows: Array<Commission>) => void) {
      doActionWithError<GetAppCommissionsRequest, GetAppCommissionsResponse>(
        API.GET_APP_COMMISSIONS,
        req,
        req.Message,
        (resp: GetAppCommissionsResponse): void => {
          this.Commissions.Commissions.push(...resp.Infos)
          this.Commissions.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Commission>)
        }
      )
    },
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
    createCommission (req: CreateCommissionRequest, done: (error: boolean, row: Commission) => void) {
      doActionWithError<CreateCommissionRequest, CreateCommissionResponse>(
        API.CREATE_COMMISSION,
        req,
        req.Message,
        (resp: CreateCommissionResponse): void => {
          this.Commissions.Commissions.push(resp.Info)
          this.Commissions.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Commission)
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
