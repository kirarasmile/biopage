<template>
  <BaCard title="PROFILE" class="h-full">
    <div class="flex flex-col h-full relative px-4 py-3 overflow-hidden">
      
      <!-- [新增] 顶部消息提示 (Toast) -->
      <!-- 当触发复制时，这个小框会从顶部掉下来 -->
      <transition name="toast-slide">
        <div 
          v-if="toast.show" 
          class="absolute top-12 left-0 right-0 mx-auto w-max max-w-[80%] z-50 flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg pointer-events-none"
        >
           <div class="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px]">✓</div>
           <span class="text-xs font-bold">{{ toast.message }}</span>
        </div>
      </transition>

      <!-- 1. 社交链接 (悬浮侧边栏) -->
      <div class="absolute top-12 right-3 z-20 flex flex-col gap-2">
        <button 
          v-for="social in data.socials" 
          :key="social.type" 
          @click="handleSocialClick(social)"
          class="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-ba-primary hover:border-ba-primary hover:shadow-sm hover:-translate-x-0.5 transition-all duration-200 group/btn relative"
          :title="social.value || social.label"
        >
           <component :is="getIcon(social.type)" class="w-4 h-4" />
           <!-- 小红点 (仅 QQ/Email 显示，增加点击欲望) -->
           <div v-if="social.value" class="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full border-2 border-white opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
        </button>
      </div>

      <!-- 2. 头像区 (居中) -->
      <div 
        class="relative shrink-0 mt-1 select-none z-10 cursor-pointer mx-auto"
        @mousemove="handleHeadpat"
        @mouseleave="resetPat"
        @click="changeMood" 
      >
        <!-- 粒子 -->
        <div class="absolute inset-0 pointer-events-none z-50 overflow-visible">
           <div v-for="particle in particles" :key="particle.id" class="absolute animate-float-up" :style="{ left: particle.x + 'px', top: particle.y + 'px' }">
             <span v-if="particle.type === 'heart'" class="text-xl drop-shadow-md">💖</span>
             <span v-else-if="particle.type === 'angry'" class="text-xl drop-shadow-md">💢</span>
             <span v-else-if="particle.type === 'dizzy'" class="text-xl drop-shadow-md">💫</span>
           </div>
        </div>
        
        <div 
          class="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-md relative z-10 bg-white transition-transform duration-200 ease-out active:scale-95"
          :class="isPetting ? 'scale-105 translate-y-1' : 'hover:scale-105'"
        >
          <img :src="data.avatarUrl" class="w-full h-full object-cover pointer-events-none" />
        </div>
        
        <div 
          class="absolute -top-2 -left-2 w-28 h-28 border-2 border-ba-primary/20 rounded-full opacity-0 transition-all duration-500 pointer-events-none"
          :class="isPetting ? 'animate-spin-fast opacity-100 scale-110 border-dashed' : ''"
        ></div>
      </div>
      
      <!-- 3. 身份信息 (居中) -->
      <div class="flex flex-col items-center w-full pointer-events-none mt-3 mb-3">
        <h1 class="text-xl font-black text-slate-800 tracking-tight pointer-events-auto mb-1">{{ data.nickname }}</h1>
        
        <div class="flex items-center gap-2 pointer-events-auto">
          <span class="px-1.5 py-px bg-ba-primary text-white text-[9px] font-black rounded-sm tracking-wider shadow-sm shadow-ba-primary/30">
            Lv.85
          </span>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            {{ data.tagline.split('/')[0] || 'Developer' }}
          </span>
        </div>
      </div>

      <!-- 
        4. [美化重点] 个人简介 (Memo Box) 
        设计风格：便利贴 / 系统日志
      -->
      <div class="w-full pointer-events-auto flex-1 min-h-0 mb-2 px-1 relative group/memo">
         
         <!-- 装饰：回形针/标签 -->
         <div class="absolute -top-2 left-4 z-20 bg-slate-200 text-[8px] font-black text-slate-500 px-2 py-0.5 rounded shadow-sm border border-white transform -rotate-2 group-hover/memo:rotate-0 transition-transform duration-300">
            MEMO
         </div>

         <!-- 内容容器 -->
         <div class="h-full relative bg-slate-50/50 rounded-xl border border-slate-200 hover:border-ba-primary/30 hover:bg-white hover:shadow-sm transition-all duration-300 p-3 pt-4 overflow-hidden">
            <!-- 背景装饰斜线 -->
            <div class="absolute top-0 right-0 w-8 h-8 bg-[linear-gradient(45deg,transparent_50%,rgba(0,164,219,0.05)_50%)] pointer-events-none"></div>
            
            <!-- 左侧装饰条 -->
            <div class="absolute left-0 top-3 bottom-3 w-[3px] bg-slate-200 rounded-r-full group-hover/memo:bg-ba-primary transition-colors duration-300"></div>

            <!-- 文本区域 -->
            <div class="h-full overflow-y-auto scrollbar-hide pl-3">
                <p class="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-justify">
                  {{ data.bio }}
                </p>
            </div>
         </div>
      </div>

      <!-- 5. 底部 AI 监视器 -->
      <div class="w-full pt-2 border-t border-slate-100 flex items-center justify-between select-none mt-auto shrink-0">
         <div class="flex flex-col items-start">
            <span class="text-[9px] font-bold text-slate-400 tracking-widest uppercase">A.R.O.N.A</span>
            <div class="flex items-center gap-1.5">
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
         
         <div 
            class="relative w-20 h-6 bg-white rounded-full border border-slate-200 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-ba-primary/50 transition-colors shadow-inner"
            ref="eyeContainer"
            @mousemove.stop="handleEyeMove"
            @mouseleave="resetEye"
            @click="changeMood"
         >
            <div class="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_49%,#00a4db_50%,transparent_51%)] bg-[size:4px_100%] pointer-events-none"></div>
            <div class="absolute top-0 left-0 w-full bg-slate-200 z-20 transition-all duration-200 ease-out" :style="{ height: lidHeight + '%' }"></div>
            <div class="absolute bottom-0 left-0 w-full bg-slate-200 z-20 transition-all duration-200 ease-out" :style="{ height: lidHeight + '%' }"></div>
            <div 
               class="w-4 h-4 rounded-full relative transition-colors duration-200 ease-out z-10 flex items-center justify-center will-change-transform"
               :class="{
                 'bg-pink-400 scale-125 shadow-[0_0_10px_#ff7e7e]': currentMood === 'happy',
                 'bg-yellow-400': currentMood === 'suspicious',
                 'bg-red-500 animate-shake shadow-[0_0_8px_#ef4444]': currentMood === 'angry',
                 'bg-purple-500 shadow-[0_0_8px_#a855f7]': currentMood === 'dizzy',
                 'bg-ba-primary shadow-[0_0_10px_#00a4db]': currentMood === 'normal'
               }"
               :style="{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }"
            >
               <div v-if="currentMood === 'happy'" class="text-[8px] text-white font-bold">♥</div>
               <div v-else-if="currentMood === 'suspicious'" class="w-2 h-0.5 bg-white rounded-full"></div>
               <div v-else-if="currentMood === 'angry'" class="w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[4px] border-t-white mt-0.5"></div>
               <svg v-else-if="currentMood === 'dizzy'" class="w-3 h-3 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 20a8 8 0 1 0-8-8 8 8 0 0 0 8 8Z" stroke-dasharray="10 5" /></svg>
               <div v-else class="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
            </div>
         </div>
      </div>

    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, h } from 'vue'
