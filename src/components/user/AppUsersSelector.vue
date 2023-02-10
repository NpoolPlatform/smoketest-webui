<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayUsers'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_USERS'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
    multiple
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { useAdminUserStore } from 'npool-cli-v4'
import { getUsers } from 'src/api/user'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  ids: string[]
  updating?: boolean
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')
const updating = toRef(props, 'updating')
const target = ref(ids.value)

const user = useAdminUserStore()
const users = computed(() => Array.from(user.Users.Users).map((el) => {
  return {
    value: el.ID,
    label: `${el.EmailAddress} | ${el.PhoneNO}`
  }
}))
const displayUsers = ref(users.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayUsers.value = users.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:ids', ids: string[]): void}>()
const onUpdate = () => {
  emit('update:ids', target.value)
}

onMounted(() => {
  if (users.value.length === 0) {
    getUsers(0, 500)
  }
})
</script>
