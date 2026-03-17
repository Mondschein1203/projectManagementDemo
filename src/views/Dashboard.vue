<template>
  <div class="dashboard">
    <!-- 顶部导航 -->
    <header class="topbar">
      <div class="topbar-left">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB"/>
            <path d="M8 12h16M8 16h10M8 20h13" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="logo-text">工单管理系统</span>
      </div>
      <div class="topbar-right">
        <el-tag :type="isAdmin ? 'danger' : 'info'" size="small" effect="plain" class="role-tag">
          {{ isAdmin ? '管理员' : '普通用户' }}
        </el-tag>
        <span class="username">{{ userInfo.name }}</span>
        <el-button text size="small" class="logout-btn" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          退出
        </el-button>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 左侧表格 -->
      <section class="table-section">
        <div class="section-header">
          <h2 class="section-title">工单列表</h2>
          <span class="record-count">共 {{ tableData.length }} 条</span>
        </div>

        <el-table
          :data="tableData"
          class="project-table"
          stripe
          :header-cell-style="headerStyle"
        >
          <el-table-column prop="id" label="ID" width="60" align="center">
            <template #default="{ row }">
              <span class="id-cell">#{{ row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="project" label="Project" min-width="130">
            <template #default="{ row }">
              <span class="project-name">{{ row.project }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="overtime" label="Overtime" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.overtime ? 'danger' : 'success'"
                size="small"
                effect="light"
              >
                {{ row.overtime ? 'Yes' : 'No' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="hours" label="Hours" width="80" align="center">
            <template #default="{ row }">
              <span class="hours-cell">{{ row.hours }}h</span>
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="Created At" width="110" align="center">
            <template #default="{ row }">
              <span class="date-cell">{{ row.createdAt }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="isAdmin" label="操作" width="80" align="center">
            <template #default="{ row }">
              <el-button
                type="danger"
                size="small"
                text
                @click="handleDelete(row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- 右侧图表 -->
      <section class="chart-section">
        <ProjectHoursChart :data="chartData" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete, SwitchButton } from '@element-plus/icons-vue'
import ProjectHoursChart from '@/components/ProjectHoursChart.vue'

const router = useRouter()

// 当前登录用户
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const isAdmin = computed(() => userInfo.role === 'admin')

// 表格数据
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

// 图表数据：按项目累计工时
const chartData = computed(() => {
  const map = {}
  tableData.value.forEach(row => {
    map[row.project] = (map[row.project] || 0) + row.hours
  })
  return Object.entries(map).map(([project, hours]) => ({ project, hours }))
})

// 表头样式
const headerStyle = {
  background: '#f8fafc',
  color: '#475569',
  fontWeight: '600',
  fontSize: '13px'
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除工单 #${row.id}（${row.project}）吗？`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(() => {
    const idx = tableData.value.findIndex(r => r.id === row.id)
    if (idx !== -1) tableData.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('userInfo')
    router.replace('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f0f4ff;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 顶部导航 */
.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8edf5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.role-tag {
  font-size: 12px;
}
.username {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}
.logout-btn {
  color: #94a3b8 !important;
  font-size: 13px;
}
.logout-btn:hover {
  color: #ef4444 !important;
}

/* 主体 */
.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  min-height: 0;
}

/* 左侧表格 */
.table-section {
  flex: 0 0 50%;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(37,99,235,0.06);
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.record-count {
  font-size: 12px;
  color: #94a3b8;
}

/* 表格样式 */
.project-table {
  flex: 1;
}
.project-table :deep(.el-table__row) {
  transition: background 0.15s;
}
.id-cell {
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
}
.project-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 13px;
}
.hours-cell {
  font-weight: 600;
  color: #2563eb;
  font-size: 13px;
}
.date-cell {
  font-size: 12px;
  color: #64748b;
}

/* 右侧图表 */
.chart-section {
  flex: 0 0 50%;
  width: auto;  /* 覆盖原来的固定宽度 */
}
</style>