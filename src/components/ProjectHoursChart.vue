<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-wrap">
        <span class="chart-dot"></span>
        <h3 class="chart-title">Project Hours</h3>
      </div>
      <p class="chart-sub">各项目累计工时统计</p>
    </div>
    <div ref="chartRef" class="chart-body"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: true }
})

const chartRef = ref(null)
let chartInstance = null

const buildOption = (data, dark) => {
  const sorted = [...data].sort((a, b) => b.hours - a.hours)
  const projects = sorted.map(d => d.project)
  const hours = sorted.map(d => d.hours)
  const maxHours = Math.max(...hours, 1)

  const tooltipBg    = dark ? 'rgba(13,20,40,0.95)'    : 'rgba(255,255,255,0.97)'
  const tooltipBorder= dark ? 'rgba(245,158,11,0.3)'   : 'rgba(245,158,11,0.35)'
  const tooltipText  = dark ? '#e2e8f0'                 : '#1e293b'
  const tooltipSub   = dark ? '#64748b'                 : '#94a3b8'
  const axisLabel    = dark ? '#334155'                 : '#94a3b8'
  const splitLine    = dark ? 'rgba(255,255,255,0.04)'  : 'rgba(0,0,0,0.06)'
  const barLabel     = dark ? '#475569'                 : '#94a3b8'

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText, fontSize: 13, fontFamily: 'inherit' },
      padding: [10, 14],
      formatter: (params) => {
        const p = params[0]
        return `<div style="color:${tooltipSub};font-size:11px;margin-bottom:4px">${p.name}</div>` +
               `<div style="color:#f59e0b;font-weight:700;font-size:18px">${p.value}<span style="font-size:12px;margin-left:2px;color:${tooltipSub}">hrs</span></div>`
      }
    },
    grid: { top: 20, right: 20, bottom: 72, left: 48 },
    xAxis: {
      type: 'category',
      data: projects,
      axisLine: { lineStyle: { color: splitLine } },
      axisTick: { show: false },
      axisLabel: {
        color: axisLabel,
        fontSize: 11,
        interval: 0,
        rotate: projects.length > 5 ? 35 : 0,
        margin: 12,
        formatter: (val) => val.length > 10 ? val.substring(0, 10) + '…' : val
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: splitLine, type: 'dashed' } },
      axisLabel: { color: axisLabel, fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: hours.map((h) => ({
        value: h,
        itemStyle: {
          borderRadius: [6, 6, 2, 2],
          color: h >= maxHours * 0.8
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f59e0b' },
                { offset: 1, color: dark ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.35)' }
              ])
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: dark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)' }
              ])
        }
      })),
      barMaxWidth: 36,
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fbbf24' },
            { offset: 1, color: dark ? 'rgba(251,191,36,0.3)' : 'rgba(251,191,36,0.4)' }
          ])
        }
      },
      label: {
        show: true, position: 'top',
        color: barLabel, fontSize: 11, fontWeight: '600',
        formatter: '{c}h'
      }
    }]
  }
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value, null, { renderer: 'canvas' })
  chartInstance.setOption(buildOption(props.data, props.isDark))
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
  chartInstance?.setOption(buildOption(val, props.isDark), true)
}, { deep: true })

watch(() => props.isDark, (val) => {
  chartInstance?.setOption(buildOption(props.data, val), true)
})
</script>

<style scoped>
.chart-card {
  background: var(--dash-card, rgba(13,20,40,0.72));
  border: 1px solid var(--dash-card-border, rgba(255,255,255,0.06));
  border-radius: 14px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background 0.4s, border-color 0.4s;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.chart-title-wrap { display: flex; align-items: center; gap: 8px; }
.chart-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59,130,246,0.5);
}
.chart-title {
  font-size: 14px; font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  margin: 0; letter-spacing: 0.5px;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  transition: color 0.3s;
}
.chart-sub {
  font-size: 11px;
  color: var(--text-muted, #334155);
  margin: 0; letter-spacing: 0.5px;
  transition: color 0.3s;
}
.chart-body { flex: 1; min-height: 0; }
</style>
