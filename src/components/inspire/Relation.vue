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
    :columns='uColumns'
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
    :rows='inviteeArchivements'
    :loading='loading'
  >
    <template #top-right>
      <div class='row indent flat'>
        <select class='order-type' name='order-type' v-model='currentKolState'>
          <option v-for='item in KOLOptions' :key='item.Label' :value='item'>
            {{ item.Label }}
          </option>
        </select>
      </div>
    </template>
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
        <q-td key='Kol' :props='props'>
          {{ props.row.Kol }}
        </q-td>
        <q-td key='TotalInvitees' :props='props'>
          {{ props.row.TotalInvitees }}
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
    :rows='inviterArchivements'
    :columns='(columns as never)'
    :loading='loading'
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
        <q-td key='Kol' :props='props'>
          {{ props.row.Kol }}
        </q-td>
        <q-td key='TotalInvitees' :props='props'>
          {{ props.row.TotalInvitees }}
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
  <RegistrationCard />
</template>
<script setup lang='ts'>
import {
  PriceCoinName
} from 'npool-cli-v2'
import { formatTime, NotifyType, useAdminArchivementStore, useAdminUserStore, User, useAdminRegistrationStore, InvalidID, UserArchivement } from 'npool-cli-v4'
import { getUsers } from 'src/api/user'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const RegistrationCard = defineAsyncComponent(() => import('src/components/inspire/Registration.vue'))

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)

const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => {
  return user.ID?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
}))

const selectedUser = ref([] as Array<User>)
const curUserID = computed(() => selectedUser.value.length ? selectedUser.value[0].ID : InvalidID)

const regInvitation = useAdminRegistrationStore()
const inviteeIDs = computed(() => regInvitation.inviteeIDs(curUserID.value))

const _userInviters = ref([] as Array<string>)
const getInviterIDs = (userID: string) => {
  userInviters.value.push(userID)
  const root = regInvitation.Registrations.Registrations.find(item => item.InviteeID === userID)
  if (!root) {
    return userInviters.value
  }
  getInviterIDs(root.InviterID)
}
const userInviters = computed(() => _userInviters.value)

const archivement = useAdminArchivementStore()
const archivements = computed(() => archivement.getArchivementByUserID(curUserID.value))
const inviteeArchivements = computed(() => {
  let _data = archivement.inviteeArchivements(curUserID.value)
  if (currentKolState.value.Label !== 'ALL') {
    _data = _data.filter((el) => el.Kol === currentKolState.value.Value)
  }
  return _data
})

const _inviterArchivements = computed(() => archivement.inviterArchivements(curUserID.value))
const inviterArchivements = computed(() => {
  let _data = [] as Array<UserArchivement>
  userInviters.value.forEach((ID) => {
    const data = _inviterArchivements.value.find((el) => el.UserID === ID)
    if (data) {
      _data.push(data)
    }
  })
  if (currentKolState.value.Label !== 'ALL') {
    _data = _data.filter((el) => el.Kol === currentKolState.value.Value)
  }
  return _data
})

const loading = ref(false)

watch(curUserID, () => {
  if (curUserID.value === InvalidID) {
    return
  }
  _userInviters.value = []
  getInviterIDs(curUserID.value)
  if (archivements.value.length === 0) {
    loading.value = true
    getUserArchivements(0, 500, curUserID.value)
  }
})

const getUserArchivements = (offset: number, limit: number, key: string) => {
  archivement.getUserGoodArchivements({
    UserIDs: inviteeIDs.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOD_ARCHIVEMENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, key, (error: boolean, rows: Array<UserArchivement>) => {
    loading.value = false
    if (error || rows.length < limit) {
      return
    }
    getUserArchivements(offset + limit, limit, key)
  })
}

interface KOLOption {
  Label: string;
  Value: boolean;
}

const KOLOptions = ref([
  {
    Label: 'ALL',
    Value: true
  },
  {
    Label: 'KOL',
    Value: true
  },
  {
    Label: 'NOT KOL',
    Value: false
  }
] as Array<KOLOption>)
const currentKolState = ref(KOLOptions.value[0])

onMounted(() => {
  if (user.Users.Users.length === 0) {
    getUsers(0, 500)
  }
})

const uColumns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles?.join(',')
  },
  {
    name: 'IDNUMBER',
    label: t('MSG_IDNUMBER'),
    field: (row: User) => row.IDNumber
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])

const columns = [
  { name: 'UserID', label: 'USERID', field: 'UserID', align: 'center' },
  { name: 'InviterID', label: 'INVITERID', field: 'InviterID', align: 'center' },
  { name: 'EmailAddress', label: 'EMAILADRESS', field: 'EmailAddress', align: 'center' },
  { name: 'PhoneNO', label: 'PHONENO', field: 'PhoneNO', align: 'center' },
  { name: 'Kol', label: 'KOL', field: 'Kol', align: 'center', sortable: true },
  { name: 'TotalInvitees', label: 'TOTALINVITEES', field: 'TotalInvitees', align: 'center', sortable: true },
  { name: 'Archivements', label: 'PROFIT', field: 'Archivements', align: 'center' }
]
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

select
  border: none
  outline: none

</style>
