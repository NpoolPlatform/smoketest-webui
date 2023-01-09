import { defineStore } from 'pinia'
import { API } from './const'
import {
  Registration,
  GetAppRegistrationsRequest,
  GetAppRegistrationsResponse,
  GetRegistrationsRequest,
  GetRegistrationsResponse,
  UpdateRegistrationRequest,
  UpdateRegistrationResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchRegistrationStore = defineStore('church-registration-v4', {
  state: () => ({
    Registrations: {
      Registrations: [] as Array<Registration>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppRegistrations (req: GetAppRegistrationsRequest, done: (error: boolean, rows: Array<Registration>) => void) {
      doActionWithError<GetAppRegistrationsRequest, GetAppRegistrationsResponse>(
        API.GET_APP_REGISTRATIONINVITATIONS,
        req,
        req.Message,
        (resp: GetAppRegistrationsResponse): void => {
          this.Registrations.Registrations.push(...resp.Infos)
          this.Registrations.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Registration>)
        }
      )
    },
    getRegistrations (req: GetRegistrationsRequest, done: (error: boolean, rows: Array<Registration>) => void) {
      doActionWithError<GetRegistrationsRequest, GetRegistrationsResponse>(
        API.GET_REGISTRATIONINVITATIONS,
        req,
        req.Message,
        (resp: GetRegistrationsResponse): void => {
          this.Registrations.Registrations.push(...resp.Infos)
          this.Registrations.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Registration>)
        }
      )
    },
    updateRegistration (req: UpdateRegistrationRequest, done: (error: boolean, row: Registration) => void) {
      doActionWithError<UpdateRegistrationRequest, UpdateRegistrationResponse>(
        API.UPDATE_REGISTRATIONINVITATION,
        req,
        req.Message,
        (resp: UpdateRegistrationResponse): void => {
          this.Registrations.Registrations.push(resp.Info)
          this.Registrations.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Registration)
        }
      )
    }
  }
})
