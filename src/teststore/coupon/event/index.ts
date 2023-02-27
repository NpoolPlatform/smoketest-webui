import { defineStore } from 'pinia'
import { API } from './const'
import {
  UpdateEventInspireRequest,
  UpdateEventInspireResponse,
  CreateEventInspireRequest,
  CreateEventInspireResponse,
  GetEventInspiresRequest,
  GetEventInspiresResponse,
  EventInspire
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminEventInspireStore = defineStore('admin-eventinspire-v4', {
  state: () => ({
    EventInspires: {
      EventInspires: [] as Array<EventInspire>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getEventInspires (req: GetEventInspiresRequest, done: (error: boolean, rows: Array<EventInspire>) => void) {
      doActionWithError<GetEventInspiresRequest, GetEventInspiresResponse>(
        API.GET_EVENTINSPIRES,
        req,
        req.Message,
        (resp: GetEventInspiresResponse): void => {
          this.EventInspires.EventInspires.push(...resp.Infos)
          this.EventInspires.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<EventInspire>)
        }
      )
    },
    updateEventInspire (req: UpdateEventInspireRequest, done: (error: boolean, row: EventInspire) => void) {
      doActionWithError<UpdateEventInspireRequest, UpdateEventInspireResponse>(
        API.UPDATE_EVENTINSPIRE,
        req,
        req.Message,
        (resp: UpdateEventInspireResponse): void => {
          const index = this.EventInspires.EventInspires.findIndex((el) => el.ID === resp.Info.ID)
          this.EventInspires.EventInspires.splice(index, 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as EventInspire)
        }
      )
    },
    createEventInspire (req: CreateEventInspireRequest, done: (error: boolean, row: EventInspire) => void) {
      doActionWithError<CreateEventInspireRequest, CreateEventInspireResponse>(
        API.CREATE_EVENTINSPIRE,
        req,
        req.Message,
        (resp: CreateEventInspireResponse): void => {
          this.EventInspires.EventInspires.push(resp.Info)
          this.EventInspires.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as EventInspire)
        }
      )
    }
  }
})
