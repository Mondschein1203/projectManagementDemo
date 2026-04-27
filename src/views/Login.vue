<template>
  <div class="login-wrapper">
    <div class="bg-noise"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-overlay"></div>

    <!-- 主题切换按钮 -->
    <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换浅色' : '切换深色'">
      <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
    </button>

    <div class="login-card" :class="{ 'card-enter': mounted }">
      <div class="card-glow-line"></div>

      <div class="card-header">
        <div class="logo-wrap">
          <div class="logo-ring"></div>
          <svg class="logo-icon" width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
            <path d="M8 11h16M8 16h11M8 21h13" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#d97706"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="title">工单管理系统</h1>
        <p class="subtitle">Project Management Platform</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <div class="input-wrap">
            <span class="input-icon"><el-icon><User /></el-icon></span>
            <el-input v-model="form.username" placeholder="用户名" size="large" clearable class="custom-input" />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-wrap">
            <span class="input-icon"><el-icon><Lock /></el-icon></span>
            <el-input v-model="form.password" placeholder="密码" size="large" type="password" show-password clearable class="custom-input" />
          </div>
        </el-form-item>

        <div class="form-options">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" class="remember-check" />
            <span class="check-box"></span>
            <span class="remember-text">记住我</span>
          </label>
        </div>

        <button class="login-btn" :class="{ loading }" :disabled="loading" @click.prevent="handleLogin">
          <span class="btn-shimmer"></span>
          <span class="btn-text">{{ loading ? '验证中...' : '登 录' }}</span>
          <span class="btn-arrow" v-if="!loading">→</span>
          <span class="btn-spinner" v-else></span>
        </button>
      </el-form>

      <div class="demo-accounts">
        <div class="demo-divider">
          <span class="divider-line"></span>
          <span class="divider-label">快速登录</span>
          <span class="divider-line"></span>
        </div>
        <div class="account-list">
          <div class="account-item" @click="fillAccount('admin', 'admin123')">
            <span class="account-badge admin-badge">ADMIN</span>
            <span class="account-info">admin / admin123</span>
            <span class="account-arrow">↗</span>
          </div>
          <div class="account-item" @click="fillAccount('user', 'user123')">
            <span class="account-badge user-badge">USER</span>
            <span class="account-info">user / user123</span>
            <span class="account-arrow">↗</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)
const mounted = ref(false)
const { isDark, toggleTheme, initTheme } = useTheme()

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const accounts = {
  admin: { password: 'admin123', role: 'admin', name: '管理员' },
  user:  { password: 'user123',  role: 'user',  name: '普通用户' }
}

onMounted(() => {
  initTheme()
  setTimeout(() => { mounted.value = true }, 50)
})

const fillAccount = (username, password) => {
  form.username = username
  form.password = password
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 900))
    const account = accounts[form.username]
    if (account && account.password === form.password) {
      localStorage.setItem('userInfo', JSON.stringify({ username: form.username, role: account.role, name: account.name }))
      ElMessage.success(`欢迎回来，${account.name}！`)
      router.push('/dashboard')
    } else {
      ElMessage.error('用户名或密码错误')
    }
    loading.value = false
  })
}
</script>

<style scoped>
* { box-sizing: border-box; }

/* ══════════════════════════════
   CSS 变量 — 深色主题 (默认)
══════════════════════════════ */
:global([data-theme="dark"]) {
  --bg-base: #080c18;
  --bg-card: rgba(13, 20, 40, 0.85);
  --bg-input: rgba(255,255,255,0.04);
  --bg-input-hover: rgba(255,255,255,0.07);
  --bg-input-focus: rgba(245,158,11,0.06);
  --bg-account: rgba(255,255,255,0.03);
  --bg-account-hover: rgba(245,158,11,0.07);
  --border-card: rgba(255,255,255,0.07);
  --border-input: rgba(255,255,255,0.09);
  --border-input-hover: rgba(245,158,11,0.3);
  --border-input-focus: rgba(245,158,11,0.55);
  --border-account: rgba(255,255,255,0.06);
  --border-account-hover: rgba(245,158,11,0.22);
  --border-divider: rgba(255,255,255,0.07);
  --text-title: #f1f5f9;
  --text-sub: #475569;
  --text-label: #64748b;
  --text-input: #e2e8f0;
  --text-placeholder: #334155;
  --text-account: #475569;
  --text-divider: #334155;
  --orb1: rgba(30,64,175,0.35);
  --orb2: rgba(245,158,11,0.18);
  --orb3: rgba(99,102,241,0.25);
  --grid: rgba(245,158,11,0.03);
  --shadow-card: 0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3);
  --check-border: rgba(255,255,255,0.15);
  --check-bg: rgba(255,255,255,0.04);
  --check-tick: #0d1428;
  --theme-btn-bg: rgba(255,255,255,0.07);
  --theme-btn-border: rgba(255,255,255,0.1);
  --theme-btn-color: #94a3b8;
}

