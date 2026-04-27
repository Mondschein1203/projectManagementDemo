<template>
  <div class="dashboard">
    <div class="dash-orb dash-orb-1"></div>
    <div class="dash-orb dash-orb-2"></div>
    <div class="dash-grid"></div>

    <!-- 顶部导航 -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          <div class="logo-mark">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#dashLogoGrad)"/>
              <path d="M8 11h16M8 16h11M8 21h13" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
              <defs>
                <linearGradient id="dashLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#d97706"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">工单管理系统</span>
          <span class="logo-sep hide-mobile"></span>
          <span class="logo-sub hide-mobile">Dashboard</span>
        </div>

        <div class="topbar-right">
          <!-- 主题切换按钮 -->
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换浅色模式' : '切换深色模式'">
            <span>{{ isDark ? '☀️' : '🌙' }}</span>
            <span class="theme-label hide-mobile">{{ isDark ? '浅色' : '深色' }}</span>
          </button>

          <div class="user-info">
            <div class="user-avatar">{{ userInfo.name?.[0] || 'U' }}</div>
            <div class="user-meta hide-mobile">
              <span class="user-name">{{ userInfo.name }}</span>
              <span class="user-role" :class="isAdmin ? 'role-admin' : 'role-user'">
                {{ isAdmin ? 'Administrator' : 'User' }}
              </span>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span class="hide-mobile">退出</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主体 -->
    <main class="main-content">
      <!-- 统计卡片 -->
      <div class="stats-row">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon" :style="{ color: stat.color, background: stat.bg }">
            <el-icon :size="18"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
          <div class="stat-glow" :style="{ background: stat.color }"></div>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content-grid">
        <section class="table-section">
          <div class="section-header">
            <div class="section-title-wrap">
              <span class="section-dot"></span>
              <h2 class="section-title">工单列表</h2>
            </div>
            <span class="record-badge">{{ tableData.length }} 条记录</span>
          </div>

          <div class="table-wrap">
            <el-table
              :data="tableData"
              class="project-table"
              :header-cell-style="headerStyle"
              :row-class-name="rowClass"
            >
              <el-table-column prop="id" label="ID" width="60" align="center">
                <template #default="{ row }"><span class="id-cell">#{{ row.id }}</span></template>
              </el-table-column>
              <el-table-column prop="project" label="Project" min-width="140">
                <template #default="{ row }"><span class="project-name">{{ row.project }}</span></template>
              </el-table-column>
              <el-table-column prop="overtime" label="Overtime" width="100" align="center">
                <template #default="{ row }">
                  <span class="overtime-badge" :class="row.overtime ? 'ot-yes' : 'ot-no'">{{ row.overtime ? 'Yes' : 'No' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="hours" label="Hours" width="80" align="center">
                <template #default="{ row }">
                  <span class="hours-cell" :class="{ 'hours-high': row.hours >= 12 }">{{ row.hours }}h</span>
                </template>
              </el-table-column>
              <el-table-column prop="createdAt" label="Created At" width="110" align="center">
                <template #default="{ row }"><span class="date-cell">{{ row.createdAt }}</span></template>
              </el-table-column>
              <el-table-column v-if="isAdmin" label="操作" width="90" align="center">
                <template #default="{ row }">
                  <button class="delete-btn" @click="handleDelete(row)">
                    <el-icon><Delete /></el-icon>删除
                  </button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </section>

        <section class="chart-section">
          <ProjectHoursChart :data="chartData" :isDark="isDark" />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete, SwitchButton, Tickets, Timer, WarningFilled, DataAnalysis } from '@element-plus/icons-vue'
import ProjectHoursChart from '@/components/ProjectHoursChart.vue'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { isDark, toggleTheme, initTheme } = useTheme()
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const isAdmin = computed(() => userInfo.role === 'admin')

onMounted(() => initTheme())

const tableData = ref([
  { id: 1,  project: 'Alpha Platform',    overtime: false, hours: 8,  createdAt: '2025-01-03' },
  { id: 2,  project: 'Beta Pipeline',     overtime: true,  hours: 12, createdAt: '2025-01-05' },
  { id: 3,  project: 'Gamma Dashboard',   overtime: false, hours: 6,  createdAt: '2025-01-07' },
  { id: 4,  project: 'Delta Service',     overtime: true,  hours: 10, createdAt: '2025-01-09' },
  { id: 5,  project: 'Epsilon Monitor',   overtime: false, hours: 7,  createdAt: '2025-01-11' },
  { id: 6,  project: 'Zeta Automation',   overtime: true,  hours: 9,  createdAt: '2025-01-13' },
  { id: 7,  project: 'Eta Integration',   overtime: false, hours: 11, createdAt: '2025-01-15' },
  { id: 8,  project: 'Theta Analytics',   overtime: true,  hours: 14, createdAt: '2025-01-17' },
  { id: 9,  project: 'Iota Scheduler',    overtime: false, hours: 5,  createdAt: '2025-01-19' },
  { id: 10, project: 'Kappa Deployment',  overtime: true,  hours: 13, createdAt: '2025-01-21' },
])

const chartData = computed(() => {
  const map = {}
  tableData.value.forEach(row => { map[row.project] = (map[row.project] || 0) + row.hours })
  return Object.entries(map).map(([project, hours]) => ({ project, hours }))
})

const stats = computed(() => [
  { label: '总工单数', value: tableData.value.length, icon: 'Tickets', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { label: '总工时', value: tableData.value.reduce((s, r) => s + r.hours, 0) + 'h', icon: 'Timer', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { label: '加班工单', value: tableData.value.filter(r => r.overtime).length, icon: 'WarningFilled', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { label: '平均工时', value: (tableData.value.reduce((s, r) => s + r.hours, 0) / tableData.value.length).toFixed(1) + 'h', icon: 'DataAnalysis', color: '#10b981', bg: 'rgba(16,185,129,0.12)' }
])

const headerStyle = computed(() => ({
  background: isDark.value ? 'rgba(255,255,255,0.03)' : 'rgba(241,245,249,0.8)',
  color: isDark.value ? '#64748b' : '#475569',
  fontWeight: '600',
  fontSize: '12px',
  letterSpacing: '0.5px',
  borderBottom: isDark.value ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
}))

const rowClass = ({ rowIndex }) => rowIndex % 2 === 0 ? 'row-even' : 'row-odd'

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除工单 #${row.id}（${row.project}）吗？`, '删除确认', {
    confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning', confirmButtonClass: 'el-button--danger'
  }).then(() => {
    const idx = tableData.value.findIndex(r => r.id === row.id)
    if (idx !== -1) tableData.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    localStorage.removeItem('userInfo')
    router.replace('/login')
  }).catch(() => {})
}
</script>

<style scoped>
* { box-sizing: border-box; }

/* ══════════════════════════════
   CSS 变量 — 深色
══════════════════════════════ */
:global([data-theme="dark"]) {
  --dash-bg: #080c18;
  --dash-topbar: rgba(8,12,24,0.88);
  --dash-topbar-border: rgba(255,255,255,0.06);
  --dash-card: rgba(13,20,40,0.72);
  --dash-card-border: rgba(255,255,255,0.06);
  --dash-card-hover-border: rgba(255,255,255,0.12);
  --dash-orb1: rgba(30,64,175,0.2);
  --dash-orb2: rgba(245,158,11,0.1);
  --dash-grid: rgba(245,158,11,0.025);
  --text-primary: #e2e8f0;
  --text-secondary: #64748b;
  --text-muted: #334155;
  --text-table: #94a3b8;
  --text-project: #cbd5e1;
  --text-id: #475569;
  --text-date: #475569;
  --logo-text: #e2e8f0;
  --logo-sep: rgba(255,255,255,0.1);
  --user-info-bg: rgba(255,255,255,0.04);
  --user-info-border: rgba(255,255,255,0.06);
  --theme-btn-bg: rgba(255,255,255,0.06);
  --theme-btn-border: rgba(255,255,255,0.1);
  --theme-btn-color: #94a3b8;
  --logout-border: rgba(255,255,255,0.08);
  --logout-color: #64748b;
  --record-badge-bg: rgba(255,255,255,0.04);
  --record-badge-border: rgba(255,255,255,0.07);
  --record-badge-color: #334155;
  --table-hover: rgba(245,158,11,0.05);
  --table-border: rgba(255,255,255,0.05);
  --row-odd-bg: rgba(255,255,255,0.015);
  --delete-border: rgba(239,68,68,0.2);
  --delete-color: #ef4444;
  --delete-hover-bg: rgba(239,68,68,0.1);
  --delete-hover-border: rgba(239,68,68,0.35);
  --stat-label: #475569;
  --section-dot-shadow: rgba(245,158,11,0.6);
}

/* ══════════════════════════════
   CSS 变量 — 浅色
══════════════════════════════ */
:global([data-theme="light"]) {
  --dash-bg: #f0f4ff;
  --dash-topbar: rgba(255,255,255,0.92);
  --dash-topbar-border: rgba(0,0,0,0.07);
  --dash-card: rgba(255,255,255,0.88);
  --dash-card-border: rgba(0,0,0,0.07);
  --dash-card-hover-border: rgba(0,0,0,0.14);
  --dash-orb1: rgba(59,130,246,0.12);
  --dash-orb2: rgba(245,158,11,0.1);
  --dash-grid: rgba(99,102,241,0.04);
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --text-table: #475569;
  --text-project: #1e293b;
  --text-id: #94a3b8;
  --text-date: #64748b;
  --logo-text: #1e293b;
  --logo-sep: rgba(0,0,0,0.1);
  --user-info-bg: rgba(0,0,0,0.03);
  --user-info-border: rgba(0,0,0,0.07);
  --theme-btn-bg: rgba(0,0,0,0.04);
  --theme-btn-border: rgba(0,0,0,0.1);
  --theme-btn-color: #64748b;
  --logout-border: rgba(0,0,0,0.1);
  --logout-color: #64748b;
  --record-badge-bg: rgba(0,0,0,0.04);
  --record-badge-border: rgba(0,0,0,0.08);
  --record-badge-color: #64748b;
  --table-hover: rgba(245,158,11,0.05);
  --table-border: rgba(0,0,0,0.06);
  --row-odd-bg: rgba(0,0,0,0.02);
  --delete-border: rgba(239,68,68,0.2);
  --delete-color: #ef4444;
  --delete-hover-bg: rgba(239,68,68,0.07);
  --delete-hover-border: rgba(239,68,68,0.3);
  --stat-label: #64748b;
  --section-dot-shadow: rgba(245,158,11,0.4);
}

/* ══════════════════════════════
   布局
══════════════════════════════ */
.dashboard {
  min-height: 100vh;
  background: var(--dash-bg);
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow-x: hidden;
  transition: background 0.4s;
}

.dash-grid {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(var(--dash-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--dash-grid) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none; z-index: 0;
  transition: background-image 0.4s;
}
.dash-orb {
  position: fixed; border-radius: 50%;
  filter: blur(120px); pointer-events: none; z-index: 0;
  transition: background 0.5s;
}
.dash-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, var(--dash-orb1) 0%, transparent 70%); top: -200px; left: -200px; }
.dash-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, var(--dash-orb2) 0%, transparent 70%); bottom: -100px; right: 10%; }

