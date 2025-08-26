<template>
  <div 
    class="tech-background" 
    ref="backgroundRef"
    :class="backgroundClasses"
  >
    <canvas 
      v-if="shouldRenderCanvas" 
      ref="canvasRef" 
      class="tech-canvas"
      :style="canvasStyles"
    ></canvas>
    
    <div 
      v-if="shouldRenderGrid" 
      class="tech-grid"
      :style="gridStyles"
    ></div>
    
    <div 
      v-if="shouldRenderGlowEffects" 
      class="tech-glow-effects"
    >
      <div class="glow-orb glow-orb-1"></div>
      <div class="glow-orb glow-orb-2"></div>
      <div class="glow-orb glow-orb-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { detectDeviceCapabilities, debounce, throttle } from '../utils/performance'

interface Props {
  intensity?: 'low' | 'medium' | 'high'
  enableParticles?: boolean
  enableGrid?: boolean
  enableGlowEffects?: boolean
  adaptiveQuality?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'medium',
  enableParticles: true,
  enableGrid: true,
  enableGlowEffects: true,
  adaptiveQuality: true
})

const backgroundRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

let animationId: number
let particles: Particle[] = []
let lastFrameTime = 0
let frameCount = 0
let fps = 60

// 设备性能检测
const deviceCapabilities = ref(detectDeviceCapabilities())

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  lastUpdate: number
}

// 计算属性：根据设备性能调整渲染选项
const shouldRenderCanvas = computed(() => {
  if (!props.enableParticles) return false
  if (deviceCapabilities.value.preferReducedMotion) return false
  if (deviceCapabilities.value.isLowEnd && props.intensity === 'high') return false
  return deviceCapabilities.value.supportsComplexEffects
})

const shouldRenderGrid = computed(() => {
  if (!props.enableGrid) return false
  if (deviceCapabilities.value.preferReducedMotion) return false
  return true
})

const shouldRenderGlowEffects = computed(() => {
  if (!props.enableGlowEffects) return false
  if (deviceCapabilities.value.preferReducedMotion) return false
  if (deviceCapabilities.value.isLowEnd) return false
  return deviceCapabilities.value.supportsComplexEffects
})

// 背景容器类名
const backgroundClasses = computed(() => ({
  'tech-background--low-performance': deviceCapabilities.value.isLowEnd,
  'tech-background--reduced-motion': deviceCapabilities.value.preferReducedMotion,
  [`tech-background--${props.intensity}`]: true
}))

// Canvas样式
const canvasStyles = computed(() => ({
  opacity: deviceCapabilities.value.isLowEnd ? '0.5' : '1'
}))

// 网格样式
const gridStyles = computed(() => {
  const baseSize = props.intensity === 'low' ? 100 : props.intensity === 'medium' ? 50 : 25
  const adjustedSize = deviceCapabilities.value.isLowEnd ? baseSize * 2 : baseSize
  
  return {
    backgroundSize: `${adjustedSize}px ${adjustedSize}px`,
    opacity: deviceCapabilities.value.isLowEnd ? '0.3' : '0.5'
  }
})

// 根据性能和设置初始化粒子
const initParticles = (canvas: HTMLCanvasElement) => {
  const baseCount = {
    low: 20,
    medium: 50,
    high: 100
  }[props.intensity]
  
  let particleCount = baseCount
  
  // 根据设备性能调整粒子数量
  if (deviceCapabilities.value.isLowEnd) {
    particleCount = Math.floor(particleCount * 0.3)
  } else if (deviceCapabilities.value.connectionSpeed === 'slow') {
    particleCount = Math.floor(particleCount * 0.5)
  }
  
  // 根据画布大小调整
  const canvasArea = canvas.width * canvas.height
  const maxParticles = Math.floor(canvasArea / 15000)
  particleCount = Math.min(particleCount, maxParticles)
  
  particles = []
  const now = performance.now()
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (deviceCapabilities.value.isLowEnd ? 0.2 : 0.5),
      vy: (Math.random() - 0.5) * (deviceCapabilities.value.isLowEnd ? 0.2 : 0.5),
      size: Math.random() * (deviceCapabilities.value.isLowEnd ? 1.5 : 2) + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#00d4ff' : '#6c5ce7',
      lastUpdate: now
    })
  }
}

