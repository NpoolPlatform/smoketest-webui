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
import { ref, computed, defineProps, withDefaults, toRef, defineEmits } from 'vue'
import { Language, useLangStore, useLocaleStore } from 'npool-cli-v2'

interface Props {
  language?: Language
  emitResult?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: undefined,
  emitResult: false
})
const emitResult = toRef(props, 'emitResult')

const downArrow = ref('img: icons/DownArrow.svg')
const internet = ref('img: icons/Internet.svg')

const lang = useLangStore()
const locale = useLocaleStore()
const langs = computed(() => locale.Languages)
const langLabel = computed(() => locale.CurLang?.Short !== '' ? locale.CurLang?.Short : locale.CurLang.Lang)

const emit = defineEmits<{(e: 'update:language', language: Language): void}>()

const onLangItemClick = (language: Language) => {
  if (emitResult.value) {
    emit('update:language', language)
    return
  }
  lang.setLang(language)
}

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
