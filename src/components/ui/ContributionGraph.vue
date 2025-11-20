<template>
  <BaCard title="GIT_DATABASE" class="h-full flex flex-col bg-white">
    <div class="flex-1 flex flex-col justify-between p-4 overflow-hidden">
      
      <!-- 顶部统计 -->
      <div class="flex justify-between items-end mb-3 px-1 shrink-0">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Total Contributions</span>
          <div v-if="loading" class="h-8 w-24 bg-slate-100 animate-pulse rounded mt-1"></div>
          <span v-else class="text-4xl font-black text-slate-700 leading-none -ml-0.5">{{ total }}</span>
        </div>
        <div class="flex flex-col items-end">
           <div class="text-[9px] text-slate-400 font-mono">今年</div>
           <div v-if="username" class="text-[9px] text-ba-primary font-bold bg-blue-50 px-1.5 py-0.5 rounded uppercase">USER: {{ username }}</div>
        </div>
      </div>

      <!-- 热力图容器 -->
      <div 
        ref="scrollContainer"
        class="flex-1 w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide relative select-none flex flex-col justify-center"
      >
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
           <div class="text-[10px] font-bold text-ba-primary animate-pulse">SYNCING DATA...</div>
        </div>

        <!-- 绘图区 -->
        <!-- [Fix]: min-w-full 确保不塌陷，pr-8 留出右侧安全距离 -->
        <div class="flex gap-[3px] px-1 min-w-full pr-8 justify-start" style="width: max-content;">
          <div v-for="(week, wIndex) in weeks" :key="wIndex" class="flex flex-col gap-[3px]">
            <div 
              v-for="(day, dIndex) in week" 
              :key="dIndex"
              class="w-3 h-3 rounded-[1px] transition-all duration-150 hover:scale-125 cursor-crosshair border border-transparent box-border"
              :class="[
                getColorClass(day.level),
                hoveredDay === day ? 'border-slate-500 z-10 ring-1 ring-slate-400 shadow-sm' : ''
              ]"
              @mouseenter="hoveredDay = day"
              @mouseleave="hoveredDay = null"
            ></div>
          </div>
        </div>
      </div>

      <!-- 底部状态栏 -->
      <div class="h-5 mt-2 flex items-center justify-end w-full shrink-0">
        <div v-if="hoveredDay" class="flex items-center gap-2 animate-fade-in bg-slate-800 text-white px-2 py-0.5 rounded-sm shadow-md z-20">
           <span class="text-[9px] font-mono text-slate-300">{{ hoveredDay.date }}</span>
           <div class="h-2 w-[1px] bg-slate-500"></div>
           <span class="text-[9px] font-bold font-mono text-green-400">{{ hoveredDay.count }} COMMITS</span>
        </div>
        <div v-else class="flex items-center gap-1 animate-fade-in">
          <span class="text-[9px] text-slate-400 mr-1">LESS</span>
          <div class="w-2 h-2 rounded-[1px] bg-slate-100"></div>
          <div class="w-2 h-2 rounded-[1px] bg-blue-200"></div>
          <div class="w-2 h-2 rounded-[1px] bg-blue-400"></div>
          <div class="w-2 h-2 rounded-[1px] bg-ba-primary"></div>
          <div class="w-2 h-2 rounded-[1px] bg-[#0e5c85]"></div>
          <span class="text-[9px] text-slate-400 ml-1">MORE</span>
        </div>
      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import BaCard from './BaCard.vue'

const props = defineProps<{ username?: string }>()

interface DayData {
  date: string
  count: number
  level: number
}

const weeks = ref<DayData[][]>([])
const total = ref(0)
const loading = ref(true)
const hoveredDay = ref<DayData | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

const getColorClass = (level: number) => {
  if (level === 0) return 'bg-slate-100'
  if (level === 1) return 'bg-blue-200'
  if (level === 2) return 'bg-blue-400'
  if (level === 3) return 'bg-ba-primary'
  return 'bg-[#0e5c85]'
}

const scrollToEnd = () => {
  nextTick(() => {
    setTimeout(() => {
      if (scrollContainer.value) {
        // 确保滚到最右边，+100 确保覆盖 padding
        scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth + 100
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

    const builtWeeks: DayData[][] = []
    let currentWeek: DayData[] = []
    flatDays.forEach((day: any) => {
       currentWeek.push(day)
       if (currentWeek.length === 7) {
          builtWeeks.push(currentWeek)
          currentWeek = []
       }
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
      week.push({ date: date.toISOString().split('T')[0], count, level })
    }
    data.push(week)
  }
  weeks.value = data
  total.value = simTotal
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
</style>