import BaCard from '../ui/BaCard.vue'
import { profileData as data } from '../../config/data'

// Icons (添加 QQ Icon)
const GithubIcon = h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [h('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' })])
const TwitterIcon = h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [h('path', { d: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' })])
const MailIcon = h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [h('path', { d: 'M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-11.174l4.623 5.462zm2.169 0.945l-1.574 1.896c-.591.743-.715.965 0 1.733l1.574 1.962-5.792 7.535h22l-5.693-7.37-1.516-1.956c-.636-.824-.699-1.082 0-1.804l1.512-1.998 5.705-7.37h-22l5.792 7.372zm2.697-5.299l-4.941-6.075h9.879l-4.938 6.075zm-5.491-3.966l4.628-5.609h12.812l4.633 5.609-5.731 7.291-1.575 1.896c-1.22 1.533-1.776 1.524-3.022 0l-1.574-1.896-5.731-7.291zm11.389 5.321l4.623-5.462v11.174l-4.623-5.712z' })])
const QQIcon = h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [h('path', { d: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.204c4.354 0 7.96 2.84 9.195 6.833-.64-.137-1.3-.23-1.972-.282-.424-1.23-1.238-2.29-2.29-3.048-.135 1.307-.607 2.527-1.32 3.592 1.37.218 2.65.69 3.79 1.372-.406 2.07-1.57 3.883-3.205 5.048.474 1.38.274 2.922-.522 4.14-3.403-1.135-6.01-4.03-6.686-7.612-.676 3.582-3.283 6.477-6.686 7.612-.796-1.218-.996-2.76-.522-4.14-1.635-1.165-2.799-2.978-3.205-5.048 1.14-.682 2.42-1.154 3.79-1.372-.713-1.065-1.185-2.285-1.32-3.592-1.052.758-1.866 1.818-2.29 3.048-.672.052-1.332.145-1.972.282C2.04 5.044 5.646 2.204 12 2.204z' })]) // 简化的 QQ 企鹅轮廓

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'github': return GithubIcon
    case 'twitter': return TwitterIcon
    case 'email': return MailIcon
    case 'qq': return QQIcon
    default: return GithubIcon
  }
}

// State
type Mood = 'normal' | 'happy' | 'suspicious' | 'angry' | 'dizzy'
const manualMood = ref<Mood>('normal') 
const isPetting = ref(false)
const particles = ref<{id: number, x: number, y: number, type: string}[]>([])

// Toast State
const toast = reactive({
  show: false,
  message: ''
})

// [新增] 处理社交点击：复制 or 跳转
const handleSocialClick = async (social: any) => {
  if (social.value) {
    // 复制模式
    try {
      await navigator.clipboard.writeText(social.value)
      showToast(`COPIED: ${social.label.toUpperCase()}`)
    } catch (e) {
      showToast('COPY FAILED', true)
    }
  } else if (social.url) {
    // 跳转模式
    window.open(social.url, '_blank')
  }
}

// 显示 Toast
const showToast = (msg: string, isError = false) => {
  toast.message = msg
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 2000)
}

// ... (后续保持不变: mood, eyes, etc.) ...
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

const eyeContainer = ref<HTMLElement | null>(null)
const eyePos = reactive({ x: 0, y: 0 })
let mouseX = 0
let mouseY = 0
let animationFrameId: number

const updateMousePos = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

const eyeLoop = () => {
  if (eyeContainer.value) {
    if (currentMood.value === 'dizzy') {
       const time = Date.now() / 150
       eyePos.x = Math.sin(time) * 6
       eyePos.y = Math.cos(time * 1.5) * 3
    } else {
       const rect = eyeContainer.value.getBoundingClientRect()
       const centerX = rect.left + rect.width / 2
       const centerY = rect.top + rect.height / 2
       const dx = mouseX - centerX
       const dy = mouseY - centerY
       const angle = Math.atan2(dy, dx)
       const dist = Math.min(Math.sqrt(dx*dx + dy*dy) / 25, 10)
       eyePos.x = Math.cos(angle) * dist
       eyePos.y = Math.sin(angle) * dist
    }
  }
  animationFrameId = requestAnimationFrame(eyeLoop)
}

const resetEye = () => {}

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
@keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-1px, 1px); } 50% { transform: translate(1px, -1px); } 75% { transform: translate(-1px, -1px); } }
.animate-float-up { animation: floatUp 0.8s cubic-bezier(0, 0, 0.2, 1) forwards; pointer-events: none; }
@keyframes floatUp { 0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-50px) scale(1.5) rotate(20deg); opacity: 0; } }

/* Toast 动画 */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>