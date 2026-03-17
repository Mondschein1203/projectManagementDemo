<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Project Hours Distribution</h3>
      <p class="chart-sub">各项目累计工时统计</p>
    </div>
    <div ref="chartRef" class="chart-body"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // [{ project: 'Project A', hours: 32 }, ...]
  data: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let chartInstance = null

const buildOption = (data) => {
  const sorted = [...data].sort((a, b) => b.hours - a.hours)
  const projects = sorted.map(d => d.project)
  const hours = sorted.map(d => d.hours)

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 13 },
      formatter: (params) => {
        const p = params[0]
        return `<span style="color:#94a3b8">${p.name}</span><br/><b style="color:#60a5fa">${p.value} hrs</b>`
      }
    },
    grid: { top: 16, right: 16, bottom: 40, left: 50 },
    xAxis: {
      type: 'category',
      data: projects,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 12,
        interval: 0,
        rotate: projects.length > 6 ? 30 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'Hours',
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    series: [
      {
        type: 'bar',
        data: hours,
        barMaxWidth: 48,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#93c5fd' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2563eb' },
              { offset: 1, color: '#60a5fa' }
            ])
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#475569',
          fontSize: 11,
          formatter: '{c}h'
        }
      }
    ]
  }
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(buildOption(props.data))
}

const resizeChart = () => chartInstance?.resize()

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

watch(() => props.data, (val) => {
  chartInstance?.setOption(buildOption(val))
}, { deep: true })
</script>

<style scoped>
.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(37,99,235,0.06);
}
.chart-header {
  margin-bottom: 12px;
}
.chart-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px;
  letter-spacing: 0.3px;
}
.chart-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}
.chart-body {
  flex: 1;
  min-height: 0;
}
</style>