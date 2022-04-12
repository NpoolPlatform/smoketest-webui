import { defineStore } from 'pinia'
import { MenuItem, MenuState } from './types'

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    MainBreadcrumbs: [],
    ActiveMainBreadcrumb: undefined as unknown as MenuItem
  }),
  getters: {},
  actions: {}
})

export * from './types'
export * from './const'