/* ══════════════════════════════
   顶栏
══════════════════════════════ */
.topbar {
  position: sticky; top: 0; z-index: 100;
  background: var(--dash-topbar);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--dash-topbar-border);
  transition: background 0.4s, border-color 0.4s;
}
.topbar-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; height: 58px;
}
.topbar-left { display: flex; align-items: center; gap: 10px; }
.logo-mark {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.25);
  border-radius: 8px;
}
.logo-text { font-size: 15px; font-weight: 700; color: var(--logo-text); letter-spacing: 1px; transition: color 0.3s; }
.logo-sep { width: 1px; height: 16px; background: var(--logo-sep); transition: background 0.3s; }
.logo-sub { font-size: 11px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; transition: color 0.3s; }

.topbar-right { display: flex; align-items: center; gap: 12px; }

/* 主题切换 */
.theme-toggle {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px;
  background: var(--theme-btn-bg);
  border: 1px solid var(--theme-btn-border);
  border-radius: 20px;
  color: var(--theme-btn-color);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  font-family: inherit;
}
.theme-toggle:hover {
  border-color: rgba(245,158,11,0.4);
  transform: scale(1.03);
}
.theme-label { font-size: 12px; font-weight: 500; }

.user-info {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 12px;
  background: var(--user-info-bg);
  border: 1px solid var(--user-info-border);
  border-radius: 10px;
  transition: background 0.3s, border-color 0.3s;
}
.user-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.user-meta { display: flex; flex-direction: column; gap: 1px; }
.user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1; transition: color 0.3s; }
.user-role { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; line-height: 1; }
.role-admin { color: #ef4444; }
.role-user  { color: #6366f1; }

.logout-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid var(--logout-border);
  border-radius: 8px;
  color: var(--logout-color);
  font-size: 13px; cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  font-family: inherit;
}
.logout-btn:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.3); color: #ef4444; }

