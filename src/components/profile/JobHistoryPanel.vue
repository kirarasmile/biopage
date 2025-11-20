<template>
  <BaCard title="CAREER_PATH" class="h-full">
    <div class="flex flex-col p-1">
      <!-- 时间轴容器 -->
      <div class="relative pl-4 border-l-2 border-slate-100 ml-2 space-y-5 py-1">
        
        <div 
          v-for="(job, index) in history" 
          :key="index" 
          class="relative group"
        >
          <!-- 时间轴上的点 -->
          <div 
            class="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white transition-colors duration-300"
            :class="job.current ? 'bg-ba-primary ring-2 ring-ba-primary/20' : 'bg-slate-300 group-hover:bg-ba-primary/60'"
          ></div>

          <!-- 内容卡片 -->
          <div class="flex flex-col gap-0.5">
            <!-- 时间 -->
            <span 
              class="text-[9px] font-mono font-bold tracking-wider"
              :class="job.current ? 'text-ba-primary' : 'text-slate-400'"
            >
              {{ job.period }}
            </span>
            
            <!-- 职位与公司 -->
            <h4 class="text-xs font-bold text-slate-700 leading-tight">
              {{ job.role }}
              <span class="font-normal text-slate-400">@ {{ job.company }}</span>
            </h4>
            
            <!-- 简述 (可选) -->
            <p v-if="job.description" class="text-[10px] text-slate-500 mt-1 leading-relaxed">
              {{ job.description }}
            </p>
          </div>
        </div>

      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import BaCard from '../ui/BaCard.vue'
import { careerHistory } from '../../config/data'

const history = careerHistory
</script>