/* ══════════════════════════════
   CSS 变量 — 浅色主题
══════════════════════════════ */
:global([data-theme="light"]) {
  --bg-base: #f0f4ff;
  --bg-card: rgba(255,255,255,0.92);
  --bg-input: rgba(241,245,249,0.9);
  --bg-input-hover: rgba(226,232,240,0.8);
  --bg-input-focus: rgba(245,158,11,0.05);
  --bg-account: rgba(248,250,252,0.9);
  --bg-account-hover: rgba(245,158,11,0.06);
  --border-card: rgba(0,0,0,0.07);
  --border-input: rgba(0,0,0,0.1);
  --border-input-hover: rgba(245,158,11,0.45);
  --border-input-focus: rgba(245,158,11,0.65);
  --border-account: rgba(0,0,0,0.07);
  --border-account-hover: rgba(245,158,11,0.3);
  --border-divider: rgba(0,0,0,0.07);
  --text-title: #1e293b;
  --text-sub: #64748b;
  --text-label: #64748b;
  --text-input: #1e293b;
  --text-placeholder: #94a3b8;
  --text-account: #475569;
  --text-divider: #94a3b8;
  --orb1: rgba(59,130,246,0.18);
  --orb2: rgba(245,158,11,0.14);
  --orb3: rgba(99,102,241,0.12);
  --grid: rgba(99,102,241,0.04);
  --shadow-card: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
  --check-border: rgba(0,0,0,0.2);
  --check-bg: rgba(0,0,0,0.03);
  --check-tick: #fff;
  --theme-btn-bg: rgba(0,0,0,0.05);
  --theme-btn-border: rgba(0,0,0,0.1);
  --theme-btn-color: #64748b;
}

/* ══════════════════════════════
   布局
══════════════════════════════ */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-base);
  position: relative;
  overflow: hidden;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  transition: background 0.4s;
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 200;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--theme-btn-border);
  background: var(--theme-btn-bg);
  color: var(--theme-btn-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  backdrop-filter: blur(12px);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 4px 16px rgba(245,158,11,0.25);
  border-color: rgba(245,158,11,0.4);
}

/* 背景装饰 */
.bg-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.5;
  pointer-events: none;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  transition: background-image 0.4s;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  animation: orbFloat 8s ease-in-out infinite alternate;
  transition: background 0.5s;
}
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, var(--orb1) 0%, transparent 70%); top: -150px; left: -150px; animation-duration: 10s; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, var(--orb2) 0%, transparent 70%); bottom: -100px; right: -100px; animation-duration: 12s; animation-direction: alternate-reverse; }
.orb-3 { width: 250px; height: 250px; background: radial-gradient(circle, var(--orb3) 0%, transparent 70%); top: 50%; left: 60%; animation-duration: 7s; }
@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 20px) scale(1.08); }
}

/* ══════════════════════════════
   卡片
══════════════════════════════ */
.login-card {
  position: relative;
  z-index: 10;
  width: 400px;
  padding: 40px 36px 32px;
  background: var(--bg-card);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border-card);
  border-radius: 20px;
  box-shadow: 0 0 0 1px rgba(245,158,11,0.08), var(--shadow-card);
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s cubic-bezier(0.16,1,0.3,1),
    transform 0.6s cubic-bezier(0.16,1,0.3,1),
    background 0.4s, border-color 0.4s, box-shadow 0.4s;
}
.login-card.card-enter { opacity: 1; transform: translateY(0); }

.card-glow-line {
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent);
  border-radius: 50%;
}

/* 头部 */
.card-header { text-align: center; margin-bottom: 32px; }
.logo-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px; height: 60px;
  margin-bottom: 16px;
}
.logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(245,158,11,0.4);
  animation: ringPulse 3s ease-in-out infinite;
}
.logo-ring::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1px solid rgba(245,158,11,0.2);
}
@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}
.logo-icon { position: relative; z-index: 1; filter: drop-shadow(0 0 8px rgba(245,158,11,0.4)); }
.title { font-size: 20px; font-weight: 700; color: var(--text-title); margin: 0 0 6px; letter-spacing: 2px; transition: color 0.4s; }
.subtitle { font-size: 11px; color: var(--text-sub); margin: 0; letter-spacing: 3px; text-transform: uppercase; transition: color 0.4s; }

