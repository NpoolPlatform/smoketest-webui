<script setup lang='ts'>
import { getMessages } from 'src/api/g11n'
import { useAdminAppLangStore, AppLang, useLocaleStore, useAdminMessageStore } from 'npool-cli-v4'
import { onMounted, computed } from 'vue'

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const message = useAdminMessageStore()
const messages = computed(() => message.Messages.Messages)

const locale = useLocaleStore()

onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
  if (messages.value.length === 0) {
    getMessages(0, 500)
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