/* ══════════════════════════════
   主体
══════════════════════════════ */
.main-content {
  position: relative; z-index: 1; flex: 1;
  padding: 20px 28px 28px;
  display: flex; flex-direction: column; gap: 18px;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  position: relative;
  background: var(--dash-card);
  border: 1px solid var(--dash-card-border);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex; align-items: center; gap: 14px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s, background 0.4s;
  backdrop-filter: blur(12px);
}
.stat-card:hover { border-color: var(--dash-card-hover-border); transform: translateY(-2px); }
.stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-body { min-width: 0; }
.stat-value { font-size: 22px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 12px; color: var(--stat-label); transition: color 0.3s; }
.stat-glow { position: absolute; right: -20px; top: -20px; width: 80px; height: 80px; border-radius: 50%; opacity: 0.06; filter: blur(20px); }

/* 内容网格 */
.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; flex: 1; min-height: 0; }

/* 表格区域 */
.table-section {
  background: var(--dash-card);
  border: 1px solid var(--dash-card-border);
  border-radius: 14px; padding: 20px;
  display: flex; flex-direction: column;
  backdrop-filter: blur(12px);
  transition: background 0.4s, border-color 0.4s;
  min-width: 0; /* 阻止撑出 grid 单元格 */
  overflow: hidden;
}
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title-wrap { display: flex; align-items: center; gap: 8px; }
.section-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 8px var(--section-dot-shadow);
  transition: box-shadow 0.3s;
}
.section-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: 0.5px; transition: color 0.3s; }
.record-badge {
  font-size: 11px; color: var(--record-badge-color);
  background: var(--record-badge-bg);
  border: 1px solid var(--record-badge-border);
  padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px;
  transition: all 0.3s;
}

