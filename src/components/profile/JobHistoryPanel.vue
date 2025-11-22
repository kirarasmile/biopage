<template>
  <BaCard title="JOB_LINE" class="h-full">
    <div class="flex flex-col h-full overflow-hidden relative">
      
      <!-- 背景连接线 -->
      <div class="absolute left-[15px] top-3 bottom-3 w-[1px] bg-slate-200 z-0"></div>

      <!-- 列表容器 -->
      <div class="flex-1 overflow-y-auto scrollbar-hide p-2 pl-0 relative z-10">
        
        <div 
          v-for="(job, index) in history" 
          :key="index" 
          class="group relative flex gap-3 mb-2 last:mb-0 cursor-pointer"
          @click="toggle(index)"
        >
          <!-- 左侧：节点 (动态变化) -->
          <div class="flex flex-col items-center shrink-0 w-8 pt-1.5">
            <div 
              class="w-2.5 h-2.5 rounded-full border-2 z-10 transition-all duration-300 box-content"
              :class="activeIndex === index
                ? 'bg-ba-primary border-white ring-2 ring-ba-primary/30 scale-110' 
                : 'bg-white border-slate-300 group-hover:border-ba-primary group-hover:scale-110'"
            ></div>
          </div>

          <!-- 右侧：折叠卡片 -->
          <div 
            class="flex-1 rounded-md border transition-all duration-300 overflow-hidden"
            :class="activeIndex === index
              ? 'bg-blue-50/30 border-blue-100 shadow-sm' 
              : 'bg-transparent border-transparent hover:bg-slate-50'"
          >
            <!-- 1. 标题栏 (始终显示) -->
            <div class="px-2 py-1.5 flex justify-between items-center">
              <div class="flex flex-col">
                <h4 class="text-xs font-black text-slate-700 leading-none" :class="{'text-ba-primary': activeIndex === index}">
                  {{ job.role }}
                </h4>
                <span class="text-[9px] font-medium text-slate-400 mt-0.5">@ {{ job.company }}</span>
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-mono font-bold text-slate-400 shrink-0">{{ job.period }}</span>
                <!-- 旋转箭头 -->
                <svg 
                  class="w-3 h-3 text-slate-400 transition-transform duration-300"
                  :class="activeIndex === index ? 'rotate-180 text-ba-primary' : 'rotate-0'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <!-- 2. 详情区 (点击展开) -->
            <!-- 使用 v-show + 简单的过渡动画 -->
            <div 
              v-show="activeIndex === index" 
              class="px-2 pb-2 animate-slide-down"
            >
              <div class="w-full h-px bg-slate-200/50 mb-2"></div>
              
              <!-- 描述 -->
              <p class="text-[10px] text-slate-600 leading-relaxed mb-2">
                {{ job.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1">
                 <span 
                   v-for="tag in job.tags" 
                   :key="tag"
                   class="text-[8px] px-1.5 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-500 font-mono"
                 >
                   {{ tag }}
                 </span>
              </div>
            </div>

          </div>
        </div>

      </div>
      
      <!-- 底部渐变遮罩 -->
      <div class="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaCard from '../ui/BaCard.vue'
import { careerHistory } from '../../config/data'

const history = careerHistory
// 默认展开第一个 (0)，如果想全部折叠改成 -1
const activeIndex = ref<number>(-1)

const toggle = (index: number) => {
  // 如果点击的是当前展开的，就收起(-1)；否则展开新的
  activeIndex.value = activeIndex.value === index ? -1 : index
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* 简单的下拉动画 */
.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>