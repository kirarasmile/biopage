<template>
  <BaCard title="MEMO_BOARD" class="h-full min-h-[500px] relative">
    <div 
      ref="boardRef"
      class="w-full h-full bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden relative group hover:border-ba-primary/30"
    >
      <!-- 背景 -->
      <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 pointer-events-none"></div>

      <!-- 磁贴 -->
      <div
        v-for="magnet in magnets"
        :key="magnet.id"
        class="absolute touch-none transition-transform will-change-transform cursor-move"
        :style="{
          left: `${magnet.x}px`,
          top: `${magnet.y}px`,
          zIndex: magnet.zIndex,
          transform: `rotate(${magnet.rotation}deg) scale(${draggedId === magnet.id ? 1.05 : 1})`,
          width: `${magnet.width || 140}px`
        }"
        @pointerdown="startDrag($event, magnet)"
      >
        <!-- 
          [样式修改重点]
          1. 移除了 bg-white, p-1.5, border (去掉了白框)
          2. 添加 group/item (用于控制删除按钮显示)
          3. 添加 min-h-[50px] (防止图片未加载时高度为0导致磁贴消失)
        -->
        <div class="group/item relative min-h-[50px]">
          
          <!-- 
            [图片样式修改]
            1. 移除了 bg-white (去掉了图片底色)
            2. 添加 drop-shadow-lg (给透明图片边缘加阴影，制造贴纸感)
          -->
          <img 
            :src="magnet.src" 
            class="pointer-events-none block w-full h-auto select-none drop-shadow-lg" 
            draggable="false" 
          />
             <div v-if="magnet.title" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {{ magnet.title }}
            </div>

          <!-- 装饰性图钉 (位置向上微调，因为去掉了padding) -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 shadow-sm border-2 border-white z-10"></div>
          
          <!-- 删除按钮 (样式优化：透明背景圆球) -->
          <button 
             @click.stop="removeMagnetItem(magnet.id)"
             @pointerdown.stop
             class="absolute -top-5 -right-5 w-6 h-6 bg-white/80 hover:bg-red-500 hover:text-white text-slate-400 rounded-full flex items-center justify-center text-[12px] opacity-0 group-hover/item:opacity-100 transition-all shadow-md backdrop-blur-sm border border-slate-200"
           >
             ×
           </button>
        </div>
      </div>
      
      <!-- 装饰文字 -->
      <div class="absolute bottom-2 right-4 text-[10px] text-slate-300 font-bold select-none pointer-events-none uppercase tracking-widest">
        Draggable Objects
      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaCard from '../ui/BaCard.vue'
import { magnetImages } from '../../config/data' 

interface Magnet {
  id: string; src: string; x: number; y: number; zIndex: number; rotation: number; width?: number;
}

const magnets = ref<Magnet[]>([])
const boardRef = ref<HTMLElement | null>(null)
const draggedId = ref<string | null>(null)
let maxZ = 10

onMounted(() => {
  if (!boardRef.value) return
  
  const containerW = boardRef.value.clientWidth
  const containerH = boardRef.value.clientHeight

  magnets.value = magnetImages.map((img: any, index: number) => {
    // 稍微分散一下位置，防止全部堆在左上角
    const safeX = 50 + (index % 3) * 150
    const safeY = 50 + Math.floor(index / 3) * 150

    return {
      ...img,
      zIndex: index + 1,
      // 如果 data.ts 里没写 x/y，就用自动计算的位置
      x: img.x ?? safeX,
      y: img.y ?? safeY,
      // 确保 width 存在
      width: img.width || 140,
      // 确保 rotation 存在
      rotation: img.rotation ?? (Math.random() * 10 - 5)
    }
  })
})

const removeMagnetItem = (id: string) => {
   magnets.value = magnets.value.filter(m => m.id !== id)
}

const startDrag = (e: PointerEvent, magnet: Magnet) => {
  if (!boardRef.value) return
  const boardRect = boardRef.value.getBoundingClientRect()
  magnet.zIndex = ++maxZ
  draggedId.value = magnet.id
  
  const startX = e.clientX
  const startY = e.clientY
  const initialX = magnet.x
  const initialY = magnet.y

  const onMove = (ev: PointerEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    
    let newX = initialX + dx
    let newY = initialY + dy

    // 简单的边界限制，防止拖丢
    const maxX = boardRect.width - 50
    const maxY = boardRect.height - 50
    newX = Math.max(-50, Math.min(newX, maxX))
    newY = Math.max(-50, Math.min(newY, maxY))

    magnet.x = newX
    magnet.y = newY
  }
  
  const onUp = () => {
    draggedId.value = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
</script>