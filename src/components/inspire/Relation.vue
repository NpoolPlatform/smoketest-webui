<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreateInvitationCodeClick'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    title='invitees'
    :rows-per-page-options='[10]'
    :column='columns'
    row-key='ID'
    :rows='invitees'
  />
  <q-table
    dense
    flat
    title='inviters'
    row-key='ID'
    :column='columns'
    :rows-per-page-options='[10]'
    :rows='inviters'
  />
</template>
<script setup lang='ts'>
import { NotificationType, useUsersStore, AppUser, useInvitationStore, useRegInvitationStore, usePurchaseAmountSettingStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInvitationStore()

const user = useUsersStore()

const users = computed(() => Array.from(user.Users.map((el) => el.User)))
const selectedUser = ref([] as Array<AppUser>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => {
  return user.ID?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
}))

// relation
const purchaseAmount = usePurchaseAmountSettingStore()
const purchaseAmountSettings = computed(() => purchaseAmount.PurchaseAmountSettings)

interface RelationAndPercent {
  UserID: string
  InviterID: string
  Percent: number
  Profit: number
  EmailAddress: string
}
const columns = [
  { name: 'USERID', label: 'USERID', field: 'UserID', align: 'center' },
  { name: 'INVITERID', align: 'center', label: 'INVITERID', field: 'InviterID' },
  { name: 'PERCENT', align: 'center', label: 'PERCENT', field: 'Percent' },
  { name: 'EMAILADDRESS', align: 'center', label: 'EMAILADDRESS', field: 'EmailAddress' }
]
const userKolPercent = (userID:string) => {
  const index = purchaseAmountSettings.value.findIndex((amount) => amount.UserID === userID && amount.End === 0)
  return index === -1 ? 0 : purchaseAmountSettings.value[index].Percent
}
const regInvitation = useRegInvitationStore()

const invitees = computed(() => {
  if (selectedUser.value.length === 0) {
    return
  }
  const result = [] as Array<RelationAndPercent>
  for (const item of regInvitation.RegInvitations) {
    if (item.InviterID === selectedUser.value[0].ID) {
      result.push({
        Percent: userKolPercent(item.InviteeID),
        UserID: item.InviteeID,
        InviterID: item.InviterID,
        Profit: 0,
        EmailAddress: user.getUserByID(item.InviteeID)?.User?.EmailAddress as string
      })
    }
  }
  return result
})
// need optimization
const inviters = computed(() => {
  if (selectedUser.value.length === 0) {
    return
  }
  const lastChild = regInvitation.RegInvitations.find(item => item.InviteeID === selectedUser.value[0].ID)
  const result = [] as Array<RelationAndPercent>
  if (lastChild !== undefined) {
    result.push({
      Percent: userKolPercent(lastChild.InviteeID),
      UserID: lastChild.InviteeID,
      InviterID: lastChild.InviterID,
      Profit: 0,
      EmailAddress: user.getUserByID(lastChild.InviteeID)?.User?.EmailAddress as string
    })
  }
  let len = 1
  while (result.length >= len) {
    const parent = regInvitation.RegInvitations.find((item) => item.InviteeID === result[len - 1].InviterID)
    if (parent === undefined) {
      break
    }
    result.push({
      Percent: userKolPercent(parent.InviteeID),
      UserID: parent.InviteeID,
      InviterID: parent.InviterID,
      Profit: 0,
      EmailAddress: user.getUserByID(parent.InviteeID)?.User?.EmailAddress as string
    })
    len++
  }
  return result
})

onMounted(() => {
  user.getUsers({
    Message: {
      Error: {
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  regInvitation.getRegInvitations({
    Message: {
      Error: {
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  purchaseAmount.getPurchaseAmountSettings({
    Message: {
      Error: {
        Title: t('MSG_GET_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_GET_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const onCreateInvitationCodeClick = () => {
  if (selectedUser.value.length === 0) {
    return
  }
  inspire.createInvitationCode({
    TargetUserID: selectedUser.value[0].ID as string,
    Info: {
      UserID: selectedUser.value[0].ID as string
    },
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