// 优化的粒子更新函数
const updateParticles = (canvas: HTMLCanvasElement, deltaTime: number) => {
  const now = performance.now()
  
  particles.forEach(particle => {
    // 跳帧优化：低性能设备减少更新频率
    if (deviceCapabilities.value.isLowEnd && now - particle.lastUpdate < 32) {
      return
    }
    
    particle.x += particle.vx * deltaTime * 0.016 // 标准化到60fps
    particle.y += particle.vy * deltaTime * 0.016
    
    // 边界检测
    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
    
    // 保持在画布内
    particle.x = Math.max(0, Math.min(canvas.width, particle.x))
    particle.y = Math.max(0, Math.min(canvas.height, particle.y))
    
    particle.lastUpdate = now
  })
}

// 优化的粒子绘制函数
const drawParticles = (ctx: CanvasRenderingContext2D) => {
  particles.forEach(particle => {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color
    
    // 低性能设备跳过阴影效果
    if (!deviceCapabilities.value.isLowEnd) {
      ctx.shadowBlur = 10
      ctx.shadowColor = particle.color
    }
    
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  })
}

// 优化的连接线绘制函数
const drawConnections = (ctx: CanvasRenderingContext2D) => {
  // 低性能设备跳过连接线
  if (deviceCapabilities.value.isLowEnd) return
  
  const maxDistance = props.intensity === 'low' ? 80 : props.intensity === 'medium' ? 100 : 120
  const maxConnections = Math.min(particles.length * 2, 50) // 限制连接数量
  let connectionCount = 0
  
  for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
    for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.2
        ctx.save()
        ctx.globalAlpha = opacity
        ctx.strokeStyle = '#00d4ff'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
        ctx.restore()
        connectionCount++
      }
    }
  }
}

// 性能监控和自适应调整
const monitorPerformance = (currentTime: number) => {
  frameCount++
  
  if (currentTime - lastFrameTime >= 1000) {
    fps = frameCount
    frameCount = 0
    lastFrameTime = currentTime
    
    // 如果帧率过低，自动降低质量
    if (props.adaptiveQuality && fps < 30 && !deviceCapabilities.value.isLowEnd) {
      deviceCapabilities.value.isLowEnd = true
      console.warn('Performance degraded, switching to low-end mode')
      
      // 重新初始化粒子系统
      const canvas = canvasRef.value
      if (canvas) {
        initParticles(canvas)
      }
    }
  }
}

// 优化的动画循环
const animate = (currentTime: number) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 性能监控
  monitorPerformance(currentTime)
  
  // 计算时间差
  const deltaTime = currentTime - (animate as any).lastTime || 16
  ;(animate as any).lastTime = currentTime
  
  // 限制最大时间差，避免大幅跳跃
  const clampedDelta = Math.min(deltaTime, 32)
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 更新和绘制粒子
  updateParticles(canvas, clampedDelta)
  
  // 根据性能决定是否绘制连接线
  if (!deviceCapabilities.value.isLowEnd || fps > 45) {
    drawConnections(ctx)
  }
  
  drawParticles(ctx)
  
  animationId = requestAnimationFrame(animate)
}

// 防抖的画布大小调整
const resizeCanvas = debounce(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  // 使用设备像素比优化清晰度
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  
  // 低性能设备使用较低的像素比
  const effectiveDpr = deviceCapabilities.value.isLowEnd ? Math.min(dpr, 1.5) : dpr
  
  canvas.width = rect.width * effectiveDpr
  canvas.height = rect.height * effectiveDpr
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(effectiveDpr, effectiveDpr)
  }
  
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  
  initParticles(canvas)
}, 250)

// 节流的可见性检查
const handleVisibilityChange = throttle(() => {
  if (document.hidden) {
    // 页面不可见时暂停动画
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  } else {
    // 页面可见时恢复动画
    if (shouldRenderCanvas.value) {
      animationId = requestAnimationFrame(animate)
    }
  }
}, 100)

