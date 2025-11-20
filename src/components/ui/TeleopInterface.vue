<template>
  <BaCard title="TELEOP_INTERFACE" class="h-full select-none border-t-4 border-t-ba-primary">
    <div class="flex h-full gap-0 divide-x divide-slate-200">
      
      <!-- 左侧：物理交互视窗 -->
      <div 
        class="relative flex-1 bg-slate-50 overflow-hidden cursor-crosshair group z-0"
        :class="{ 'grayscale-[50%] contrast-125 bg-red-50/50': isEStop }"
        ref="containerRef"
        @mousemove="handleMouseMove"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @mouseenter="isTracking = true"
        
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <!-- ================= BACKGROUND LAYERS ================= -->
        <div class="absolute top-10 left-10 opacity-[0.08] animate-[spin_20s_linear_infinite] pointer-events-none z-0">
           <svg width="300" height="300" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00a4db" stroke-width="2" stroke-dasharray="10 5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#00a4db" stroke-width="1" />
              <path d="M 50 5 L 50 15 M 50 85 L 50 95 M 5 50 L 15 50 M 85 50 L 95 50" stroke="#00a4db" stroke-width="4" />
           </svg>
        </div>

        <!-- 进货滑梯 (加长了支架，适应更高的高度) -->
        <svg class="absolute top-0 left-0 w-48 h-full pointer-events-none z-0 overflow-visible opacity-90">
           <defs>
              <linearGradient id="chuteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stop-color="#e2e8f0" />
                 <stop offset="100%" stop-color="#94a3b8" />
              </linearGradient>
           </defs>
           <!-- 滑道主体 -->
           <path d="M -20 -20 L 100 -20 L 80 80 L -20 120 Z" fill="url(#chuteGrad)" stroke="#64748b" stroke-width="1" />
           <!-- 支撑结构 (延伸到底部) -->
           <rect x="70" y="80" width="6" height="100%" fill="#cbd5e1" />
           <text x="10" y="60" font-size="10" fill="#64748b" font-weight="bold">FEEDER_01</text>
        </svg>

        <!-- ================= FLOOR STRUCTURES ================= -->
        <!-- 地面容器 (高度固定 48px) -->
        <div class="absolute bottom-0 left-0 w-full h-12 z-10 flex">
           <!-- 左侧：静态接料台 -->
           <div class="w-[40%] h-full bg-slate-300 border-t-4 border-slate-400 relative box-border z-10">
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:8px_8px]"></div>
              <div class="absolute bottom-2 left-2 text-[8px] font-black text-slate-500 tracking-widest">PICK_ZONE</div>
           </div>

           <!-- 右侧：动态传送带 -->
           <div class="flex-1 h-full relative overflow-hidden border-t-4 transition-colors duration-500 z-10"
                :class="(conveyorOn && !isEStop) ? 'bg-[#2d3748] border-slate-600' : 'bg-[#1a202c] border-slate-700'">
              
              <div 
                class="absolute inset-0 flex gap-6 animate-conveyor transition-opacity duration-300" 
                :class="(conveyorOn && !isEStop) ? 'opacity-100' : 'opacity-30'"
                :style="{ animationPlayState: (conveyorOn && !isEStop) ? 'running' : 'paused' }"
              >
                 <div v-for="i in 15" :key="i" class="w-2 h-full bg-slate-600/50 skew-x-[-20deg]"></div>
              </div>
              
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div v-if="isEStop" class="text-red-500/50 font-black text-lg tracking-[0.5em] animate-pulse">/// HALTED ///</div>
                 <div v-else-if="!conveyorOn" class="text-yellow-500/30 font-black text-xs tracking-[0.2em]">[ MOTOR_OFF ]</div>
                 <div v-else class="text-green-400/10 font-black text-4xl tracking-widest skew-x-[-20deg] animate-pulse-slow w-full text-center">>>>>>>>></div>
              </div>

              <div class="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
              <div class="absolute bottom-0 left-0 w-full h-2 opacity-80"
                   :class="(conveyorOn && !isEStop) ? 'bg-[repeating-linear-gradient(45deg,#facc15,#facc15_10px,#000_10px,#000_20px)]' : 'bg-[repeating-linear-gradient(45deg,#555,#555_10px,#000_10px,#000_20px)]'">
              </div>
           </div>
        </div>

        <!-- 信号灯 -->
        <div class="absolute bottom-12 right-2 z-20 flex flex-col gap-1 bg-slate-800 p-1 rounded border border-slate-600 shadow-lg">
           <div class="w-2 h-2 rounded-full transition-all duration-300" :class="(isEStop || !conveyorOn) ? 'bg-red-500 shadow-[0_0_8px_#ef4444] scale-110' : 'bg-red-900'"></div>
           <div class="w-2 h-2 rounded-full transition-all duration-300" :class="(conveyorOn && !isEStop) ? 'bg-green-500 shadow-[0_0_8px_#22c55e] scale-110' : 'bg-green-900'"></div>
        </div>

        <!-- 出货隧道 -->
        <div class="absolute bottom-12 right-0 w-8 h-24 bg-slate-700 border-l-4 border-slate-500 z-0 flex flex-col items-center justify-start pt-1 overflow-hidden">
           <div class="w-4 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
           <div class="flex w-full h-full mt-1 opacity-50">
              <div class="flex-1 bg-black/40 border-r border-black/20 h-[80%]"></div>
              <div class="flex-1 bg-black/40 border-r border-black/20 h-[90%]"></div>
              <div class="flex-1 bg-black/40 border-r border-black/20 h-[75%]"></div>
           </div>
        </div>

        <!-- ================= OBJECTS ================= -->
        <!-- 阴影 -->
        <div 
           class="absolute w-10 h-2 bg-black/30 rounded-[100%] blur-[2px] pointer-events-none will-change-transform z-20"
           :style="{ 
             left: `${box.x - 20}px`, 
             top: `${floorY + 10}px`, 
             opacity: Math.max(0, 0.8 - (floorY - box.y)/200), 
             transform: `scale(${Math.max(0.2, 1 - (floorY - box.y)/400)})`
           }"
        ></div>

        <!-- 物理对象 -->
        <div 
          class="absolute w-12 h-12 flex items-center justify-center pointer-events-none will-change-transform z-20"
          :style="{ 
             left: `${box.x - 24}px`, 
             top: `${box.y - 24}px`, 
             transform: `rotate(${box.rotation}deg)` 
          }"
        >
          <img src="https://api.dicebear.com/9.x/shapes/svg?seed=Box123&backgroundColor=f59e0b" class="w-full h-full object-contain drop-shadow-md rounded-sm border border-white/20" alt="Package" />
          <div class="absolute bg-white w-6 h-4 top-2 shadow-sm flex flex-col gap-[1px] p-[2px] rotate-3">
             <div class="h-[1px] w-full bg-black/50"></div>
             <div class="h-[1px] w-[80%] bg-black/50"></div>
          </div>
        </div>

        <!-- 锁定框 -->
        <div 
          class="absolute w-16 h-16 border pointer-events-none transition-all duration-150 z-30"
          :class="box.isCaught ? 'border-ba-primary shadow-[0_0_15px_rgba(0,164,219,0.4)] scale-110' : (canGrab ? 'border-yellow-400 opacity-60' : 'border-slate-300 opacity-0 scale-90')"
          :style="{ left: `${box.x - 32}px`, top: `${box.y - 32}px` }"
        >
           <div class="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-inherit bg-white/0"></div>
           <div class="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-inherit bg-white/0"></div>
           <div class="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-inherit bg-white/0"></div>
           <div class="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-inherit bg-white/0"></div>
           <div v-if="box.isCaught" class="absolute -top-5 left-1/2 -translate-x-1/2 bg-ba-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-sm tracking-wider shadow-sm whitespace-nowrap">
              TARGET ACQUIRED
           </div>
        </div>

        <!-- ================= ROBOT ARM ================= -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-40 drop-shadow-xl">
          <defs>
             <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f1f5f9" />
                <stop offset="50%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#cbd5e1" />
             </linearGradient>
          </defs>
          
          <path d="M -30 20 L 30 20 L 20 0 L -20 0 Z" fill="url(#metalGrad)" stroke="#94a3b8" :transform="`translate(${baseX}, ${baseY})`" />
          <!-- [FIX] 这里的 y=20 是相对于 baseY 的，确保它看起来像是坐在地上 -->
          <rect x="-35" y="20" width="70" height="4" fill="#2d3748" :transform="`translate(${baseX}, ${baseY})`" />
          
          <g :transform="`translate(${baseX}, ${baseY}) rotate(${toDeg(joints.theta1)})`">
            <rect x="0" y="-12" :width="L1" height="24" rx="4" fill="white" stroke="#cbd5e1" stroke-width="1" />
            <rect x="10" y="-3" :width="L1-20" height="6" fill="#00a4db" class="opacity-20" />
            <text x="15" y="2" font-size="5" fill="#00a4db" font-weight="bold" font-family="Arial">SCHALE-IND</text>
            <circle cx="0" cy="0" r="9" fill="white" stroke="#94a3b8" stroke-width="2" />
            <circle cx="0" cy="0" r="3" fill="#2d3748" />

            <g :transform="`translate(${L1}, 0) rotate(${toDeg(joints.theta2)})`">
              <rect x="0" y="-8" :width="L2" height="16" rx="3" fill="white" stroke="#cbd5e1" stroke-width="1" />
              <rect :x="L2-20" y="-8" width="5" height="16" fill="#fbbf24" />
              <text x="10" y="2" font-size="4" fill="#64748b">ROBO-V2</text>
              <circle cx="0" cy="0" r="7" fill="white" stroke="#94a3b8" stroke-width="2" />
              <circle cx="0" cy="0" r="2" fill="#00a4db" />
              
              <g :transform="`translate(${L2}, 0)`">
                <path d="M 0 -8 L 14 -6 L 14 6 L 0 8 Z" fill="#1e293b" />
                <circle cx="0" cy="0" r="5" fill="#00a4db" />
                <circle cx="0" cy="0" r="2" fill="white" />
                <g :transform="`translate(10, -5) rotate(${gripperOpen ? -30 : 5})`" class="transition-all duration-150">
                  <rect x="0" y="-2.5" width="16" height="5" rx="1" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5" />
                  <rect x="12" y="-2.5" width="6" height="5" rx="1" :fill="box.isCaught ? '#22c55e' : '#64748b'" /> 
                </g>
                <g :transform="`translate(10, 5) rotate(${gripperOpen ? 30 : -5})`" class="transition-all duration-150">
                   <rect x="0" y="-2.5" width="16" height="5" rx="1" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5" />
                   <rect x="12" y="-2.5" width="6" height="5" rx="1" :fill="box.isCaught ? '#22c55e' : '#64748b'" />
                </g>
                <g :transform="`translate(12, 0) rotate(${gripperOpen ? -5 : 0})`" class="transition-all duration-150">
                   <rect x="0" y="-2" width="18" height="4" rx="1" fill="#94a3b8" />
                   <rect x="14" y="-2" width="6" height="4" rx="1" :fill="box.isCaught ? '#16a34a' : '#475569'" />
                </g>
              </g>
            </g>
          </g>
        </svg>
        
        <!-- HUD LAYER -->
        <div class="absolute inset-0 pointer-events-none z-50 opacity-80">
           <div class="absolute top-2 left-0 right-0 flex justify-center items-center z-20 pointer-events-none">
              <div class="flex items-center gap-4 bg-white/60 backdrop-blur px-4 py-1 rounded-full border border-slate-200 shadow-sm">
                  <div class="flex items-center gap-2 border-r border-slate-300 pr-3">
                      <div class="w-1.5 h-1.5 rounded-full bg-ba-primary"></div>
                      <span class="text-[9px] font-black text-slate-600 tracking-widest">CAM_03</span>
                  </div>
                  <div class="flex items-center gap-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      <span class="text-[8px] font-bold text-red-500">REC</span>
                  </div>
              </div>
           </div>
           <div class="absolute top-[40px] left-0 w-full h-[1px] border-t border-dashed border-red-500/20 pointer-events-none"></div>
        </div>
        
        <div v-if="isEStop" class="absolute inset-0 flex items-center justify-center z-50 overflow-hidden">
           <div class="absolute inset-0 bg-red-500/10 animate-pulse"></div>
           <div class="bg-red-600 text-white px-8 py-4 font-black text-3xl border-4 border-white shadow-[0_0_30px_rgba(220,38,38,0.6)] transform -rotate-6 tracking-widest z-50 whitespace-nowrap">
              ⚠️ EMERGENCY STOP
           </div>
           <div class="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(220,38,38,0.1)_20px,rgba(220,38,38,0.1)_40px)] pointer-events-none"></div>
        </div>
      </div>

      <!-- 右侧：控制面板 (Flex 布局优化) -->
      <div class="w-[140px] bg-white flex flex-col p-2 shrink-0 z-50 shadow-xl relative h-full">
        <div class="absolute top-0 right-0 w-1 h-full bg-ba-primary/20"></div>
        
        <!-- 顶部标题 -->
        <div class="border-b-2 border-slate-100 pb-1 mt-1 mb-2 shrink-0">
             <span class="text-[9px] font-black text-slate-700 tracking-widest uppercase">Robo_Arm_V2</span>
        </div>

        <!-- 中间内容区 (Flex Grow) -->
        <div class="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
          
          <!-- 坐标显示 -->
          <div class="bg-slate-50 p-2 rounded border border-slate-100 relative overflow-hidden shrink-0">
             <div class="flex justify-between text-[9px] font-mono text-slate-500 relative z-10">
                <span>X_AXIS</span><span class="font-bold text-ba-primary">{{ (target.x - baseX).toFixed(0) }}</span>
             </div>
             <div class="flex justify-between text-[9px] font-mono text-slate-500 relative z-10">
                <span>Y_AXIS</span><span class="font-bold text-ba-primary">{{ (baseY - target.y).toFixed(0) }}</span>
             </div>
          </div>
          
          <!-- 传送带开关 -->
          <div class="flex flex-col gap-1 shrink-0">
             <span class="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Conveyor Belt</span>
             <button 
                @click="toggleConveyor"
                class="flex items-center justify-between px-2 py-2 rounded border text-[9px] font-bold transition-all shadow-sm group"
                :class="conveyorOn ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'"
                :disabled="isEStop"
             >
                <span class="group-hover:scale-105 transition-transform">{{ conveyorOn ? 'RUNNING' : 'PAUSED' }}</span>
                <span class="w-2 h-2 rounded-full shadow-sm" :class="conveyorOn ? 'bg-green-500 animate-pulse' : 'bg-slate-400'"></span>
             </button>
          </div>
          
          <!-- 填充空隙 -->
          <div class="flex-1"></div>
        </div>

        <!-- 底部按钮区 (固定底部) -->
        <div class="flex flex-col gap-2 mt-auto pt-2 shrink-0">
           <button 
             class="w-full py-3 bg-white border border-slate-200 text-slate-600 text-[9px] font-bold rounded hover:bg-ba-primary hover:text-white hover:border-ba-primary active:scale-95 transition-all shadow-sm"
             @click="resetSystem" 
             :disabled="isEStop"
           >
             RESET POS
           </button>
           
           <button 
             @click="toggleEStop"
             class="w-full py-4 text-[10px] font-black tracking-widest rounded transition-all border-2 shadow-md overflow-hidden relative group"
             :class="isEStop 
               ? 'bg-yellow-400 text-yellow-900 border-yellow-500' 
               : 'bg-red-50 text-red-500 border-red-100 hover:border-red-500'"
           >
             <span class="relative z-10">{{ isEStop ? 'RELEASE' : 'ACTIVATE' }}</span>
             <div v-if="!isEStop" class="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-0"></div>
             <span v-if="!isEStop" class="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 z-10">ACTIVATE</span>
           </button>
        </div>
      </div>
    </div>
  </BaCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import BaCard from './BaCard.vue'

