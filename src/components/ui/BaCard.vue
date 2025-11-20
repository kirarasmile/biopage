<template>
  <div class="bg-ba-panel backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/50 overflow-hidden flex flex-col h-full relative group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,164,219,0.1)]">
    <!-- 顶部彩色条 -->
    <div class="h-1.5 w-full bg-ba-primary opacity-80"></div>
    
    <!-- 标题栏 -->
    <div v-if="title" class="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white/40">
      <h3 class="font-black text-slate-700 tracking-widest uppercase text-xs italic font-sans">
        <span class="text-ba-primary mr-1">#</span>{{ title }}
      </h3>
      <!-- 小装饰点 -->
      <div class="flex gap-1">
        <div class="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-ba-primary/40"></div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-5 flex-1 overflow-hidden">
      <slot />
    </div>
    
    <!-- 右下角装饰性三角 -->
    <div class="absolute bottom-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-ba-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>