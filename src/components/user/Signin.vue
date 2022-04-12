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
  AccountType,
  encryptPassword,
  GoogleTokenType,
  NotificationType,
  useCodeRepoStore,
  useUserStore
} from 'npool-cli-v2'
import { useRouter } from 'vue-router'
import { useReCaptcha } from 'vue-recaptcha-v3'

const account = ref('')
const password = ref('')

const user = useUserStore()
const coderepo = useCodeRepoStore()
const recaptcha = useReCaptcha()

const router = useRouter()

const signin = (token: string) => {
  user.signin({
    Account: account.value,
    PasswordHash: encryptPassword(password.value),
    AccountType: AccountType.Email,
    ManMachineSpec: token,
    Message: {
      Error: {
        Title: 'MSG_SINGIN',
        Message: 'MSG_SIGNIN_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    void router.push({ path: '/' })
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
        Type: NotificationType.Error
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
