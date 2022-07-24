import { defineStore } from 'pinia'
import { UserProfit, UsersProfit } from './types'

export const useProfitStore = defineStore('profit', {
  state: (): UsersProfit => ({
    User: [] as Array<UserProfit>
  }),
  getters: {},
  actions: {}
})

export * from './types'
