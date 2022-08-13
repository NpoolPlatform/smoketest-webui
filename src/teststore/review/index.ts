import { defineStore } from 'pinia'
import { API } from './const'
import {
  UpdateReviewRequest,
  UpdateReviewResponse,
  Review
} from './types'
import { doActionWithError } from 'npool-cli-v2'

export const useAdminReviewStore = defineStore('adminreview', {
  state: () => ({
    WithdrawReviews: []
  }),
  getters: {},
  actions: {
    updateWithdrawReview (req: UpdateReviewRequest, done: (error: boolean, resp?: Review) => void) {
      doActionWithError<UpdateReviewRequest, UpdateReviewResponse>(
        API.UPDATE_WITHDRAW_REVIEW,
        req,
        req.NotificationMessage,
        (resp: UpdateReviewResponse): void => {
          done(false, resp.Info)
        }, () => {
          done(true)
        })
    }
  }
})

export * from './types'