// 监听设备性能变化
watch(() => deviceCapabilities.value.preferReducedMotion, (newValue) => {
  if (newValue && animationId) {
    cancelAnimationFrame(animationId)
  } else if (!newValue && shouldRenderCanvas.value) {
    animationId = requestAnimationFrame(animate)
  }
})

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas || !shouldRenderCanvas.value) return
  
  resizeCanvas()
  
  // 延迟启动动画，避免阻塞页面加载
  setTimeout(() => {
    animationId = requestAnimationFrame(animate)
  }, 100)
  
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style lang="scss" scoped>
.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  
  // 性能优化：使用GPU加速
  will-change: transform;
  transform: translateZ(0);
  
  // 低性能设备优化
  &--low-performance {
    .tech-canvas {
      opacity: 0.5;
    }
    
    .tech-grid {
      opacity: 0.3;
      background-size: 100px 100px !important;
    }
    
    .glow-orb {
      filter: blur(20px);
      opacity: 0.5;
    }
  }
  
  // 减少动画偏好
  &--reduced-motion {
    .tech-grid,
    .glow-orb {
      animation: none !important;
    }
  }
  
  // 强度级别
  &--low {
    .glow-orb {
      opacity: 0.3;
    }
  }
  
  &--medium {
    .glow-orb {
      opacity: 0.5;
    }
  }
  
  &--high {
    .glow-orb {
      opacity: 0.7;
    }
  }
}

.tech-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  // 优化渲染性能
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
}

.tech-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  
  // GPU加速
  will-change: transform;
  transform: translateZ(0);
}

.tech-glow-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  // 优化合成层
  will-change: transform;
  transform: translateZ(0);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 6s ease-in-out infinite;
  
  // GPU加速
  will-change: transform;
  transform: translateZ(0);
  
  &.glow-orb-1 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.3), transparent);
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.glow-orb-2 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(108, 92, 231, 0.2), transparent);
    top: 60%;
    right: 20%;
    animation-delay: 2s;
  }
  
  &.glow-orb-3 {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.4), transparent);
    bottom: 30%;
    left: 60%;
    animation-delay: 4s;
  }
}

// 动画关键帧
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) scale(1) translateZ(0); 
  }
  50% { 
    transform: translateY(-20px) scale(1.1) translateZ(0); 
  }
}

// 响应式优化
@media (max-width: 768px) {
  .tech-background {
    // 移动设备减少复杂度
    &--medium,
    &--high {
      .glow-orb {
        filter: blur(20px);
        opacity: 0.3;
      }
    }
  }
  
  .glow-orb {
    &.glow-orb-1 {
      width: 150px;
      height: 150px;
    }
    
    &.glow-orb-2 {
      width: 100px;
      height: 100px;
    }
    
    &.glow-orb-3 {
      width: 80px;
      height: 80px;
    }
  }
}

@media (max-width: 480px) {
  .tech-background {
    // 小屏设备进一步简化
    .glow-orb {
      display: none;
    }
    
    .tech-grid {
      opacity: 0.2;
      background-size: 80px 80px;
    }
  }
}

// 性能优化：减少动画偏好
@media (prefers-reduced-motion: reduce) {
  .tech-grid,
  .glow-orb {
    animation: none !important;
  }
  
  .tech-background {
    .tech-canvas,
    .tech-grid,
    .glow-orb {
      will-change: auto;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .tech-grid {
    background-image: 
      linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px);
  }
  
  .glow-orb {
    &.glow-orb-1 {
      background: radial-gradient(circle, rgba(0, 255, 255, 0.5), transparent);
    }
    
    &.glow-orb-2 {
      background: radial-gradient(circle, rgba(255, 0, 255, 0.4), transparent);
    }
    
    &.glow-orb-3 {
      background: radial-gradient(circle, rgba(0, 255, 255, 0.6), transparent);
    }
  }
}

// 打印样式
@media print {
  .tech-background {
    display: none !important;
  }
}

// 低功耗模式
@media (prefers-reduced-data: reduce) {
  .tech-background {
    .tech-canvas {
      display: none;
    }
    
    .glow-orb {
      display: none;
    }
    
    .tech-grid {
      opacity: 0.1;
      animation: none;
    }
  }
}
</style>