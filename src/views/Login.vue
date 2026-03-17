<template>
  <div class="login-wrapper">
    <!-- Background decoration -->
    <div class="bg-grid"></div>
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="login-card">
      <div class="card-header">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB"/>
            <path d="M8 12h16M8 16h10M8 20h13" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="title">工单管理系统</h1>
        <p class="subtitle">请登录您的账号以继续</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="密码"
            size="large"
            type="password"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe" label="记住我" />
        </div>

        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="login-btn"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>

      <div class="demo-accounts">
        <p class="demo-label">演示账号</p>
        <div class="account-list">
          <div class="account-item" @click="fillAccount('admin', 'admin123')">
            <el-tag type="danger" size="small" effect="plain">管理员</el-tag>
            <span>admin / admin123</span>
          </div>
          <div class="account-item" @click="fillAccount('user', 'user123')">
            <el-tag type="info" size="small" effect="plain">普通用户</el-tag>
            <span>user / user123</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 模拟账号
const accounts = {
  admin: { password: 'admin123', role: 'admin', name: '管理员' },
  user:  { password: 'user123',  role: 'user',  name: '普通用户' }
}

const fillAccount = (username, password) => {
  form.username = username
  form.password = password
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true

    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    const account = accounts[form.username]
    if (account && account.password === form.password) {
      // 存储登录状态
      const userInfo = { username: form.username, role: account.role, name: account.name }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      ElMessage.success(`欢迎回来，${account.name}！`)
      // 跳转到工单列表（路由可按需修改）
      router.push('/dashboard')
    } else {
      ElMessage.error('用户名或密码错误')
    }

    loading.value = false
  })
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 背景装饰 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}
.c1 {
  width: 400px; height: 400px;
  background: #bfdbfe;
  top: -100px; left: -100px;
}
.c2 {
  width: 300px; height: 300px;
  background: #ddd6fe;
  bottom: -50px; right: -50px;
}

/* 卡片 */
.login-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px 32px;
  width: 380px;
  box-shadow: 0 4px 24px rgba(37, 99, 235, 0.1), 0 1px 4px rgba(0,0,0,0.06);
}

/* 头部 */
.card-header {
  text-align: center;
  margin-bottom: 28px;
}
.logo {
  display: inline-flex;
  margin-bottom: 12px;
}
.title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
  letter-spacing: 1px;
}
.subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* 表单 */
.login-form {
  margin-top: 4px;
}
.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  transition: box-shadow 0.2s;
}
.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #93c5fd inset;
}
.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #3b82f6 inset !important;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -4px 0 16px;
}

.login-btn {
  width: 100%;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
  height: 44px;
  background: #2563eb;
  border-color: #2563eb;
  transition: background 0.2s, transform 0.1s;
}
.login-btn:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}
.login-btn:active {
  transform: scale(0.99);
}

/* 演示账号 */
.demo-accounts {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
}
.demo-label {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 10px;
  text-align: center;
}
.account-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.account-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #475569;
  transition: background 0.15s;
}
.account-item:hover {
  background: #eff6ff;
  color: #2563eb;
}
.account-item span {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>