<template>
  <div class='row'>
    <q-btn-dropdown
      dense
      flat
      :icon='internet'
      :dropdown-icon='downArrow'
      text-color='white'
      size='12px'
    >
      <template #label>
        <div class='label'>
          {{ langLabel }}
        </div>
      </template>
      <q-list class='langs'>
        <q-item
          class='item'
          dense
          v-close-popup
          v-for='myLang in langs'
          :key='myLang.ID'
          clickable
          @click='onLangItemClick(myLang)'
        >
          <q-item-section>
            <div class='row'>
              <q-img fit='contain' class='icon' :src='myLang.Logo' />
              <q-item-label dense>
                {{ myLang.Name }}
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang='ts'>
import { useAdminAppLangStore, AppLang, useLocaleStore } from 'npool-cli-v4'
import { ref, computed, defineProps, withDefaults, toRef, defineEmits, onMounted } from 'vue'

interface Props {
  language?: AppLang
  emitResult?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: undefined,
  emitResult: false
})
const emitResult = toRef(props, 'emitResult')

const downArrow = ref('img: icons/DownArrow.svg')
const internet = ref('img: icons/Internet.svg')

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const locale = useLocaleStore()
const langLabel = computed(() => locale.AppLang?.Short !== '' ? locale.AppLang?.Short : locale.AppLang.Lang)

const emit = defineEmits<{(e: 'update:language', language: AppLang): void}>()

const onLangItemClick = (language: AppLang) => {
  if (emitResult.value) {
    emit('update:language', language)
    return
  }
  locale.setLang(language)
}

onMounted(() => {
  if (emitResult.value && locale.AppLang) {
    emit('update:language', locale.AppLang)
  }
})

</script>

<style lang='sass' scoped>
.label
  font-size: 18px
  margin-left: 6px
  line-height: 24px

.langs
  background-color: $primary

.item:hover
  background-color: $secondary

.icon
  width: 24px
  margin-right: 10px
</style>
