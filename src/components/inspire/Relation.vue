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
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITEES")'
    :rows-per-page-options='[10]'
    :column='columns'
    row-key='ID'
    :rows='invitees'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_INVITERS")'
    row-key='name'
    :rows-per-page-options='[10]'
    :rows='inviters'
    :loading='loading'
  >
    <template #body='props'>
      <q-tr :props='props'>
        <q-td key='UserID' label='UserID' :props='props'>
          {{ props.row.UserID }}
        </q-td>
        <q-td key='InviterID' :props='props'>
          {{ props.row.InviterID }}
        </q-td>
        <q-td key='EmailAddress' :props='props'>
          {{ props.row.EmailAddress }}
        </q-td>
        <q-td key='Profit' :props='props'>
          <table>
            <div v-if='props.row.Profit.length > 0'>
              <tr>
                <th>Name</th>
                <th>ProductID</th>
                <th>Comm.Rate</th>
                <th>Units</th>
                <th>Total Sales</th>
                <th>Commission</th>
              </tr>
              <tr v-for='(product,index) in props.row.Profit' :key='index'>
                <td class='name'>
                  {{ product.Name }}
                </td>
                <td>{{ product.ProductID }}</td>
                <td>
                  {{ product.Rate }} <span>%</span>
                </td>
                <td class='units'>
                  {{ product.Units }}{{ $t(product.Unit) }}
                </td>
                <td>{{ product.TotalSales }} <span class='price-coin-name'>{{ product.SaleUnit }}</span></td>
                <td class='commission'>
                  {{ product.Commission }} <span class='price-coin-name'>{{ product.SaleUnit }}</span>
                </td>
              </tr>
            </div>
          </table>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script setup lang='ts'>
import {
  NotificationType,
  useUsersStore,
  AppUser,
  useRegInvitationStore,
  usePurchaseAmountSettingStore,
  useAdminInspireStore,
  useGoodStore,
  Referral,
  PriceCoinName
} from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProductProfit, UserProfit } from '../../localstore'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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

const columns = [
  { name: 'USERID', align: 'center', label: 'USERID', field: 'UserID' },
  { name: 'INVITERID', align: 'center', label: 'INVITERID', field: 'InviterID' },
  { name: 'EMAILADDRESS', align: 'center', label: 'EMAILADDRESS', field: 'EmailAddress' },
  { name: 'Profit', align: 'center', label: 'Profit', field: 'Profit' }
]

const regInvitation = useRegInvitationStore()
const curUserID = computed(() => selectedUser.value.length ? selectedUser.value[0].ID : '')

const invitees = computed(() => {
  if (selectedUser.value.length === 0) {
    return
  }
  const result = [] as Array<UserProfit>
  for (const item of regInvitation.RegInvitations) {
    if (item.InviterID === selectedUser.value[0].ID) {
      result.push({
        UserID: item.InviteeID,
        InviterID: item.InviterID,
        EmailAddress: user.getUserByID(item.InviteeID)?.User?.EmailAddress as string
      })
    }
  }
  return result
})

