<template>
  <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-[-1] bg-ba-bg"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 配置
const GRID_SPACING = 40 // 网格间距
const MOUSE_RADIUS = 200 // 鼠标影响范围
const STIFFNESS = 0.03 // 弹性系数 (越小越软)
const DAMPING = 0.9 // 阻尼 (越小停得越快)
const HALO_COUNT = 3 // 背景光环数量

interface Point {
  x: number; y: number; // 当前位置
  ox: number; oy: number; // 原始位置 (Origin)
  vx: number; vy: number; // 速度
  color: string;
}

interface Halo {
  x: number; y: number; radius: number; speed: number; angle: number; color: string; type: number;
}

let points: Point[] = []
let halos: Halo[] = []
let mouse = { x: -1000, y: -1000 }
let width = 0, height = 0
let animationId: number

const COLORS = ['rgba(0, 164, 219, 0.3)', 'rgba(45, 55, 72, 0.15)']

// 初始化网格点
const initGrid = () => {
  points = []
  for (let x = 0; x <= width; x += GRID_SPACING) {
    for (let y = 0; y <= height; y += GRID_SPACING) {
      points.push({
        x, y,
        ox: x, oy: y,
        vx: 0, vy: 0,
        color: (x % (GRID_SPACING*2) === 0 && y % (GRID_SPACING*2) === 0) ? COLORS[0] : COLORS[1] // 交叉点颜色不同
      })
    }
  }
}

// 初始化光环
const initHalos = () => {
  halos = []
  for (let i = 0; i < HALO_COUNT; i++) {
    halos.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 100 + 50,
      speed: (Math.random() - 0.5) * 0.01,
      angle: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? 'rgba(0, 164, 219, 0.05)' : 'rgba(255, 126, 126, 0.05)',
      type: Math.floor(Math.random() * 3) // 0: 实线圈, 1: 虚线圈, 2: 双圈
    })
  }
}

// 绘制光环
const drawHalo = (ctx: CanvasRenderingContext2D, h: Halo) => {
  ctx.save()
  ctx.translate(h.x, h.y)
  ctx.rotate(h.angle)
  ctx.strokeStyle = h.color
  ctx.lineWidth = 2
  
  ctx.beginPath()
  if (h.type === 0) {
    ctx.arc(0, 0, h.radius, 0, Math.PI * 2)
    ctx.stroke()
    // 十字星装饰
    ctx.translate(h.radius, 0)
    ctx.fillStyle = h.color
    ctx.fillRect(-2, -2, 4, 4)
  } else if (h.type === 1) {
    ctx.setLineDash([10, 10])
    ctx.arc(0, 0, h.radius, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    ctx.arc(0, 0, h.radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, h.radius * 0.8, 0, Math.PI * 2)
    ctx.strokeStyle = h.color.replace('0.05', '0.03')
    ctx.stroke()
  }
  ctx.restore()
}

const animate = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  // 1. 绘制光环 (底层)
  halos.forEach(h => {
    h.angle += h.speed
    drawHalo(ctx, h)
  })

  // 2. 绘制网格点 (上层 - 物理交互核心)
  points.forEach(p => {
    // 计算鼠标排斥力
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < MOUSE_RADIUS) {
      const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
      const angle = Math.atan2(dy, dx)
      // 像水流一样推开
      const pushX = Math.cos(angle) * force * 15 
      const pushY = Math.sin(angle) * force * 15
      p.vx -= pushX
      p.vy -= pushY
    }

    // 弹簧力 (回归原点)
    const homeDx = p.ox - p.x
    const homeDy = p.oy - p.y
    p.vx += homeDx * STIFFNESS
    p.vy += homeDy * STIFFNESS

    // 摩擦力
    p.vx *= DAMPING
    p.vy *= DAMPING

    // 更新位置
    p.x += p.vx
    p.y += p.vy

    // 绘制点 (十字形比圆形更有科技感)
    ctx.fillStyle = p.color
    
    // 如果点移动剧烈，稍微放大
    const speed = Math.abs(p.vx) + Math.abs(p.vy)
    const size = speed > 0.5 ? 2.5 : 1.5
    
    ctx.beginPath()
    // 绘制小十字
    ctx.fillRect(p.x - size, p.y - 0.5, size * 2, 1)
    ctx.fillRect(p.x - 0.5, p.y - size, 1, size * 2)
  })

  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  if (canvasRef.value) {
    width = window.innerWidth; height = window.innerHeight
    canvasRef.value.width = width; canvasRef.value.height = height
    initGrid()
    initHalos()
  }
}

const handleMouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX; mouse.y = e.clientY
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  handleResize()
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  cancelAnimationFrame(animationId)
})
</script>