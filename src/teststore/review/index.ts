import { defineStore } from 'pinia'
import { API } from './const'
import {
  UpdateReviewRequest,
  UpdateReviewResponse,
  WithdrawReview,
  GetWithdrawReviewsRequest,
  GetWithdrawReviewsResponse
} from './types'
import { doActionWithError } from 'npool-cli-v2'

export const useWithdrawReviewStore = defineStore('withdrawreview', {
  state: () => ({
    WithdrawReviews: {
      WithdrawReviews: [] as Array<WithdrawReview>,
      Total: 0
    }
  }),
  getters: {},
  actions: {
    updateWithdrawReview (req: UpdateReviewRequest, done: (error: boolean) => void) {
      doActionWithError<UpdateReviewRequest, UpdateReviewResponse>(
        API.UPDATE_WITHDRAW_REVIEW,
        req,
        req.NotificationMessage,
        (resp: UpdateReviewResponse): void => {
          const index = this.WithdrawReviews.WithdrawReviews.findIndex((el) => el.Reviewer)
          this.WithdrawReviews.WithdrawReviews.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false)
        }, () => {
          done(true)
        })
    },
    getWithdrawReviews (req: GetWithdrawReviewsRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetWithdrawReviewsRequest, GetWithdrawReviewsResponse>(
        API.GET_WITHDRAW_REVIEWS,
        req,
        req.NotificationMessage,
        (resp: GetWithdrawReviewsResponse): void => {
          resp.Infos.forEach((el) => {
            const index = this.WithdrawReviews.WithdrawReviews.findIndex((oel) => oel.WithdrawID === el.WithdrawID)
            this.WithdrawReviews.WithdrawReviews.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, el)
          })
          this.WithdrawReviews.Total = resp.Total
          done(false, resp.Infos.length)
        }, () => {
          done(true)
        })
    }
  }
})

export * from './types'
