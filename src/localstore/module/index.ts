import { defineStore } from 'pinia'
import { API } from './const'
import { ModuleState } from './state'
import {
  CreateModuleRequest, CreateModuleResponse,
  DeleteModuleRequest, DeleteModuleResponse,
  GetModulesRequest, GetModulesResponse,
  Module,
  UpdateModuleRequest, UpdateModuleResponse
} from './types'
import { doActionWithError } from 'src/npoolstore/request'

export const useModuleStore = defineStore('local-module', {
  state: (): ModuleState => ({
    Modules: [] as Array<Module>,
    Total: 0
  }),
  getters: {
    module (): (id?: string, name?: string) => Module | undefined {
      return (id?: string, name?: string) => {
        return this.Modules.find((el) => (id?.length && el.ID === id) || (name?.length && el.Name === name))
      }
    }
  },
  actions: {
    createModule (req: CreateModuleRequest, done: (error: boolean, Module?: Module) => void) {
      doActionWithError<CreateModuleRequest, CreateModuleResponse>(
        API.CREATE_MODULE,
        req,
        req.Message,
        (resp: CreateModuleResponse): void => {
          const v = resp.Info
          this.Modules.push(v)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    updateModule (req: UpdateModuleRequest, done: (error: boolean, Module?: Module) => void) {
      doActionWithError<UpdateModuleRequest, UpdateModuleResponse>(
        API.UPDATE_MODULE,
        req,
        req.Message,
        (resp: UpdateModuleResponse): void => {
          const index = this.Modules.findIndex((el) => el.ID === resp.Info.ID)
          this.Modules.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    deleteModule (req: DeleteModuleRequest, done: (error: boolean, Module?: Module) => void) {
      doActionWithError<DeleteModuleRequest, DeleteModuleResponse>(
        API.DELETE_MODULE,
        req,
        req.Message,
        (resp: DeleteModuleResponse): void => {
          const index = this.Modules.findIndex((el) => el.ID === resp.Info.ID)
          this.Modules.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    },
    getModules (req: GetModulesRequest, done: (error: boolean, Modules?: Array<Module>) => void) {
      doActionWithError<GetModulesRequest, GetModulesResponse>(
        API.GET_MODULES,
        req,
        req.Message,
        (resp: GetModulesResponse): void => {
          resp.Infos.forEach((v) => {
            const index = this.Modules.findIndex((el) => el.ID === v.ID)
            this.Modules.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, v)
          })
          done(false, resp.Infos)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