// need optimization
const loading = ref(false)
const inviters = computed(() => {
  const profits = [] as Array<UserProfit>

  if (selectedUser.value.length === 0) {
    return [] as Array<UserProfit>
  }

  // get user's all parent
  const lastChild = regInvitation.RegInvitations.find(item => item.InviteeID === selectedUser.value[0].ID)
  const users = [] as Array<UserProfit>
  if (lastChild !== undefined) {
    users.push({
      UserID: lastChild.InviteeID,
      InviterID: lastChild.InviterID,
      EmailAddress: user.getUserByID(lastChild.InviteeID)?.User?.EmailAddress as string
    })
  }
  let len = 1
  while (users.length >= len) {
    const parent = regInvitation.RegInvitations.find((item) => item.InviteeID === users[len - 1].InviterID)
    if (parent === undefined) {
      users.push({
        UserID: users[len - 1].InviterID,
        InviterID: '',
        EmailAddress: user.getUserByID(users[len - 1].InviterID)?.User?.EmailAddress as string
      })
      break
    }
    users.push({
      UserID: parent.InviteeID,
      InviterID: parent.InviterID,
      EmailAddress: user.getUserByID(parent.InviteeID)?.User?.EmailAddress as string
    })
    len++
  }
  if (lastChild === undefined) {
    users.push({
      UserID: selectedUser.value[0].ID as string,
      InviterID: '',
      EmailAddress: user.getUserByID(selectedUser.value[0].ID as string)?.User?.EmailAddress as string
    })
  }
  for (const user of users) {
    const referral = getCurrentReferral(user.UserID)
    const obj = {
      UserID: user.UserID,
      InviterID: user.InviterID,
      EmailAddress: user.EmailAddress,
      Profit: [] as Array<ProductProfit>
    }
    if (!referral) {
      // TODO
    } else {
      for (const goodSummary of referral.GoodSummaries) {
        // profitStr += `${product} | ${productID} | ${rate}% | ${units} | ${totalSales}${unit} | ${commission}${saleUnit} </br>`
        const appGood = good.AppGoods.find((el) => el.GoodID === goodSummary.GoodID)
        if (appGood !== undefined) {
          if (appGood.Visible) {
            obj.Profit.push({
              Product: good.getGoodByID(goodSummary.GoodID)?.Good?.Good?.Title,
              Name: good.getGoodByID(goodSummary.GoodID)?.Main?.Name as string,
              ProductID: goodSummary.GoodID,
              Rate: goodSummary.Percent,
              Units: goodSummary.Units,
              Unit: goodSummary.Unit,
              TotalSales: goodSummary.Amount,
              SaleUnit: PriceCoinName,
              Commission: goodCommission(goodSummary.GoodID, user.UserID)
            })
          }
        }
      }
    }
    profits.push(obj)
  }
  return profits
})

watch(curUserID, () => {
  getInviters()
})

const getInviters = () => {
  if (selectedUser.value.length === 0) {
    return []
  }

  // get user's all parent
  const lastChild = regInvitation.RegInvitations.find(item => item.InviteeID === selectedUser.value[0].ID)
  const users = [] as Array<UserProfit>
  if (lastChild !== undefined) {
    users.push({
      UserID: lastChild.InviteeID,
      InviterID: lastChild.InviterID,
      EmailAddress: user.getUserByID(lastChild.InviteeID)?.User?.EmailAddress as string
    })
  }
  let len = 1
  while (users.length >= len) {
    const parent = regInvitation.RegInvitations.find((item) => item.InviteeID === users[len - 1].InviterID)
    if (parent === undefined) {
      users.push({
        UserID: users[len - 1].InviterID,
        InviterID: '',
        EmailAddress: user.getUserByID(users[len - 1].InviterID)?.User?.EmailAddress as string
      })
      break
    }
    users.push({
      UserID: parent.InviteeID,
      InviterID: parent.InviterID,
      EmailAddress: user.getUserByID(parent.InviteeID)?.User?.EmailAddress as string
    })
    len++
  }
  if (lastChild === undefined) {
    users.push({
      UserID: selectedUser.value[0].ID as string,
      InviterID: '',
      EmailAddress: user.getUserByID(selectedUser.value[0].ID as string)?.User?.EmailAddress as string
    })
  }
  loading.value = true
  for (const user of users) {
    loading.value = true
    inspire.getUserReferrals({
      TargetUserID: user.UserID,
      Message: {
        Error: {
          Title: t('MSG_GET_REFERRALS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      inspire.getUserGoodCommissions({
        TargetUserID: user.UserID,
        Message: {
          Error: {
            Title: t('MSG_GET_REFERRALS_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, () => {
        // TODO
        loading.value = false
      })
    })
  }
}

// Profit
const inspire = useAdminInspireStore()

const getCurrentReferral = (userID:string) => {
  const index = inspire.Referrals.findIndex((el) => el.User.ID === userID)
  return index < 0 ? undefined as unknown as Referral : inspire.Referrals[index]
}

const goodCommission = (goodID: string, userID: string) => {
  const index = inspire.GoodCommissions.findIndex((el) => {
    const referral = getCurrentReferral(userID)
    return el.GoodID === goodID && el.AppID === referral.User.AppID && el.UserID === referral.User.ID
  })
  return index < 0 ? 0 : inspire.GoodCommissions[index].Amount
}

const good = useGoodStore()

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

  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
  good.getAppGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>

<style lang='sass' scoped>
.price-coin-name
  font-size: 5px
::v-deep .name
  max-width: 100px
  width: 100px
::v-deep .units
  width: 70px
  overflow: hidden
  display: block
  white-space:nowrap
.units:hover
  text-overflow: inherit
  overflow: visible
::v-deep .commission
  max-width: 160px
  width: 160px
</style>