const L1 = 110, L2 = 100 
const baseX = ref(150), baseY = ref(220) 
// 地面高度常量 (48px)
const FLOOR_HEIGHT = 48

const containerRef = ref<HTMLElement | null>(null)
const isTracking = ref(false)
const gripperOpen = ref(true)
const isEStop = ref(false)
const conveyorOn = ref(true)

const target = reactive({ x: 150, y: 100 })
const joints = reactive({ theta1: -Math.PI / 2, theta2: 0 })
const endEffector = reactive({ x: 0, y: 0 })
const prevEffector = reactive({ x: 0, y: 0 })

const BOX_RADIUS = 24 
const box = reactive({ x: 40, y: 40, vx: 0, vy: 0, rotation: 0, vr: 0, isCaught: false })

const GRAVITY = 0.6
const FRICTION = 0.90 
const BOUNCE = -0.3   
const CEILING_BOUNCE = -0.5
const CONVEYOR_SPEED = 1.5 

// [FIX] 动态计算地面 Y 坐标
const floorY = computed(() => {
  if (!containerRef.value) return 300
  return containerRef.value.clientHeight - FLOOR_HEIGHT - BOX_RADIUS
})

const tunnelThreshold = computed(() => floorY.value - 50)

const canGrab = computed(() => {
  if (box.isCaught) return true
  const dx = box.x - endEffector.x
  const dy = box.y - (endEffector.y + 20)
  const dist = Math.sqrt(dx*dx + dy*dy)
  return dist < 50
})

