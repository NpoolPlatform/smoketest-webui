import { defineStore } from 'pinia'
import { APIS as APIEnum } from './const'
import { API, GetAPIsRequest, GetAPIsResponse, GetDomainsRequest, GetDomainsResponse } from './types'
import { doActionWithError } from 'src/npoolstore/request'

export * from './types'

export const useLocalAPIStore = defineStore('church-apis-v4', {
  state: () => ({
    APIs: [] as Array<API>,
    Domains: [] as Array<string>
  }),
  getters: {
    getModuleAPIs (): (module?: string) => Array<API> {
      return (module?: string) => {
        if (!module?.length) {
          return this.APIs
        }
        return this.APIs.filter((el) => el.ServiceName === module)
      }
    },
    path (): (api?: API) => string | undefined {
      return (api?: API) => {
        if (!api) {
          return undefined
        }
        return api.PathPrefix.replace('/api', '') + api.Path
      }
    },
    getAPIByPath (): (prefix: string, path: string) => API | undefined {
      return (prefix: string, path: string) => {
        return this.APIs.find((el) => el.PathPrefix === prefix && el.Path === path)
      }
    }
  },
  actions: {
    getAPIs (req: GetAPIsRequest, done: (error: boolean, rows: Array<API>) => void) {
      doActionWithError<GetAPIsRequest, GetAPIsResponse>(
        APIEnum.GET_APIS,
        req,
        req.Message,
        (resp: GetAPIsResponse): void => {
          resp.Infos.forEach((v) => {
            if (this.APIs.findIndex((el) => el.ID === v.ID) >= 0) {
              return
            }
            this.APIs.push(v)
          })
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
