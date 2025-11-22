<template>
  <BaCard title="GIT_DATABASE" class="h-full flex flex-col bg-white">
    <div class="flex-1 flex flex-col pt-3 px-4 pb-0 overflow-hidden relative group">
      
      <!-- 1. 顶部统计 -->
      <div class="flex justify-between items-end mb-1 px-1 shrink-0 z-20">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Total Contributions</span>
          <div v-if="loading" class="h-8 w-24 bg-slate-100 animate-pulse rounded mt-1"></div>
          <span v-else class="text-4xl font-black text-slate-700 leading-none -ml-0.5 tracking-tighter">{{ total }}</span>
        </div>
        <div class="flex flex-col items-end">
           <div class="text-[9px] text-slate-400 font-mono font-bold">NOW</div>
           <div v-if="username" class="text-[9px] text-ba-primary font-black bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">
             USER: {{ username }}
           </div>
        </div>
      </div>

      <!-- 2. 热力图容器 -->
      <div 
        ref="scrollContainer"
        class="flex-1 w-full overflow-x-auto overflow-y-hidden scrollbar-hide relative select-none flex flex-col justify-center py-1 z-20 cursor-crosshair"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
           <div class="text-xs font-bold text-ba-primary animate-pulse tracking-widest">SYNCING DATA...</div>
        </div>

        <!-- 扫描线 -->
        <div 
           v-show="cursorX > 0"
           class="absolute top-0 bottom-0 w-[1px] bg-ba-primary/50 pointer-events-none z-30 transition-opacity duration-200"
           :style="{ left: cursorX + 'px' }"
        >
           <div class="absolute bottom-0 -left-1.5 w-3 h-1 bg-ba-primary shadow-[0_0_5px_#00a4db]"></div>
           <div class="absolute top-0 -left-1.5 w-3 h-1 bg-ba-primary shadow-[0_0_5px_#00a4db]"></div>
           <div class="absolute inset-0 bg-ba-primary/20 blur-[1px]"></div>
        </div>

        <!-- 绘图区 -->
        <div class="flex gap-[3px] px-1" style="min-width: max-content;">
          <div v-for="(week, wIndex) in weeks" :key="wIndex" class="flex flex-col gap-[3px]">
            <div 
              v-for="(day, dIndex) in week" 
              :key="dIndex"
              class="w-4 h-4 rounded-[2px] transition-all duration-150 border border-transparent box-border"
              :class="[
                getColorClass(day.level),
                // 高亮当前显示的日子 (无论是鼠标悬停还是默认今天)
                displayData === day ? 'scale-110 border-white shadow-md z-10 ring-2 ring-ba-primary ring-offset-1' : 'opacity-90 hover:opacity-100'
              ]"
              @mouseenter="hoveredDay = day"
            ></div>
          </div>
          <div ref="endAnchor" class="w-1 h-full shrink-0"></div>
        </div>
      </div>

      <!-- 3. 数据统计仪表盘 -->
      <div class="grid grid-cols-3 gap-2 mt-2 mb-2 z-20">
         <div class="bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col items-center justify-center">
            <span class="text-[8px] font-bold text-slate-400 uppercase">Active Days</span>
            <span class="text-xs font-black text-slate-600 font-mono">{{ stats.activeDays }}<span class="text-[8px] text-slate-300 font-normal">/365</span></span>
         </div>
         <div class="bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col items-center justify-center">
            <span class="text-[8px] font-bold text-slate-400 uppercase">Max Streak</span>
            <span class="text-xs font-black text-blue-500 font-mono">{{ stats.maxStreak }} <span class="text-[8px] text-slate-400">DAYS</span></span>
         </div>
         <div class="bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col items-center justify-center relative overflow-hidden">
            <div class="absolute bottom-0 left-0 h-1 bg-ba-primary transition-all duration-1000" :style="{ width: `${(total % 100)}%` }"></div>
            <span class="text-[8px] font-bold text-slate-400 uppercase">Dev Level</span>
            <span class="text-xs font-black text-ba-primary font-mono">Lv.{{ Math.floor(total / 50) }}</span>
         </div>
      </div>

      <!-- 4. 底部：战术分析面板 -->
      <div class="mt-auto border-t border-slate-100 pt-2 pb-3 flex items-center justify-between select-none relative overflow-hidden">
         
         <!-- 左侧：当前选中信息 -->
         <div class="flex flex-col justify-center z-10 relative pl-1">
            <div class="flex items-center gap-2">
               <div class="w-1.5 h-1.5 bg-ba-primary rounded-full animate-pulse"></div>
               <!-- 显示日期 -->
               <span class="text-[10px] font-bold text-slate-500 font-mono uppercase">
                 {{ displayData ? displayData.date : 'INITIALIZING...' }}
               </span>
               <span v-if="displayData" class="text-[8px] font-mono text-slate-300 hidden sm:inline-block">
                  0x{{ (displayData.count * 156).toString(16).toUpperCase() }}
               </span>
            </div>
            
            <div class="flex items-baseline gap-1 mt-0.5">
               <span class="text-[9px] font-bold text-slate-300">LOGS:</span>
               <!-- 显示提交数 -->
               <span class="font-mono font-black text-lg tracking-widest leading-none transition-all duration-200" :class="getRankColor(displayData?.count || 0)">
                  {{ displayData ? displayData.count : '--' }}
               </span>
            </div>
         </div>

         <!-- 右侧：评级 (Rank) -->
         <div class="relative z-10 flex items-center pr-2">
            <div class="flex flex-col items-end">
               <span class="text-[8px] font-bold text-slate-300 tracking-[0.2em] mr-1">RATING</span>
               <span 
                  class="text-3xl font-black italic tracking-tighter transition-all duration-200"
                  :class="getRankColor(displayData?.count || 0)"
                  style="text-shadow: 2px 2px 0px #f1f5f9;"
               >
                  {{ getRank(displayData?.count || 0) }}
               </span>
            </div>
         </div>

         <!-- 背景装饰 -->
         <div class="absolute top-0 right-16 bottom-0 w-32 overflow-hidden pointer-events-none opacity-20 flex items-center">
            <div class="text-[8px] font-mono text-slate-400 whitespace-nowrap animate-scroll-left">
               0F 2A 3C 8E 99 1B 4D 5F AA C3 00 12 FF EE 88 99 00 11 22 33 44 55
            </div>
         </div>
      </div>

      <!-- 底部装饰条 -->
      <div class="absolute bottom-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,#cbd5e1,#cbd5e1_5px,transparent_5px,transparent_10px)] opacity-30"></div>

    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import BaCard from './BaCard.vue'

