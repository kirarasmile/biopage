<template>
  <BaCard title="MY_PROFILE" class="h-full">
    <!-- 改为 flex-col 垂直排列，居中对齐 -->
    <div class="flex flex-col items-center text-center h-full gap-4">
      
      <!-- 头像区 -->
      <div class="relative shrink-0 mt-2">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10 bg-blue-50">
          <img :src="data.avatarUrl" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
        </div>
        <!-- 动态光环 -->
        <div class="absolute -top-3 -left-3 w-[152px] h-[152px] border border-ba-primary/30 rounded-full animate-spin-slow opacity-60 border-dashed pointer-events-none"></div>
      </div>
      
      <!-- 文本信息区 -->
      <div class="flex flex-col items-center w-full">
        <h1 class="text-2xl font-black text-slate-800 tracking-tight break-words w-full">{{ data.nickname }}</h1>
        
        <div class="inline-flex items-center gap-2 mt-1 mb-3">
          <span class="px-2 py-0.5 bg-ba-primary text-white text-[10px] font-bold rounded tracking-wider">Lv.85</span>
          <p class="text-ba-primary text-xs font-bold whitespace-normal text-center px-2 leading-tight">
            {{ data.tagline }}
          </p>
        </div>
        
        <div class="w-full h-px bg-slate-200 mb-4"></div>
        
        <p class="text-sm text-slate-600 leading-relaxed mb-6 px-2 text-justify">
          {{ data.bio }}
        </p>
        
        <!-- 社交链接 (自动换行) -->
        <div class="flex flex-wrap gap-2 justify-center mt-auto pb-2">
          <a 
            v-for="social in data.socials" 
            :key="social.type" 
            :href="social.url" 
            target="_blank" 
            class="px-3 py-1 bg-slate-100 hover:bg-ba-primary hover:text-white text-slate-600 text-xs font-bold rounded-full transition-all border border-slate-200"
          >
             {{ social.label }}
          </a>
        </div>
      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import BaCard from '../ui/BaCard.vue'
import { profileData as data } from '../../config/data'
</script>