const toDeg = (rad: number) => rad * (180 / Math.PI)

const solveIK = (x: number, y: number) => {
  const dx = x - baseX.value
  const dy = y - baseY.value
  const dist = Math.sqrt(dx * dx + dy * dy)
  const maxReach = L1 + L2 - 2
  let tx = dx, ty = dy
  if (dist > maxReach) {
    const ratio = maxReach / dist; tx = dx * ratio; ty = dy * ratio
  } else if (dist < 20) { tx = 20; ty = 0 }

  const c2 = (tx * tx + ty * ty - L1 * L1 - L2 * L2) / (2 * L1 * L2)
  const clampedC2 = Math.max(-1, Math.min(1, c2))
  const s2 = -Math.sqrt(1 - clampedC2 * clampedC2)
  const theta2 = Math.atan2(s2, clampedC2)
  const k1 = L1 + L2 * clampedC2, k2 = L2 * s2
  const theta1 = Math.atan2(ty, tx) - Math.atan2(k2, k1)
  return { theta1, theta2 }
}

const updateFK = () => {
  const j1 = joints.theta1, j2 = joints.theta1 + joints.theta2
  endEffector.x = baseX.value + L1 * Math.cos(j1) + L2 * Math.cos(j2)
  endEffector.y = baseY.value + L1 * Math.sin(j1) + L2 * Math.sin(j2)
}

