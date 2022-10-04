<template>
  <div>
    <q-input
      v-model='account'
      :label='$t("MSG_ACCOUNT")'
    >
      <template #prepend>
        <q-icon name='account_circle' />
      </template>
    </q-input>
    <q-input
      v-model='password'
      type='password'
      :label='$t("MSG_PASSWORD")'
    >
      <template #prepend>
        <q-icon name='lock' />
      </template>
    </q-input>
    <div class='row top'>
      <q-btn
        no-caps
        :label='$t("MSG_SIGNIN")'
        @click='onLoginClick'
        class='btn start round'
      />
      <q-btn
        no-caps
        :label='$t("MSG_CONTACT_ADMIN")'
        class='btn alt round'
      />
    </div>
    <q-dialog v-model='showVerifyDialog' persistent>
      <q-card style='min-width: 350px'>
        <q-card-section>
          <div class='text-h6'>
            <p
              class='tip'
              v-html='$t("MSG_VERIFICATION_CODE_SENT_TO", { ACCOUNT: account })'
            />
          </div>
        </q-card-section>

        <q-card-section class='q-pt-none'>
          <q-input
            dense v-model='verifyCode' autofocus
            @keyup.enter='onVerifyClick'
          />
        </q-card-section>
        <q-card-actions align='right' class='text-primary'>
          <TimeoutSendBtn
            :initial-clicked='true'
            @click='onSendCodeClick'
            class='margin-top-0'
            :target-error='false'
          />
          <button @click='onVerifyClick' style='margin-left: 10px;' :disabled='!validVerifyCode'>
            {{ $t("MSG_VERIFY") }}
          </button>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import {
  useFrontendUserStore,
  AccountType,
  NotifyType,
  useFrontendAppStore,
  useLocalUserStore,
  User,
  useFrontendVerifyStore,
  UsedFor,
  encryptPassword,
  GoogleTokenType,
  validateVerificationCode
} from 'npool-cli-v4'
import { useRouter } from 'vue-router'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { AppID } from 'src/const/const'
import { useI18n } from 'vue-i18n'
import { computed } from '@vue/reactivity'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))

const account = ref('')
const password = ref('')

const user = useFrontendUserStore()
const coderepo = useFrontendVerifyStore()
const recaptcha = useReCaptcha()

const router = useRouter()
const app = useFrontendAppStore()

const validVerifyCode = computed(() => validateVerificationCode(verifyCode.value))
const signin = (token: string) => {
  user.login({
    Account: account.value,
    PasswordHash: encryptPassword(password.value),
    AccountType: AccountType.Email,
    ManMachineSpec: token,
    EnvironmentSpec: 'NOT-USED',
    Message: {
      Error: {
        Title: 'MSG_SINGIN',
        Message: 'MSG_SIGNIN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (u: User, error: boolean) => {
    if (error) {
      return
    }
    verify()
  })
}
const verify = () => {
  app.getApp({
    AppID: AppID,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    _verify()
  })
}
const _verify = () => {
  if (!app.App.SigninVerifyEnable) {
    void router.push({ path: '/' })
    return
  }
  showVerifyDialog.value = true
  onSendCodeClick()
}
const getRecaptcha = () => {
  coderepo.getGoogleToken({
    Recaptcha: recaptcha,
    Req: GoogleTokenType.Login,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOGLE_TOKEN',
        Message: 'MSG_GET_GOOGLE_TOKEN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (token: string) => {
    signin(token)
  })
}

const onLoginClick = () => {
  getRecaptcha()
}

const showVerifyDialog = ref(false)
const verifyCode = ref('')

const onSendCodeClick = () => {
  coderepo.sendVerificationCode(account.value, AccountType.Email, UsedFor.Signin, account.value)
}

const logined = useLocalUserStore()

const onVerifyClick = () => {
  user.loginVerify({
    Account: account.value,
    AccountType: AccountType.Email,
    UserID: logined.User?.ID,
    Token: logined.User?.LoginToken,
    VerificationCode: verifyCode.value,
    Message: {
      Error: {
        Title: t('MSG_LOGIN_VERIFY'),
        Message: t('MSG_LOGIN_VERIFY_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (u: User, error: boolean) => {
    if (error) {
      console.log('error: ')
      return
    }
    showVerifyDialog.value = false
    void router.push({ path: '/' })
  })
}
</script>

<style lang='sass' scoped>
</style>
