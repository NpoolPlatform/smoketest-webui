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
        path: 'email/template',
        component: () => import('pages/template/Email.vue'),
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
        path: 'sms/template',
        component: () => import('pages/template/SMS.vue'),
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
        path: 'contact/template',
        component: () => import('pages/template/Contact.vue'),
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
        path: 'app/languages',
        component: () => import('pages/internationalization/Language.vue'),
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
        path: 'app/messages',
        component: () => import('pages/internationalization/Message.vue'),
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
        path: 'countries',
        component: () => import('pages/internationalization/Country.vue'),
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
        path: 'app/goods',
        component: () => import('pages/good/Good.vue'),
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
        path: 'app/good/promotions',
        component: () => import('pages/good/Promotion.vue'),
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
        path: 'app/good/recommends',
        component: () => import('pages/good/Recommend.vue'),
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
        path: 'review/kyc',
        component: () => import('pages/review/KYC.vue'),
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
        path: 'review/withdraw/address',
        component: () => import('pages/review/WithdrawAddress.vue'),
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
        path: 'review/withdraw',
        component: () => import('pages/review/Withdraw.vue'),
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
        path: 'review/payment',
        component: () => import('pages/review/Payment.vue'),
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
        path: 'users',
        component: () => import('pages/user/User.vue'),
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
        path: 'roles',
        component: () => import('pages/user/Role.vue'),
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
        path: 'roleusers',
        component: () => import('pages/user/RoleUser.vue'),
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
        path: 'inspire/invitation/code',
        component: () => import('pages/inspire/InvitationCode.vue'),
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
        path: 'inspire/commission',
        component: () => import('pages/inspire/Commission.vue'),
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
        path: 'inspire/fixamount',
        component: () => import('pages/inspire/FixAmount.vue'),
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
        path: 'inspire/discount',
        component: () => import('pages/inspire/Discount.vue'),
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
        path: 'inspire/special/offer',
        component: () => import('pages/inspire/SpecialOffer.vue'),
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
        path: 'inspire/airdrop',
        component: () => import('pages/inspire/AirDrop.vue'),
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
        path: 'billing/incoming',
        component: () => import('pages/billing/Incoming.vue'),
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
        path: 'billing/order',
        component: () => import('pages/billing/Order.vue'),
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
        path: 'billing/withdraw',
        component: () => import('pages/billing/Withdraw.vue'),
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
        path: 'coin/currency',
        component: () => import('pages/coin/Currency.vue'),
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
        path: 'order/offline',
        component: () => import('pages/order/Offline.vue'),
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
        path: 'order/order',
        component: () => import('pages/order/Order.vue'),
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
        path: 'announcement',
        component: () => import('pages/mailbox/Announcement.vue'),
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
