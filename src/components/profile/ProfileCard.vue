<template>
  <BaCard title="PROFILE" class="h-full">
    <div class="flex flex-col items-center text-center h-full gap-4 relative">
      
      <!-- 头像区 -->
      <div 
        class="relative shrink-0 mt-2 select-none z-10 cursor-pointer"
        @mousemove="handleHeadpat"
        @mouseleave="resetPat"
        @click="changeMood" 
      >
        <!-- 飘落粒子 -->
        <div class="absolute inset-0 pointer-events-none z-50 overflow-visible">
           <div 
             v-for="particle in particles" 
             :key="particle.id"
             class="absolute animate-float-up"
             :style="{ left: particle.x + 'px', top: particle.y + 'px' }"
           >
             <span v-if="particle.type === 'heart'" class="text-xl drop-shadow-md">💖</span>
             <span v-else-if="particle.type === 'angry'" class="text-xl drop-shadow-md">💢</span>
             <span v-else-if="particle.type === 'dizzy'" class="text-xl drop-shadow-md">💫</span>
           </div>
        </div>

        <!-- 头像本体 -->
        <div 
          class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10 bg-blue-50 transition-transform duration-200 ease-out active:scale-90"
          :class="isPetting ? 'scale-105 translate-y-1' : 'hover:scale-105'"
        >
          <img :src="data.avatarUrl" class="w-full h-full object-cover pointer-events-none" />
        </div>
        
        <!-- 动态光环 -->
        <div 
          class="absolute -top-3 -left-3 w-[152px] h-[152px] border border-ba-primary/30 rounded-full opacity-60 border-dashed pointer-events-none transition-all duration-500"
          :class="isPetting ? 'animate-spin-fast border-ba-primary opacity-100 scale-105' : 'animate-spin-slow'"
        ></div>
      </div>
      
      <!-- 文本信息 -->
      <div class="flex flex-col items-center w-full flex-1 pointer-events-none">
        <h1 class="text-2xl font-black text-slate-800 tracking-tight break-words w-full pointer-events-auto">{{ data.nickname }}</h1>
        <div class="inline-flex items-center gap-2 mt-1 mb-3 pointer-events-auto">
          <span class="px-2 py-0.5 bg-ba-primary text-white text-[10px] font-bold rounded tracking-wider">Lv.85</span>
          <p class="text-ba-primary text-xs font-bold whitespace-normal text-center px-2 leading-tight">{{ data.tagline }}</p>
        </div>
        <div class="w-full h-px bg-slate-200 mb-4"></div>
        <p class="text-sm text-slate-600 leading-relaxed mb-6 px-2 text-justify pointer-events-auto">{{ data.bio }}</p>
        
        <div class="flex flex-wrap gap-2 justify-center mb-4 pointer-events-auto">
          <a v-for="social in data.socials" :key="social.type" :href="social.url" target="_blank" class="px-3 py-1 bg-slate-100 hover:bg-ba-primary hover:text-white text-slate-600 text-xs font-bold rounded-full transition-all border border-slate-200">
             {{ social.label }}
          </a>
        </div>
      </div>

      <!-- AI 核心监视器 -->
      <div class="w-full pt-3 border-t border-slate-100 flex items-center justify-between select-none mt-auto">
         <div class="flex flex-col items-start">
            <span class="text-[9px] font-bold text-slate-400 tracking-widest uppercase">A.R.O.N.A</span>
            <div class="flex items-center gap-1">
               <div class="w-1.5 h-1.5 rounded-full transition-colors duration-300" 
                    :class="{
                      'bg-pink-500 animate-ping': currentMood === 'happy',
                      'bg-red-500 animate-pulse': currentMood === 'angry',
                      'bg-purple-500': currentMood === 'dizzy',
                      'bg-green-500 animate-pulse': currentMood === 'normal' || currentMood === 'suspicious'
                    }"></div>
               <span class="text-[10px] font-black transition-colors duration-300" 
                     :class="{
                       'text-pink-500': currentMood === 'happy',
                       'text-red-500': currentMood === 'angry',
                       'text-purple-500': currentMood === 'dizzy',
                       'text-slate-600': currentMood === 'normal' || currentMood === 'suspicious'
                     }">
                 {{ statusText }}
               </span>
            </div>
         </div>
         
         <!-- 眼睛容器 -->
         <!-- [Fix] 移除了 @mousemove.stop，改为 window 监听 -->
         <div 
            class="relative w-24 h-8 bg-slate-50 rounded-full border border-slate-200 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-ba-primary/50 transition-colors shadow-inner"
            ref="eyeContainer"
            @click="changeMood"
         >
            <div class="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_49%,#00a4db_50%,transparent_51%)] bg-[size:4px_100%] pointer-events-none"></div>
            
            <div class="absolute top-0 left-0 w-full bg-slate-200 z-20 transition-all duration-200 ease-out" :style="{ height: lidHeight + '%' }"></div>
            <div class="absolute bottom-0 left-0 w-full bg-slate-200 z-20 transition-all duration-200 ease-out" :style="{ height: lidHeight + '%' }"></div>

            <!-- 眼球本体 -->
            <div 
               class="w-5 h-5 rounded-full shadow-sm relative transition-colors duration-200 ease-out z-10 flex items-center justify-center will-change-transform"
               :class="{
                 'bg-pink-400 scale-125 shadow-[0_0_15px_#ff7e7e]': currentMood === 'happy',
                 'bg-yellow-400': currentMood === 'suspicious',
                 'bg-red-500 animate-shake shadow-[0_0_10px_#ef4444]': currentMood === 'angry',
                 'bg-purple-500 shadow-[0_0_10px_#a855f7]': currentMood === 'dizzy',
                 'bg-ba-primary shadow-[0_0_12px_#00a4db]': currentMood === 'normal'
               }"
               :style="{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }"
            >
               <!-- 表情瞳孔 -->
               <div v-if="currentMood === 'happy'" class="text-[10px] text-white font-bold">♥</div>
               <div v-else-if="currentMood === 'suspicious'" class="w-3 h-0.5 bg-white rounded-full"></div>
               <div v-else-if="currentMood === 'angry'" class="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[6px] border-t-white mt-1"></div>
               
               <svg v-else-if="currentMood === 'dizzy'" class="w-4 h-4 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M12 20a8 8 0 1 0-8-8 8 8 0 0 0 8 8Z" stroke-dasharray="10 5" />
               </svg>

               <div v-else class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-90"></div>
            </div>
         </div>
      </div>

    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import BaCard from '../ui/BaCard.vue'
