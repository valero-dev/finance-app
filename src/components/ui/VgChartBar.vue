<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Chart } from 'chart.js'
import { BarChartData, barChartOptions, parseBarChartData } from '@/helpers/chart.helper'

const props = defineProps<{
  data: BarChartData
}>()

const canvasRef = ref<HTMLCanvasElement>()
let chart: Chart

onMounted(() => {
  const { labels, datasets } = parseBarChartData(props.data)
  chart = new Chart(
    <HTMLCanvasElement>canvasRef.value,
    {
      type: 'bar',
      options: barChartOptions,
      data: {
        labels,
        datasets
      }
    }
  )
})

onUnmounted(() => {
  chart.destroy()
})

watch(() => props.data, (newData: BarChartData) => {
  const { labels, datasets } = parseBarChartData(newData)
  chart.data.labels = labels
  chart.data.datasets = datasets
  chart.update()
})

</script>

<template>
  <div class="chart-container bar-chart">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped lang="scss">
@import "VgChart";
</style>
