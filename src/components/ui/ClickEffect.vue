<template>
  <div class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
    <div 
      v-for="click in clicks" 
      :key="click.id"
      class="absolute w-8 h-8 -ml-4 -mt-4"
      :style="{ left: click.x + 'px', top: click.y + 'px' }"
    >
      <!-- 扩散光圈 -->
      <div class="absolute inset-0 rounded-full border-2 border-ba-primary animate-ping-slow opacity-0"></div>
      <!-- 中心点 -->
      <div class="absolute inset-0 m-auto w-2 h-2 bg-ba-primary rounded-full animate-pop"></div>
      <!-- 十字星 -->
      <div class="absolute inset-0 flex items-center justify-center animate-spin-once">
         <div class="w-full h-[1px] bg-ba-primary"></div>
         <div class="h-full w-[1px] bg-ba-primary absolute"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Click {
  id: number
  x: number
  y: number
}

const clicks = ref<Click[]>([])
let idCounter = 0

const handleClick = (e: MouseEvent) => {
  const id = idCounter++
  clicks.value.push({ id, x: e.clientX, y: e.clientY })
  
  // 动画结束后移除
  setTimeout(() => {
    clicks.value = clicks.value.filter(c => c.id !== id)
  }, 600)
}

onMounted(() => window.addEventListener('click', handleClick))
onUnmounted(() => window.removeEventListener('click', handleClick))
</script>

<style scoped>
.animate-ping-slow {
  animation: ping 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}
.animate-pop {
  animation: pop 0.3s ease-out forwards;
}
.animate-spin-once {
  animation: spinOnce 0.4s ease-out forwards;
}

@keyframes ping {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(0); }
}
@keyframes spinOnce {
  0% { transform: rotate(0deg) scale(0.5); opacity: 1; }
  100% { transform: rotate(90deg) scale(1.5); opacity: 0; }
}
</style>