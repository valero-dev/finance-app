<script setup lang="ts">
import VgChartBar from '@/components/ui/VgChartBar.vue'
import { computed, onMounted } from 'vue'
import { toMonthLabel } from '@/helpers/date.helper'
import type { IMonth } from '@/models/month.interface'
import { usePredictionsStore } from '@/stores/predictions.store'
import VgCard from '@/components/ui/VgCard.vue'

const store = usePredictionsStore()

const chartData = computed(() => {
  return [
    toChart(store.actual),
    ...store.predictions.map(m => toChart(m, true))
  ]
})

function toChart (month: IMonth, predicted: boolean = false) {
  return {
    label: toMonthLabel(month.monthId),
    up: month.income,
    down: month.outcome,
    predicted
  }
}

onMounted(() => {
  store.init()
})

</script>

<template>
  <div class="page-wrapper">
    <VgCard>
      <VgChartBar :data="chartData" />
    </VgCard>
  </div>
</template>

<style scoped lang="scss">
@import "src/styles/breakpoints";

.page-wrapper {
  max-width: $breakpoint-s;
  margin: 0 auto;
}
</style>
