<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :loading='goodLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedGood'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_PROMOTIONS")'
    :rows='promotions'
    row-key='ID'
    :loading='promotionLoading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Promotion)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_PROMOTION') }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ selectedGood[0]?.Title }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input type='number' v-model='target.Price' :label='$t("MSG_PRICE")' />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='date' v-model='end' :label='$t("MSG_END")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { buildGoods, NotificationType, useAdminGoodStore, useGoodStore, Promotion, GoodBase } from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useGoodStore()
const adminGood = useAdminGoodStore()
const goods = computed(() => buildGoods(good.Goods))
const goodLoading = ref(true)

const promotions = computed(() => good.Promotions)
const promotionLoading = ref(true)
const selectedGood = ref([] as Array<GoodBase>)

const target = ref({} as unknown as Promotion)

const selectedGoodID = computed(() => selectedGood.value[0]?.ID)
watch(selectedGoodID, () => {
  target.value.GoodID = selectedGoodID.value as string
})
const start = ref('')
watch(start, () => {
  target.value.Start = new Date(start.value).getTime() / 1000
})
const end = ref('')
watch(end, () => {
  target.value.End = new Date(end.value).getTime() / 1000
})

onMounted(() => {
  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    goodLoading.value = false
  })

  good.getPromotions({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    promotionLoading.value = false
  })
})

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  if (selectedGood.value.length === 0) {
    return
  }

  updating.value = false
  showing.value = true
}

const onRowClick = (promotion: Promotion) => {
  updating.value = true
  showing.value = true
  target.value = promotion
  selectedGood.value = [good.getGoodByID(promotion.GoodID).Good.Good]
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    adminGood.updatePromotion({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_PROMOTIONS'),
          Message: t('MSG_UPDATE_PROMOTIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  adminGood.createPromotion({
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_PROMOTIONS'),
        Message: t('MSG_UPDATE_PROMOTIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as unknown as Promotion
}

</script>