const updateArmPosition = (mx: number, my: number) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = Math.max(10, Math.min(rect.width - 10, mx))
  const y = Math.max(40, Math.min(rect.height - 50, my))
  target.x = x; target.y = y
  const sol = solveIK(target.x, target.y)
  joints.theta1 = sol.theta1; joints.theta2 = sol.theta2
  updateFK()
}

let animationId: number
const physicsLoop = () => {
  if (!isEStop.value) {
    const velX = endEffector.x - prevEffector.x
    const velY = endEffector.y - prevEffector.y
    
    if (box.isCaught) {
      box.x = endEffector.x + 25 
      box.y = endEffector.y + 10
      box.vx = velX; box.vy = velY
      box.vr = 0
      box.rotation = box.rotation * 0.8
    } else {
      box.vy += GRAVITY
      box.x += box.vx; box.y += box.vy; box.rotation += box.vr
      
      if (containerRef.value) {
        const w = containerRef.value.clientWidth
        const conveyorStartX = w * 0.4 
        
        if (box.y > floorY.value) {
          box.y = floorY.value
          box.vy *= BOUNCE
          box.vr *= 0.8

          if (box.x < conveyorStartX) {
             box.vx *= 0.8 
          } else {
             box.vx *= FRICTION
             if (conveyorOn.value) {
                box.vx += (CONVEYOR_SPEED - box.vx) * 0.2
             }
          }
        }

        if (box.x < BOX_RADIUS) { box.x = BOX_RADIUS; box.vx *= BOUNCE }
        if (box.x > w - BOX_RADIUS) {
           if (box.y > tunnelThreshold.value && box.x > w + BOX_RADIUS + 10) {
              box.x = 40; box.y = 40; box.vx = 3; box.vy = 2; box.rotation = 0
           } else if (box.y <= tunnelThreshold.value) {
              box.x = w - BOX_RADIUS; box.vx *= BOUNCE
           }
        }
        if (box.y < BOX_RADIUS) { box.y = BOX_RADIUS; box.vy *= CEILING_BOUNCE }
      }
    }
    prevEffector.x = endEffector.x
    prevEffector.y = endEffector.y
  }
  animationId = requestAnimationFrame(physicsLoop)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value || isEStop.value) return
  const rect = containerRef.value.getBoundingClientRect()
  updateArmPosition(e.clientX - rect.left, e.clientY - rect.top)
}
const handleMouseDown = () => { if(!isEStop.value) { gripperOpen.value = false; if (canGrab.value) box.isCaught = true } }
const handleMouseUp = () => { if(!isEStop.value) { gripperOpen.value = true; if (box.isCaught) { box.isCaught = false; box.vx *= 1.5; box.vy *= 1.5; box.vr = Math.max(-10, Math.min(10, (Math.random() - 0.5) * 5)) } } }
const handleMouseLeave = () => { isTracking.value = false; gripperOpen.value = true; if(box.isCaught) box.isCaught = false }
const getTouchPos = (e: TouchEvent) => {
  const rect = containerRef.value!.getBoundingClientRect()
  return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
}
const handleTouchStart = (e: TouchEvent) => {
  if (isEStop.value) return
  isTracking.value = true
  const pos = getTouchPos(e)
  updateArmPosition(pos.x, pos.y)
  gripperOpen.value = false
  if (canGrab.value) box.isCaught = true
}
const handleTouchMove = (e: TouchEvent) => { if (isEStop.value) return; const pos = getTouchPos(e); updateArmPosition(pos.x, pos.y) }
const handleTouchEnd = () => { if (isEStop.value) return; isTracking.value = false; gripperOpen.value = true; if (box.isCaught) { box.isCaught = false; box.vx *= 1.5; box.vy *= 1.5 } }

