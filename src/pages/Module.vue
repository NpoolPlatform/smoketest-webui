<template>
  <div class='column justify-center'>
    <q-table
      dense
      flat
      :title='$t("MSG_MODULES")'
      row-key='ID'
      :rows='modules'
      :columns='(moduleColumns as never)'
      :rows-per-page-options='[15]'
    >
      <template #top-right>
        <div class='row items-end'>
          <q-input :label='$t("MSG_MODULE")' v-model='domain' dense />
          <q-btn dense class='btn' @click='onCreateModuleClick'>
            {{ $t('MSG_CREATE_MODULE') }}
          </q-btn>
        </div>
      </template>
    </q-table>
  </div>
  <q-dialog
    v-model='showing'
    @hide='onModuleMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_MODULE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-toggle label='User Define Module' v-model='userDefine' />
        <q-select
          v-if='!userDefine'
          filled
          dense
          v-model='name'
          use-input
          input-debounce='0'
          @new-value='onCreateNewModule'
          :options='domains'
          :multiple='false'
        />
        <q-input
          v-else
          v-model='name'
          suffix='.npool.top'
          label='Module Name'
        />
        <q-input
          v-model='target.Description'
          :label='$t("MSG_DESCRIPTION")'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onModuleSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onModuleCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Module, useLocalAPIStore, useModuleStore } from 'src/localstore'
import { NotifyType } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const moduleColumns = computed(() => [
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: (row: Module) => row.Name
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    align: 'left',
    field: (row: Module) => row.ID
  },
  {
    name: 'Description',
    label: t('MSG_DESCRIPTION'),
    align: 'left',
    field: (row: Module) => row.Description
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    align: 'left',
    field: (row: Module) => row.CreatedAt
  }
])

const target = ref({} as Module)
const showing = ref(false)
const name = ref('')
const module = useModuleStore()
const modules = computed(() => module.Modules.filter((el) => el.Name.includes(domain.value) && el.Name.includes(name.value)))

const apis = useLocalAPIStore()
const domains = ref([] as Array<string>)
const domain = ref('npool.top')
const userDefine = ref(false)

const fetchDomains = () => {
  apis.getDomains({
    Message: {
      Error: {
        Title: 'MSG_GET_DOMAINS',
        Message: 'MSG_GET_DOMAINS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const fetchModules = (offset: number, limit: number) => {
  module.getModules({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_MODULES',
        Message: 'MSG_GET_MODULES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  fetchDomains()
  fetchModules(0, 100)
})

const onCreateModuleClick = () => {
  showing.value = true
  domains.value = apis.Domains.filter((el) => {
    return modules.value.findIndex((v) => v.Name === el) < 0 && el.includes('npool.top')
  })
}

const onModuleMenuHide = () => {
  showing.value = false
}

const onModuleSubmit = () => {
  showing.value = false
  if (!name.value.length) return
  if (userDefine.value) {
    target.value.Name = name.value + '.npool.top'
  } else {
    target.value.Name = name.value
  }

  module.createModule({
    Name: target.value.Name,
    Description: target.value.Description,
    Message: {
      Error: {
        Title: 'MSG_CREATE_MODULE',
        Message: 'MSG_CREATE_MODULE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    name.value = ''
  })
}

const onModuleCancel = () => {
  showing.value = false
  name.value = ''
  target.value = {} as Module
}

const onCreateNewModule = (val: string, done: (item?: unknown, mode?: 'add' | 'add-unique' | 'toggle' | undefined) => void) => {
  if (val.length > 0 && !apis.Domains.includes(val)) {
    apis.Domains.push(val)
  }
  done(val, 'toggle')
}

</script>

<style lang='sass' scoped>
.filter
  min-width: 220px
</style>
