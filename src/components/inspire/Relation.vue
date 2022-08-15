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
    row-key='name'
    :columns='(columns as never)'
    :rows='inviteesArchivemnents'
    :loading='inviteesTableLoading'
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
        <q-td key='PhoneNO' :props='props'>
          {{ props.row.PhoneNO }}
        </q-td>
        <q-td key='Archivements' :props='props'>
          <table>
            <div v-if='props.row.Archivements?.length > 0'>
              <tr>
                <th>Name</th>
                <th>ProductID</th>
                <th>Comm.Rate</th>
                <th>Units</th>
                <th>Total Sales</th>
                <th>Commission</th>
              </tr>
              <tr v-for='(_good,index) in props.row.Archivements' :key='index'>
                <td class='name'>
                  {{ _good?.CoinName }}
                </td>
                <td>{{ _good?.GoodID }}</td>
                <td>
                  {{ _good.CommissionPercent }} <span>%</span>
                </td>
                <td class='units'>
                  {{ _good.TotalUnits }}{{ $t(_good.GoodUnit) }}
                </td>
                <td>{{ _good.TotalAmount }} <span class='price-coin-name'>{{ PriceCoinName }}</span></td>
                <td class='commission'>
                  {{ _good.TotalCommission }} <span class='price-coin-name'>{{ PriceCoinName }}</span>
                </td>
              </tr>
            </div>
            <div v-else>
              0
            </div>
          </table>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITERS")'
    row-key='ID'
    :rows-per-page-options='[10]'
    :rows='invitersArchivemnents'
    :columns='(columns as never)'
    :loading='invitersTableLoading'
  >
    <template #body='props'>
      <q-tr :props='props'>
        <q-td key='UserID' :props='props'>
          {{ props.row.UserID }}
        </q-td>
        <q-td key='InviterID' :props='props'>
          {{ props.row.InviterID }}
        </q-td>
        <q-td key='EmailAddress' :props='props'>
          {{ props.row.EmailAddress }}
        </q-td>
        <q-td key='PhoneNO' :props='props'>
          {{ props.row.PhoneNO }}
        </q-td>
        <q-td key='Archivements' :props='props'>
          <table>
            <div v-if='props.row.Archivements?.length > 0'>
              <tr>
                <th>Name</th>
                <th>ProductID</th>
                <th>Comm.Rate</th>
                <th>Units</th>
                <th>Total Sales</th>
                <th>Commission</th>
              </tr>
              <tr v-for='(_good,index) in props.row.Archivements' :key='index'>
                <td class='name'>
                  {{ _good?.CoinName }}
                </td>
                <td>{{ _good?.GoodID }}</td>
                <td>
                  {{ _good.CommissionPercent }} <span>%</span>
                </td>
                <td class='units'>
                  {{ _good.TotalUnits }}{{ $t(_good.GoodUnit) }}
                </td>
                <td>{{ _good.TotalAmount }} <span class='price-coin-name'>{{ PriceCoinName }}</span></td>
                <td class='commission'>
                  {{ _good.TotalCommission }} <span class='price-coin-name'>{{ PriceCoinName }}</span>
                </td>
              </tr>
            </div>
            <div v-else>
              0
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
  PriceCoinName
} from 'npool-cli-v2'
import { ProductArchivement, useAdminArchivementStore } from 'src/teststore/archivement'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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

const columns = [
  { name: 'UserID', label: 'USERID', field: 'UserID', align: 'center' },
  { name: 'InviterID', label: 'INVITERID', field: 'InviterID', align: 'center' },
  { name: 'EmailAddress', label: 'EMAILADRESS', field: 'EmailAddress', align: 'center' },
  { name: 'PhoneNO', label: 'PHONENO', field: 'PhoneNO', align: 'center' },
  { name: 'Archivements', label: 'PROFIT', field: 'Archivements', align: 'center' }
]
const regInvitation = useRegInvitationStore()

interface InvitationRelation {
  UserID: string
  InviterID: string
}

const userInvitees = ref([] as Array<InvitationRelation>)// 用户邀请的人
const userInviters = ref([] as Array<InvitationRelation>) // 邀请该用户的人
const curUserID = computed(() => selectedUser.value.length ? selectedUser.value[0].ID : '')// 当前选择的用户

watch(curUserID, () => {
  userInvitees.value = [] // reset
  userInviters.value = []
  getUserInvitees(curUserID.value as string)
  getUserInviters(curUserID.value as string)
})
const getUserInvitees = (userID: string) => {
  regInvitation.RegInvitations.filter(item => item.InviterID === userID).forEach((el) => {
    userInvitees.value.push({ UserID: el.InviteeID, InviterID: userID })
  })
  getUserArchivements(userInvitees.value.map((el) => el.UserID), 0, 100)
}
const getUserInviters = (userID: string) => {
  const root = regInvitation.RegInvitations.find(item => item.InviteeID === userID)
  if (!root) { // top level user
    if (userInviters.value.length === 0) {
      userInviters.value.push({ UserID: userID, InviterID: '' })
    } else {
      userInviters.value.push({ UserID: userInviters.value[-1].InviterID, InviterID: '' })
    }
    getUserArchivements(userInviters.value.map((el) => el.UserID), 0, 100)
    return
  }
  userInviters.value.push({ UserID: userID, InviterID: root.InviterID })
  getUserInviters(root.InviterID)
}
const getUserArchivements = (userIDs: Array<string>, offset: number, limit: number) => {
  if (userIDs.length > 0) {
    archivement.getGoodArchivements({
      UserIDs: userIDs,
      Offset: offset,
      Limit: limit,
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD_ARCHIVEMENT_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (error: boolean, count?: number) => {
      if (error) { // has error
        return
      }
      if (count !== undefined && count < limit) { // no more data
        return
      }
      getUserArchivements(userIDs, offset + limit, limit)
    })
  }
}

const archivement = useAdminArchivementStore()

interface UserGoodArchivements extends ProductArchivement {
  InviterID: string
}
const invitersArchivemnents = computed(() => {
  const data = [] as Array<UserGoodArchivements>
  userInviters.value.forEach((user) => {
    const userArchivements = archivement.Archivements.Archivements.get(user.UserID)
    data.push({ ...userArchivements, ...{ InviterID: user.InviterID } } as UserGoodArchivements)
  })
  return data
})
const inviteesArchivemnents = computed(() => {
  const data = [] as Array<UserGoodArchivements>
  userInvitees.value.forEach((user) => {
    const userArchivements = archivement.Archivements.Archivements.get(user.UserID)
    data.push({ ...userArchivements, ...{ InviterID: user.InviterID } } as UserGoodArchivements)
  })
  return data
})

const inviteesTableLoading = ref(false)
const invitersTableLoading = ref(false)

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