const toggleEStop = () => isEStop.value = !isEStop.value
const toggleConveyor = () => conveyorOn.value = !conveyorOn.value

const resetSystem = () => {
  if (containerRef.value) {
     // [FIX] 物体生成在左侧台面上 (动态高度)
     box.x = 60
     box.y = floorY.value - 50 // 从上方掉落
  } else {
     box.x = 50; box.y = 100
  }
  box.vx = 0; box.vy = 0
  joints.theta1 = -Math.PI / 3; joints.theta2 = -Math.PI / 3
  updateFK(); box.rotation = 0; box.isCaught = false; isEStop.value = false
}

onMounted(() => {
  if (containerRef.value) {
    baseX.value = containerRef.value.clientWidth * 0.42
    // [FIX] 基座高度动态锚定在地面上 (ClientHeight - 48px)
    // 减去一点点(12px)让基座看起来像是陷在传送带后面/上面
    baseY.value = containerRef.value.clientHeight - FLOOR_HEIGHT - 12
    
    // 延迟一帧重置，确保尺寸已更新
    requestAnimationFrame(resetSystem)
  }
  updateFK()
  physicsLoop()
})
onUnmounted(() => cancelAnimationFrame(animationId))
</script>

<style scoped>
.animate-conveyor { animation: conveyor-scroll 1s linear infinite; }
.animate-pulse-slow { animation: pulse 3s infinite; }
@keyframes conveyor-scroll { from { transform: translateX(0); } to { transform: translateX(40px); } }
</style>