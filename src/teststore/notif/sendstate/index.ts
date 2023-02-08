import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppSendStatesRequest,
  GetAppSendStatesResponse,
  SendState
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminSendStateStore = defineStore('admin-readstate-v4', {
  state: () => ({
    SendStates: {
      SendStates: [] as Array<SendState>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppSendStates (req: GetAppSendStatesRequest, done: (error: boolean, rows: Array<SendState>) => void) {
      doActionWithError<GetAppSendStatesRequest, GetAppSendStatesResponse>(
        API.GET_APP_SENDSTATES,
        req,
        req.Message,
        (resp: GetAppSendStatesResponse): void => {
          this.SendStates.SendStates.push(...resp.Infos)
          this.SendStates.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<SendState>)
        }
      )
    }
  }
})