.table-wrap {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 惯性滚动 */
  min-width: 0; /* 阻止 flex 子项撑开父容器 */
}

/* EL Table 主题覆盖 */
.project-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: var(--table-hover);
  --el-table-border-color: var(--table-border);
  --el-table-text-color: var(--text-table);
  background: transparent !important;
}
.project-table :deep(td.el-table__cell),
.project-table :deep(th.el-table__cell) { background: transparent !important; }
.project-table :deep(.el-table__inner-wrapper::before) { background: var(--table-border); }
.project-table :deep(.row-odd td.el-table__cell) { background: var(--row-odd-bg) !important; }

.id-cell { font-size: 11px; color: var(--text-id); font-family: 'Courier New', monospace; font-weight: 600; transition: color 0.3s; }
.project-name { font-weight: 500; color: var(--text-project); font-size: 13px; transition: color 0.3s; }
.overtime-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px; }
.ot-yes { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
.ot-no  { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
.hours-cell { font-weight: 700; color: #3b82f6; font-size: 13px; }
.hours-cell.hours-high { color: #f59e0b; }
.date-cell { font-size: 11px; color: var(--text-date); font-family: 'Courier New', monospace; transition: color 0.3s; }

.delete-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--delete-border);
  border-radius: 6px;
  color: var(--delete-color);
  font-size: 12px; cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  font-family: inherit;
}
.delete-btn:hover { background: var(--delete-hover-bg); border-color: var(--delete-hover-border); }

/* 图表区域 */
.chart-section {
  min-height: 0;
  min-width: 0;
}

/* ══════════════════════════════
   辅助类
══════════════════════════════ */
.hide-mobile { /* 默认显示，移动端隐藏 */ }

/* ══════════════════════════════
   平板 ≤ 900px：内容区改为单列
══════════════════════════════ */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .chart-section {
    height: 360px;
    min-height: 360px;
  }
  .chart-section :deep(.chart-card) { height: 360px; }
  .chart-section :deep(.chart-body) { height: 280px; min-height: 280px; }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ══════════════════════════════
   移动端 ≤ 600px
══════════════════════════════ */
@media (max-width: 600px) {
  /* 隐藏辅助元素 */
  .hide-mobile { display: none !important; }

  /* 导航栏收窄 */
  .topbar-inner {
    padding: 0 14px;
    height: 52px;
  }
  .logo-text { font-size: 13px; letter-spacing: 0.5px; }
  .logo-mark { width: 30px; height: 30px; border-radius: 7px; }

  /* 主题按钮 — 只保留图标 */
  .theme-toggle {
    padding: 6px 8px;
    border-radius: 50%;
    width: 34px; height: 34px;
    justify-content: center;
  }

  /* 退出按钮 — 只保留图标 */
  .logout-btn { padding: 7px 10px; }

  /* 用户头像稍缩小 */
  .user-info { padding: 5px 8px; gap: 0; }
  .user-avatar { width: 26px; height: 26px; font-size: 11px; }

  /* 主体内边距 */
  .main-content { padding: 14px 14px 24px; gap: 14px; }

  /* 统计卡片 2列 */
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .stat-card { padding: 12px 14px; gap: 10px; border-radius: 10px; }
  .stat-icon { width: 34px; height: 34px; border-radius: 8px; }
  .stat-value { font-size: 18px; }
  .stat-label { font-size: 11px; }

  /* 内容区 单列 */
  .content-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  /* 表格区域 */
  .table-section { padding: 14px; border-radius: 12px; }
  .section-title { font-size: 13px; }

  /* 表格字体 */
  .project-name { font-size: 12px; }
  .hours-cell { font-size: 12px; }
  .date-cell { font-size: 10px; }

  /* 图表区域固定高度，避免塌缩 */
  .chart-section { height: 300px; min-height: 300px; }
  .chart-section :deep(.chart-card) { height: 300px; }
  .chart-section :deep(.chart-body) { height: 220px; min-height: 220px; }
}

/* ══════════════════════════════
   超小屏 ≤ 360px
══════════════════════════════ */
@media (max-width: 360px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .stat-value { font-size: 16px; }
  .main-content { padding: 12px 10px 20px; }
  .topbar-inner { padding: 0 10px; }
}
</style>
