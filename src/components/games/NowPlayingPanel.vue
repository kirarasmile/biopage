<template>
  <!-- 根元素必须是 h-full，才能撑开父容器分配的空间 -->
  <BaCard title="ACTIVITY_LOG" class="h-full flex flex-col">
    <!-- 内容区域 flex-1 -->
    <div class="flex-1 flex flex-col gap-2 p-2 overflow-y-auto pr-1 scrollbar-thin">
      
      <div 
        v-for="(game, index) in gamesPlaying" 
        :key="index"
        class="flex gap-3 p-2 rounded-lg bg-slate-50 border border-transparent hover:border-ba-primary/20 hover:bg-white transition-all shrink-0"
      >
        <!-- 封面图 -->
        <img :src="game.coverUrl" class="w-10 h-10 rounded object-cover bg-slate-200 shrink-0 shadow-sm" />
        
        <!-- 信息 -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
          <div class="flex justify-between items-center mb-0.5">
            <h4 class="font-bold text-xs text-slate-700 truncate">{{ game.title }}</h4>
            <span 
              class="text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider"
              :class="{
                'bg-blue-100 text-blue-600': game.status === 'playing',
                'bg-green-100 text-green-600': game.status === 'cleared',
                'bg-slate-200 text-slate-500': game.status === 'hiatus'
              }"
            >
              {{ game.status }}
            </span>
          </div>
          <p class="text-[10px] text-slate-400 truncate">{{ game.comment }}</p>
        </div>
      </div>
      
      <!-- 占位符，如果游戏太少，显示这个 -->
      <div v-if="gamesPlaying.length < 4" class="flex-1 flex items-center justify-center opacity-20 min-h-[40px]">
         <div class="text-[9px] font-mono text-slate-400">NO MORE ACTIVITIES</div>
      </div>

    </div>
  </BaCard>
</template>

<script setup lang="ts">
import BaCard from '../ui/BaCard.vue'
import { gamesPlaying } from '../../config/data'
</script>

<style scoped>
/* 自定义细滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>