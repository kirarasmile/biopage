<template>
  <!-- 移除 bg-[#1e1e1e]，改用 bg-slate-50 (极浅灰) -->
  <BaCard title="ROOT_ACCESS" class="h-full bg-slate-50 border-slate-200 text-slate-600 font-mono text-xs shadow-inner">
    <div 
      ref="terminalRef"
      class="h-full w-full p-3 overflow-y-auto scrollbar-hide flex flex-col gap-1"
      @click="focusInput"
    >
      <!-- 历史输出 -->
      <div v-for="(line, i) in history" :key="i" :class="line.type">
        <span class="opacity-40 mr-2 select-none text-[10px]">{{ line.time }}</span>
        <span v-html="line.content"></span>
      </div>

      <!-- 输入行 -->
      <div class="flex items-center gap-2 mt-1">
        <!-- 提示符颜色保持 ba-primary -->
        <span class="text-ba-primary font-bold select-none">sensei@schale:~$</span>
        <input 
          ref="inputRef"
          v-model="inputValue"
          @keydown.enter="handleCommand"
          type="text" 
          class="bg-transparent border-none outline-none flex-1 text-slate-800 font-bold caret-ba-primary placeholder-slate-300"
          autocomplete="off"
          spellcheck="false"
          placeholder="..."
        />
      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import BaCard from './BaCard.vue'

interface Log {
  time: string
  content: string
  type: string
}

const history = ref<Log[]>([])
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const terminalRef = ref<HTMLElement | null>(null)

const getTimestamp = () => {
  const now = new Date()
  return `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`
}

// 默认文字颜色改为深灰
const addLog = (content: string, type = 'text-slate-600') => {
  history.value.push({ time: getTimestamp(), content, type })
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  })
}

const focusInput = () => inputRef.value?.focus()

const handleCommand = () => {
  const cmd = inputValue.value.trim()
  if (!cmd) return
  
  // 输入回显颜色加深
  addLog(`sensei@schale:~$ ${cmd}`, 'text-slate-800 font-bold')
  
  switch (cmd.toLowerCase()) {
    case 'help':
      addLog('Available commands:', 'text-ba-primary font-bold')
      addLog('  help    - Show this help message')
      addLog('  clear   - Clear terminal')
      addLog('  whoami  - Display user info')
      addLog('  date    - Show system time')
      break
    case 'clear':
      history.value = []
      break
    case 'whoami':
      addLog('User: Sensei (Admin)', 'text-green-600 font-bold')
      addLog('Role: Full Stack Developer / Kivotos Resident')
      break
    case 'date':
      addLog(new Date().toString())
      break
    case 'sudo':
      addLog('Permission denied: You are already Sensei.', 'text-red-500 font-bold')
      break
    default:
      addLog(`Command not found: ${cmd}`, 'text-red-500')
  }
  
  inputValue.value = ''
}

onMounted(async () => {
  const bootSequence = [
    { msg: 'Initializing SCHALE OS v3.1...', delay: 200 },
    { msg: 'Loading kernel modules... <span class="text-green-600 font-bold">OK</span>', delay: 400 },
    { msg: 'Mounting file systems... <span class="text-green-600 font-bold">OK</span>', delay: 600 },
    { msg: 'Connecting to neural network... <span class="text-green-600 font-bold">CONNECTED</span>', delay: 900 },
    { msg: 'Welcome back, Sensei. Type <span class="text-ba-primary font-bold">help</span>.', delay: 1200 },
  ]

  for (const step of bootSequence) {
    setTimeout(() => addLog(step.msg), step.delay)
  }
  
  setTimeout(() => focusInput(), 1500)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>