/* ══════════════════════════════
   表单
══════════════════════════════ */
.login-form { margin-top: 0; }
.login-form :deep(.el-form-item) { margin-bottom: 16px; }
.login-form :deep(.el-form-item__error) { color: #f59e0b; font-size: 11px; padding-top: 3px; }

.input-wrap { position: relative; width: 100%; }
.input-icon {
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-sub);
  z-index: 2; font-size: 15px;
  transition: color 0.2s;
  pointer-events: none;
}
.input-wrap:focus-within .input-icon { color: #f59e0b; }

.login-form :deep(.custom-input .el-input__wrapper) {
  background: var(--bg-input);
  border-radius: 10px;
  box-shadow: 0 0 0 1px var(--border-input) inset;
  padding-left: 42px;
  transition: box-shadow 0.2s, background 0.2s;
}
.login-form :deep(.custom-input .el-input__wrapper:hover) {
  background: var(--bg-input-hover);
  box-shadow: 0 0 0 1px var(--border-input-hover) inset;
}
.login-form :deep(.custom-input .el-input__wrapper.is-focus) {
  background: var(--bg-input-focus);
  box-shadow: 0 0 0 1.5px var(--border-input-focus) inset, 0 0 16px rgba(245,158,11,0.08) !important;
}
.login-form :deep(.custom-input .el-input__inner) {
  color: var(--text-input);
  font-size: 14px;
  caret-color: #f59e0b;
  transition: color 0.3s;
}
.login-form :deep(.custom-input .el-input__inner::placeholder) { color: var(--text-placeholder); }

/* 记住我 */
.form-options { margin: -4px 0 18px; }
.remember-label { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.remember-check { display: none; }
.check-box {
  width: 16px; height: 16px;
  border: 1.5px solid var(--check-border);
  border-radius: 4px;
  background: var(--check-bg);
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.remember-check:checked + .check-box { background: #f59e0b; border-color: #f59e0b; }
.remember-check:checked + .check-box::after {
  content: '';
  position: absolute;
  left: 4px; top: 1px;
  width: 5px; height: 9px;
  border: 2px solid var(--check-tick);
  border-left: none; border-top: none;
  transform: rotate(45deg);
}
.remember-text { font-size: 13px; color: var(--text-label); transition: color 0.3s; }

/* 登录按钮 */
.login-btn {
  width: 100%; height: 46px;
  border: none; border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
  font-size: 15px; font-weight: 700; letter-spacing: 4px;
  cursor: pointer;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
  box-shadow: 0 4px 20px rgba(245,158,11,0.35);
  font-family: inherit;
}
.login-btn::before {
  content: '';
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.15);
  opacity: 0;
  transition: opacity 0.2s;
}
.login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(245,158,11,0.45); filter: brightness(1.05); }
.login-btn:hover:not(:disabled)::before { opacity: 1; }
.login-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
.login-btn:disabled { opacity: 0.75; cursor: not-allowed; }

.btn-shimmer {
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes shimmer { 0% { left: -100%; } 50%, 100% { left: 150%; } }
.btn-text, .btn-arrow { position: relative; z-index: 1; }
.btn-arrow { font-size: 16px; transition: transform 0.2s; }
.login-btn:hover .btn-arrow { transform: translateX(3px); }
.btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  position: relative; z-index: 1;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 演示账号 */
.demo-divider { display: flex; align-items: center; gap: 10px; margin: 24px 0 14px; }
.divider-line { flex: 1; height: 1px; background: var(--border-divider); transition: background 0.3s; }
.divider-label { font-size: 11px; color: var(--text-divider); letter-spacing: 2px; white-space: nowrap; transition: color 0.3s; }

.account-list { display: flex; flex-direction: column; gap: 8px; }
.account-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: var(--bg-account);
  border: 1px solid var(--border-account);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}
.account-item:hover {
  background: var(--bg-account-hover);
  border-color: var(--border-account-hover);
  transform: translateX(3px);
}
.account-badge { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; padding: 2px 7px; border-radius: 4px; }
.admin-badge { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.22); }
.user-badge { background: rgba(99,102,241,0.12); color: #6366f1; border: 1px solid rgba(99,102,241,0.22); }
.account-info { flex: 1; font-size: 12px; color: var(--text-account); font-family: 'Courier New', monospace; letter-spacing: 0.5px; transition: color 0.3s; }
.account-arrow { font-size: 13px; color: var(--text-divider); transition: color 0.15s; }
.account-item:hover .account-arrow { color: #f59e0b; }

/* ══════════════════════════════
   移动端响应式 ≤ 480px
══════════════════════════════ */
@media (max-width: 480px) {
  .login-wrapper {
    align-items: flex-start;
    padding: 60px 16px 32px;
    min-height: 100dvh;
  }

  .theme-toggle {
    top: 14px;
    right: 14px;
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .login-card {
    width: 100%;
    padding: 32px 20px 24px;
    border-radius: 16px;
  }

  .card-header { margin-bottom: 24px; }

  .logo-wrap {
    width: 52px; height: 52px;
    margin-bottom: 12px;
  }

  .title { font-size: 17px; letter-spacing: 1px; }
  .subtitle { font-size: 10px; letter-spacing: 2px; }

  .login-form :deep(.el-input__inner) { font-size: 16px !important; } /* 防止 iOS 自动缩放 */

  .login-btn {
    height: 50px;
    font-size: 15px;
    letter-spacing: 3px;
  }

  .account-info { font-size: 11px; }
}

/* 平板 481px ~ 640px */
@media (min-width: 481px) and (max-width: 640px) {
  .login-wrapper { padding: 40px 24px; }
  .login-card { width: 100%; max-width: 420px; }
}
</style>
