import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  ProductArchivement,
  GetArchivementRequest,
  GetArchivementResponse
} from './types'

export const useAdminArchivementStore = defineStore('adminarchivement', {
  state: () => ({
    Archivements: {
      Archivements: new Map<string, ProductArchivement>(),
      Total: 0
    }
  }),
  getters: {

  },
  actions: {
    getGoodArchivements (req: GetArchivementRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetArchivementRequest, GetArchivementResponse>(
        API.GET_USER_GOOD_ARCHIVEMENTS,
        req,
        req.Message,
        (resp: GetArchivementResponse): void => {
          resp.Archivements.forEach((el) => {
            this.Archivements.Archivements.set(el.UserID, el)
          })
          done(false, resp.Archivements.length)
        },
        () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
