<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDetailStore } from '@/stores/detail.store'
import { modifyMonthId, toMonthId, toMonthLabel } from '@/helpers/date.helper'
import PaymentInfo from '@/components/PaymentInfo.vue'
import type { IPayment } from '@/models/payment.interface'
import VgChartPie from '@/components/ui/VgChartPie.vue'
import { useGlobalStore } from '@/stores/global.store'
import VgIconBack from '@/components/ui/icons/VgIconBack.vue'
import VgIconNext from '@/components/ui/icons/VgIconNext.vue'
import type { PieChartData } from '@/helpers/chart.helper'
import NewPaymentView from "@/views/NewPaymentView.vue";
import VgButton from "@/components/ui/VgButton.vue";
import { usePopupStore } from "@/stores/popup.store";

const store = useDetailStore()
const globalStore = useGlobalStore()
const popup = usePopupStore()

const cleanDate = computed<string>(() => store.monthId ? toMonthLabel(store.monthId) : '')

const sortedPayments = computed<IPayment[]>(() => {
  return [...store.payments].sort((a, b) => `${a.dayId}-${a.createdAt}` > `${b.dayId}-${b.createdAt}` ? -1 : 1)
})

const pieData = computed<PieChartData>(() => {
  const month = store.month
  if (!month) {
    return []
  }
  return Object.keys(month.totals).reduce((carry, categoryId) => {
    carry.push({
      label: globalStore.getCategory(categoryId)?.label ?? 'Other',
      value: month.totals[categoryId]
    })
    return carry
  }, <PieChartData>[])
})

const canGoNext = computed<boolean>(() => !!store.monthId && (store.monthId < toMonthId(new Date())))
const canGoBack = computed<boolean>(() => !!store.monthId)

function changeMonth (modifier: 1 | -1) {
  store.loadMonth(modifyMonthId(store.monthId ?? '', modifier))
}

onMounted(() => {
  store.loadMonth(toMonthId(new Date()))
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="selector">
        <VgIconBack v-show="canGoBack" @click="changeMonth(-1)" />
        {{ cleanDate }}
        <VgIconNext v-show="canGoNext" @click="changeMonth(1)" />
      </div>
      <div class="chart-container">
        <VgChartPie :data="pieData" position="bottom"/>
      </div>
      <div class="cta-container">
        <VgButton @click="popup.openPopup(NewPaymentView)">Add payment</VgButton>
      </div>
    </div>
    <div class="payments" v-if="sortedPayments.length">
      <PaymentInfo v-for="payment of sortedPayments" :key="payment.id" :payment="payment" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/styles/colors";
@import "src/styles/breakpoints";

.page-container {
  max-width: $breakpoint-s;
  margin: 0 auto;
  padding-bottom: 32px;
}

.page-header {
  background: $white;
  padding: 24px 28px;
  .selector {
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-columns: 32px 1fr 32px;
    max-width: 350px;
    margin: 0 auto;
    padding-bottom: 16px;

    svg {
      cursor: pointer;
    }
  }
}

.chart-container {
  max-width: $breakpoint-xs;
  margin: 0 auto;
}

.cta-container {
  display: none;
  align-items: center;
  justify-content: center;
  max-width: $breakpoint-xs;
  margin: 0 auto;
  padding-top: 32px;
}

.payments {
  margin-top: 16px;
}

@media screen and (min-width: $breakpoint-s) {
  .cta-container {
    display: flex;
  }

  .page-header {
    margin-top: 16px;
  }

  .payments, .page-header {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
