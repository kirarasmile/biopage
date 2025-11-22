<script setup lang="ts">
import ProfileCard from './components/profile/ProfileCard.vue'
import TechStackPanel from './components/tech/TechStackPanel.vue'
import BannerCard from './components/ui/BannerCard.vue'
import NowPlayingPanel from './components/games/NowPlayingPanel.vue'
import TeleopInterface from './components/ui/TeleopInterface.vue'
import ContributionGraph from './components/ui/ContributionGraph.vue'
import MagnetBoard from './components/magnet/MagnetBoard.vue'
import InteractiveBackground from './components/ui/InteractiveBackground.vue'
import BaCard from './components/ui/BaCard.vue'
import SystemTerminal from './components/ui/SystemTerminal.vue'
import JobHistoryPanel from './components/profile/JobHistoryPanel.vue'
import ClickEffect from './components/ui/ClickEffect.vue'

const GITHUB_USERNAME = "kirarasmile" 
</script>

<template>
  <ClickEffect /> <!-- 👈 全局点击特效 -->
  <InteractiveBackground />

  <main class="w-full min-h-screen p-4 lg:p-8 max-w-[1800px] mx-auto flex flex-col relative z-10 box-border">
    
    <header class="flex-none mb-6 flex items-center justify-between select-none h-10">
      <div class="flex flex-col justify-center">
        <h1 class="text-2xl font-black text-slate-800 tracking-tighter leading-none">
          Kiras <span class="text-ba-primary">DB</span>
        </h1>
        <span class="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase pl-1">
          BioPage
        </span>
      </div>
      <div class="hidden md:block px-3 py-0.5 bg-white/80 backdrop-blur border border-slate-200 rounded text-[10px] font-mono text-ba-primary shadow-sm">
        STATUS: CONNECTED
      </div>
    </header>

    <!-- 核心网格 -->
    <!-- items-stretch: 强制让所有列的高度一致 (Grid 默认就是 stretch，但显式写出来强调) -->
    <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- 
        LEFT COLUMN 
        [Fix]: 移除了 overflow-y-auto，添加 h-full
      -->
      <div class="contents lg:flex lg:flex-col lg:col-span-3 gap-6 h-full">
         <div class="order-2 lg:order-none w-full shrink-0">
            <ProfileCard />
         </div>
         <div class="order-3 lg:order-none w-full shrink-0">
            <TechStackPanel />
         </div>
        <div class="order-4 lg:order-none w-full lg:h-[240px] shrink-0 overflow-hidden">
          <JobHistoryPanel />
        </div>
         
         <!-- Activity Log: flex-1 自动填满左侧剩余高度 -->
         <div class="order-5 lg:order-none w-full lg:flex-1 min-h-[180px]">
            <NowPlayingPanel />
         </div>
      </div>

      <!-- 
        CENTER COLUMN 
        [Fix]: 添加 h-full
      -->
      <div class="contents lg:flex lg:flex-col lg:col-span-5 gap-6 h-full">
        <div class="order-1 lg:order-none w-full h-auto shrink-0">
           <BannerCard />
        </div>
        
        <div class="hidden lg:block w-full h-[380px] shrink-0">
           <TeleopInterface />
        </div>

        <div class="hidden lg:block w-full h-[180px] shrink-0">
           <SystemTerminal />
        </div>

        <!-- Git Graph: flex-1 自动填满中间剩余高度 -->
        <!-- 如果左侧比中间高，Git Graph 会拉长；如果中间比左侧高，Activity Log 会拉长。实现绝对对齐。 -->
        <div class="hidden lg:block w-full lg:flex-1 min-h-[240px]">
           <ContributionGraph :username="GITHUB_USERNAME" />
        </div>
      </div>

      <!-- 
        RIGHT COLUMN 
        [Fix]: 添加 h-full
      -->
      <div class="contents lg:flex lg:flex-col lg:col-span-4 h-full">
         <div class="hidden lg:block w-full h-full min-h-[600px]">
            <MagnetBoard />
         </div>
      </div>
    
    </div>

    <footer class="flex-none mt-12 text-center opacity-30 text-[9px] font-mono select-none order-last pb-4">
      UID: 114514 | Power By KiraS
    </footer>
  </main>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>