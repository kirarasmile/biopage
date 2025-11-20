<template>
  <div class="relative w-full h-48 rounded-2xl overflow-hidden shadow-md group border border-white/50">
    <!-- 背景图 -->
    <img 
      :src="bannerImg" 
      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      alt="Banner"
      @error="handleError"
    />
    
    <!-- 遮罩与装饰 -->
    <div class="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent pointer-events-non"></div>
    
    <!-- 文字内容 -->
    <div class="absolute bottom-0 left-0 p-6 text-white select-none">
      <div class="flex items-center gap-2 mb-1">
        <span class="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold tracking-widest border border-white/30">WELCOME</span>
      </div>
      <h2 class="text-3xl font-black italic tracking-tighter drop-shadow-lg">
        BioPage_Of_<span class="text-yellow-300">KiraS</span>
      </h2>
      <p class="text-sm font-medium opacity-90 mt-1 max-w-md text-blue-50">
        "你为什么不玩疯狂原始人"
      </p>
    </div>

    <!-- 装饰性斜纹 -->
    <div class="absolute top-0 right-0 w-1/2 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgNEw0IDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
// 1. 引入图片
// 注意：根据你的文件结构，可能需要两层 ../ 才能回到 src 目录
import bannerImg from '../../assets/noa_banner.png' 

// 如果图片挂了，显示一个纯色背景
const handleError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none';
  (e.target as HTMLElement).parentElement?.classList.add('bg-ba-primary');
}
</script>