const props = defineProps<{ username?: string }>()

interface DayData { date: string; count: number; level: number }
const weeks = ref<DayData[][]>([])
const total = ref(0)
const stats = reactive({ activeDays: 0, maxStreak: 0 })
const loading = ref(true)
const hoveredDay = ref<DayData | null>(null)
// [New] 存储今天的数据
const todayData = ref<DayData | null>(null)

const scrollContainer = ref<HTMLElement | null>(null)
const endAnchor = ref<HTMLElement | null>(null)
const cursorX = ref(0)

// [New] 计算当前应该显示的数据：优先显示鼠标悬停的，否则显示今天的
const displayData = computed(() => hoveredDay.value || todayData.value)

const getColorClass = (level: number) => {
  if (level === 0) return 'bg-slate-100'
  if (level === 1) return 'bg-blue-200'
  if (level === 2) return 'bg-blue-400'
  if (level === 3) return 'bg-ba-primary'
  return 'bg-[#0e5c85]'
}

const getRank = (count: number) => {
  if (count === 0) return 'MISS'
  if (count <= 2) return 'B'
  if (count <= 5) return 'A'
  if (count <= 9) return 'S'
  return 'SS'
}

const getRankColor = (count: number) => {
  if (count === 0) return 'text-slate-300'
  if (count <= 2) return 'text-blue-400'
  if (count <= 5) return 'text-yellow-500'
  if (count <= 9) return 'text-pink-500'
  return 'text-purple-600 drop-shadow-[0_0_5px_rgba(147,51,234,0.5)]'
}

const calculateStats = (days: any[]) => {
  let active = 0
  let currentStreak = 0
  let maxStreak = 0
  
  days.forEach(day => {
    if (day.count > 0) {
      active++
      currentStreak++
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 0
    }
  })
  maxStreak = Math.max(maxStreak, currentStreak)
  
  stats.activeDays = active
  stats.maxStreak = maxStreak
}

const handleMouseMove = (e: MouseEvent) => {
  if (!scrollContainer.value) return
  const rect = scrollContainer.value.getBoundingClientRect()
  const visibleX = e.clientX - rect.left
  cursorX.value = visibleX + scrollContainer.value.scrollLeft
}

const handleMouseLeave = () => {
  cursorX.value = -10
  hoveredDay.value = null // 鼠标离开，自动回退到 todayData
}

const scrollToEnd = () => {
  nextTick(() => {
    setTimeout(() => {
      if (endAnchor.value) {
        endAnchor.value.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'end' })
      }
    }, 200)
  })
}

const fetchContributions = async (user: string) => {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
    const data = await res.json()
    if (!data.contributions) throw new Error('No data')

    const flatDays = data.contributions
    total.value = data.total?.lastYear || flatDays.reduce((a:any, b:any) => a + b.count, 0)
    
    calculateStats(flatDays)
    
    // [New] 获取最后一天（今天）的数据
    if (flatDays.length > 0) {
      todayData.value = flatDays[flatDays.length - 1]
    }

    const builtWeeks: DayData[][] = []
    let currentWeek: DayData[] = []
    flatDays.forEach((day: any) => {
       currentWeek.push(day)
       if (currentWeek.length === 7) { builtWeeks.push(currentWeek); currentWeek = [] }
    })
    if (currentWeek.length > 0) builtWeeks.push(currentWeek)

    weeks.value = builtWeeks
    scrollToEnd() 
  } catch (e) {
    console.error('Failed to fetch github data', e)
    generateSimulation()
  } finally {
    loading.value = false
  }
}

const generateSimulation = () => {
  const data: DayData[][] = []
  const flatData: any[] = []
  let simTotal = 0
  const today = new Date()
  for (let w = 0; w < 52; w++) {
    const week: DayData[] = []
    for (let d = 0; d < 7; d++) {
      const isWeekend = d === 0 || d === 6
      let count = 0
      if (Math.random() > (isWeekend ? 0.8 : 0.4)) count = Math.floor(Math.random() * 12)
      let level = 0
      if (count > 0) level = 1
      if (count > 3) level = 2
      if (count > 6) level = 3
      if (count > 10) level = 4
      simTotal += count
      const date = new Date(today)
      date.setDate(today.getDate() - ((52 - w) * 7) + d)
      const dayObj = { date: date.toISOString().split('T')[0], count, level }
      week.push(dayObj)
      flatData.push(dayObj)
    }
    data.push(week)
  }
  weeks.value = data
  total.value = simTotal
  calculateStats(flatData)
  
  // [New] 模拟数据的今天
  if (flatData.length > 0) {
    todayData.value = flatData[flatData.length - 1]
  }
  
  loading.value = false
  scrollToEnd()
}

onMounted(() => {
  if (props.username) fetchContributions(props.username)
  else generateSimulation()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
.animate-scroll-left { animation: scrollLeft 10s linear infinite; }
@keyframes scrollLeft { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
</style>