import { ref, watch, onMounted } from 'vue'

const isDark = ref(true)

const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme(isDark.value)
  }

  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved ? saved === 'dark' : true
    applyTheme(isDark.value)
  }

  return { isDark, toggleTheme, initTheme }
}
