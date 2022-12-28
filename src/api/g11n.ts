import { NotifyType, useAdminAppCountryStore, AppCountry, useAdminAppLangStore, AppLang, useAdminMessageStore, Message } from 'npool-cli-v4'

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
export const getMessages = (offset: number, limit: number) => {
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
    getMessages(offset + limit, limit)
  })
}
