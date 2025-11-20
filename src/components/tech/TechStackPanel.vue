<template>
  <BaCard title="SKILL_DB">
    <div class="flex flex-col">
      <!-- 移除了原本的 h-full 限制，让高度自适应 -->
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="skill in techStack" 
          :key="skill.name"
          class="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded hover:border-ba-primary transition-colors cursor-default flex items-center gap-1.5 grow sm:grow-0"
          :title="`${skill.category} - ${skill.level}`"
        >
          <div 
            class="w-1.5 h-1.5 rounded-full shrink-0"
            :class="{
              'bg-green-400': skill.level === 'proficient',
              'bg-blue-400': skill.level === 'familiar',
              'bg-slate-300': skill.level === 'learning',
            }"
          ></div>
          <span class="text-xs font-bold text-slate-600 whitespace-nowrap">{{ skill.name }}</span>
        </div>
      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import BaCard from '../ui/BaCard.vue'
import { techStack } from '../../config/data'
</script>