import { profileData as data } from '../../config/data'

// --- 状态定义 ---
type Mood = 'normal' | 'happy' | 'suspicious' | 'angry' | 'dizzy'
const manualMood = ref<Mood>('normal') 
const isPetting = ref(false)
const particles = ref<{id: number, x: number, y: number, type: string}[]>([])

const currentMood = computed(() => isPetting.value ? 'happy' : manualMood.value)

const statusText = computed(() => {
  if (isPetting.value) return 'LOVE!'
  switch (currentMood.value) {
    case 'happy': return 'HAPPY'
    case 'suspicious': return 'HMM...'
    case 'angry': return 'WARNING'
    case 'dizzy': return 'SYS_ERR'
    default: return 'ACTIVE'
  }
})

const lidHeight = computed(() => {
  if (currentMood.value === 'happy') return 0
  if (currentMood.value === 'suspicious') return 35
  if (currentMood.value === 'angry') return 10
  if (currentMood.value === 'dizzy') return 0
  return 0
})

// --- 摸头杀逻辑 ---
let lastMouseX = 0
let rubDistance = 0
let particleId = 0

const handleHeadpat = (e: MouseEvent) => {
  const delta = Math.abs(e.clientX - lastMouseX)
  lastMouseX = e.clientX
  
  if (delta > 5) {
    rubDistance += delta
    if (rubDistance > 150) { 
       isPetting.value = true
       rubDistance = 0
       
       const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
       const x = e.clientX - rect.left + (Math.random() * 20 - 10)
       const y = e.clientY - rect.top + (Math.random() * 20 - 10)
       
       let type = 'heart'
       if (manualMood.value === 'angry') type = 'angry'
       if (manualMood.value === 'dizzy') type = 'dizzy'
       
       spawnParticle(x, y, type)
       resetPetTimer()
    }
  }
}

let petTimer: number
const resetPetTimer = () => {
  clearTimeout(petTimer)
  petTimer = setTimeout(() => isPetting.value = false, 600)
}

const resetPat = () => {
  isPetting.value = false
  rubDistance = 0
}

const spawnParticle = (x: number, y: number, type: string) => {
  const id = particleId++
  particles.value.push({ id, x, y, type })
  setTimeout(() => {
    particles.value = particles.value.filter(p => p.id !== id)
  }, 800)
}

// --- 眼睛逻辑 (Fix: 全局追踪 + 动画循环) ---
const eyeContainer = ref<HTMLElement | null>(null)
const eyePos = reactive({ x: 0, y: 0 })
let mouseX = 0
let mouseY = 0
let animationFrameId: number

// 1. 监听全局鼠标
const updateMousePos = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

// 2. 动画循环 (负责计算眼球位置)
const eyeLoop = () => {
  if (eyeContainer.value) {
    // Dizzy 状态：自动乱转
    if (currentMood.value === 'dizzy') {
       const time = Date.now() / 150
       eyePos.x = Math.sin(time) * 6
       eyePos.y = Math.cos(time * 1.5) * 3
    } 
    // 正常状态：跟随鼠标
    else {
       const rect = eyeContainer.value.getBoundingClientRect()
       const centerX = rect.left + rect.width / 2
       const centerY = rect.top + rect.height / 2
       
       const dx = mouseX - centerX
       const dy = mouseY - centerY
       
       // 计算角度和距离
       const angle = Math.atan2(dy, dx)
       // 限制最大移动半径 (例如 10px)
       const dist = Math.min(Math.sqrt(dx*dx + dy*dy) / 25, 10)
       
       eyePos.x = Math.cos(angle) * dist
       eyePos.y = Math.sin(angle) * dist
    }
  }
  animationFrameId = requestAnimationFrame(eyeLoop)
}

const resetEye = () => { 
  // 鼠标离开头像区不重置，因为是全局追踪
  // 如果需要重置，可以在这里写逻辑，但全局追踪通常不需要重置
}

const changeMood = () => {
  switch (manualMood.value) {
    case 'normal': manualMood.value = 'happy'; break;
    case 'happy': manualMood.value = 'suspicious'; break;
    case 'suspicious': manualMood.value = 'angry'; break;
    case 'angry': manualMood.value = 'dizzy'; break;
    case 'dizzy': manualMood.value = 'normal'; break;
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateMousePos)
  eyeLoop()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePos)
  cancelAnimationFrame(animationFrameId)
})
</script>

<style>
.animate-spin-slow { animation: spin 10s linear infinite; }
.animate-spin-fast { animation: spin 0.5s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.animate-shake { animation: shake 0.2s ease-in-out infinite; }
@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, -1px); }
}

.animate-float-up {
  animation: floatUp 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
  pointer-events: none;
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-50px) scale(1.5) rotate(20deg); opacity: 0; }
}
</style>