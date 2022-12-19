import { NotifyType } from 'npool-cli-v4'
import { useAdminAppCountryStore } from 'src/teststore/g11n/appcountry'
import { AppCountry } from 'src/teststore/g11n/appcountry/types'
import { useAdminAppLangStore } from 'src/teststore/g11n/applang'
import { AppLang } from 'src/teststore/g11n/applang/types'
import { useAdminMessageStore } from 'src/teststore/g11n/message'
import { Message } from 'src/teststore/g11n/message/types'

const country = useAdminAppCountryStore()
export const getCountries = (offset: number, limit: number) => {
  country.getAppCountries({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppCountry>) => {
    if (error || rows.length === 0) {
      return
    }
    getCountries(offset + limit, limit)
  })
}

const appLang = useAdminAppLangStore()
export const getAppLangs = (offset: number, limit: number) => {
  appLang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_LANGUAGES',
        Message: 'MSG_GET_APP_LANGUAGES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppLang>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const message = useAdminMessageStore()
export const getAppMessages = (offset: number, limit: number) => {
  message.getMessages({
    Disabled: false,
    Offset: offset,
    Limit: limit,
    NotifyMessage: {
      Error: {
        Title: 'MSG_GET_APP_MESSAGES',
        Message: 'MSG_GET_APP_MESSAGES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Message>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppMessages(offset + limit, limit)
  })
}
