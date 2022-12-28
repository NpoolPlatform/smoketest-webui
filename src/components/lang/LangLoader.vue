<script setup lang='ts'>
import { getMessages } from 'src/api/g11n'
import { useAdminAppLangStore, AppLang, useFrontendMessageStore, useLocaleStore } from 'npool-cli-v4'
import { onMounted, computed, watch } from 'vue'

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const message = useFrontendMessageStore()
const messages = computed(() => message.getMessagesByLangID(locale?.AppLang?.LangID))

const locale = useLocaleStore()
const langID = computed(() => locale.AppLang?.LangID)

watch(langID, () => {
  if (messages.value.length === 0) {
    getMessages(0, 500)
  }
})

onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
  if (messages.value.length === 0) {
    getMessages(0, 100)
  }
})

const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
    }
  }, (error: boolean, rows: Array<AppLang>) => {
    if (error || rows.length === 0) {
      if (!error) {
        locale.setLangs(langs.value)
      }
      return
    }
    getAppLangs(offset + limit, limit)
  })
}
</script>
