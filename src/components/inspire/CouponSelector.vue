<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoupons'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COUPONS'
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
import { NotifyType } from 'npool-cli-v4'
import { useAdminCouponStore } from 'src/teststore/coupon/coupon'
import { CouponType, MyCoupon } from 'src/teststore/coupon/event/types'
import { Coupon, CouponTypes } from 'src/teststore/coupon/coupon/types'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  ids: MyCoupon[]
  updating?: boolean
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')
const updating = toRef(props, 'updating')
const target = ref(ids.value)

const inspire = useAdminCouponStore()
const coupons = computed(() => Array.from(inspire.CouponPools.CouponPools).map((el) => {
  return {
    value: { ID: el.ID, CouponType: el.CouponType },
    label: `${el.CouponType} | ${el.Value} | ${el.Message} | ${el.DurationDays}`
  }
}))
const displayCoupons = ref(coupons.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoupons.value = coupons.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:ids', ids: MyCoupon[]): void}>()
const onUpdate = () => {
  emit('update:ids', target.value)
}

onMounted(() => {
  if (coupons.value.length === 0) {
    CouponTypes.forEach((type) => {
      getCoupons(0, 500, type)
    })
  }
})

const getCoupons = (offset: number, limit: number, type: CouponType) => {
  inspire.getCouponPools({
    Offset: offset,
    Limit: limit,
    CouponType: type,
    Message: {
      Error: {
        Title: 'MSG_GET_COUPONS',
        Message: 'MSG_GET_COUPONS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, resp: Array<Coupon>) => {
    if (error || resp.length < limit) {
      return
    }
    getCoupons(offset + limit, limit, type)
  })
}
</script>
