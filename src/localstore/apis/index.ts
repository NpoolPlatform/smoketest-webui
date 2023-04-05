import { defineStore } from 'pinia'
import { APIS as APIEnum } from './const'
import { API, GetAPIsRequest, GetAPIsResponse, GetDomainsRequest, GetDomainsResponse } from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useLocalAPIStore = defineStore('local-apis', {
  state: () => ({
    APIs: {
      APIs: [] as Array<API>,
      Total: 0
    },
    Domains: [] as Array<string>
  }),
  getters: {
  },
  actions: {
    getAPIs (req: GetAPIsRequest, done: (error: boolean, rows: Array<API>) => void) {
      doActionWithError<GetAPIsRequest, GetAPIsResponse>(
        APIEnum.GET_APIS,
        req,
        req.Message,
        (resp: GetAPIsResponse): void => {
          this.APIs.APIs.push(...resp.Infos)
          this.APIs.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<API>)
        }
      )
    },
    getDomains (req: GetDomainsRequest, done: (error: boolean, domains: Array<string>) => void) {
      doActionWithError<GetDomainsRequest, GetDomainsResponse>(
        APIEnum.GET_DOMAINS,
        req,
        req.Message,
        (resp: GetDomainsResponse): void => {
          this.Domains = resp.Infos
          done(false, resp.Infos)
        }, () => {
          done(true, {} as string[])
        }
      )
    }
  }
})
