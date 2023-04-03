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
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import {
  useFrontendUserStore,
  AccountType,
  NotifyType,
  User,
  useFrontendVerifyStore,
  encryptPassword,
  GoogleTokenType
} from 'npool-cli-v4'
import { useRouter } from 'vue-router'
import { useReCaptcha } from 'vue-recaptcha-v3'

const account = ref('')
const password = ref('')

const user = useFrontendUserStore()
const coderepo = useFrontendVerifyStore()
const recaptcha = useReCaptcha()

const router = useRouter()

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
    void router.push('/testcase')
  })
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

</script>

<style lang='sass' scoped>
</style>
