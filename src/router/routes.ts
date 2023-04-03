import { RouteRecordRaw } from 'vue-router'
import { RouteMetaImpl } from 'npool-cli-v2/utils'

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface RouteMeta extends RouteMetaImpl {
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'signin',
        component: () => import('pages/Signin.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'testcase',
        component: () => import('pages/TestCase.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'testplan',
        component: () => import('pages/TestPlan.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
