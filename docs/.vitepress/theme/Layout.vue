<template>
  <ErrorBoundary
    :on-error="handleError"
    :on-retry="handleRetry"
    fallback-title="页面加载失败"
    fallback-message="页面遇到了意外错误，请尝试刷新页面。"
    :show-details="isDev"
  >
    <div class="futuristic-layout" :class="layoutClasses">
      <!-- 科技背景动画组件 -->
      <TechBackground 
        v-if="shouldShowBackground"
        :intensity="backgroundIntensity"
        :adaptive-quality="true"
      />
      
      <!-- 页面过渡动画包装器 -->
      <Transition
        name="page"
        mode="out-in"
        @enter="onPageEnter"
        @leave="onPageLeave"
      >
        <!-- VitePress 默认布局 -->
        <Layout :key="route.path">
          <!-- 自定义首页插槽 -->
          <template #home-hero-before>
            <ErrorBoundary
              v-if="frontmatter.layout === 'home'"
              fallback-title="首页组件加载失败"
              fallback-message="首页英雄区组件遇到问题，请刷新页面重试。"
            >
              <FuturisticHero />
            </ErrorBoundary>
          </template>
          
          <!-- 自定义导航栏插槽 -->
          <template #nav-bar-title-after>
            <div v-if="shouldShowDecorations" class="nav-tech-accent"></div>
          </template>
          
          <!-- 自定义侧边栏插槽 -->
          <template #sidebar-nav-before>
            <div v-if="shouldShowDecorations" class="sidebar-tech-header">
              <div class="tech-glow"></div>
            </div>
          </template>
          
          <!-- 自定义内容区域包装 -->
          <template #doc-before>
            <div v-if="shouldShowAnimations" class="content-enter-animation">
              <div class="tech-scan-line"></div>
            </div>
          </template>
        </Layout>
      </Transition>
      
      <!-- 页面加载指示器 -->
      <Transition name="loading">
        <div v-if="isLoading" class="page-loading" :class="loadingClasses">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <div class="loading-text">{{ loadingText }}</div>
        </div>
      </Transition>
      
      <!-- 网络状态指示器 -->
      <Transition name="network-status">
        <div v-if="showNetworkStatus" class="network-status" :class="networkStatusClass">
          <div class="network-icon">
            <svg v-if="isOnline" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M24.24 8.64l-1.41-1.41C18.38 2.78 13.12 1.5 8.64 3.76L7.23 2.35C12.68-.48 19.32-.48 24.77 4.97l-.53.67zM1 21h22L12 10 1 21zM5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
          </div>
          <span class="network-text">{{ networkStatusText }}</span>
        </div>
      </Transition>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import TechBackground from './components/TechBackground.vue'
import FuturisticHero from './components/FuturisticHero.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { detectDeviceCapabilities, debounce, markPerformance, measurePerformance } from './utils/performance'

const { frontmatter } = useData()
const { Layout } = DefaultTheme
const route = useRoute()

// 状态管理
const isLoading = ref(false)
const deviceCapabilities = ref(detectDeviceCapabilities())
const isOnline = ref(navigator.onlineStatus ?? true)
const showNetworkStatus = ref(false)
const isDev = ref(import.meta.env.DEV)
const loadingText = ref('Loading...')

// 计算属性
const shouldShowBackground = computed(() => {
  return !deviceCapabilities.value.preferReducedMotion && 
         deviceCapabilities.value.supportsComplexEffects
})

const shouldShowAnimations = computed(() => {
  return !deviceCapabilities.value.preferReducedMotion
})

const shouldShowDecorations = computed(() => {
  return deviceCapabilities.value.supportsAnimations
})

const backgroundIntensity = computed(() => {
  if (deviceCapabilities.value.isLowEnd) return 'low'
  if (deviceCapabilities.value.connectionSpeed === 'slow') return 'medium'
  return 'high'
})

const layoutClasses = computed(() => ({
  'futuristic-layout--low-performance': deviceCapabilities.value.isLowEnd,
  'futuristic-layout--reduced-motion': deviceCapabilities.value.preferReducedMotion,
  'futuristic-layout--offline': !isOnline.value
}))

const loadingClasses = computed(() => ({
  'page-loading--simple': deviceCapabilities.value.isLowEnd
}))

const networkStatusClass = computed(() => ({
  'network-status--online': isOnline.value,
  'network-status--offline': !isOnline.value
}))

const networkStatusText = computed(() => {
  return isOnline.value ? '网络已连接' : '网络已断开'
})

// 错误处理
const handleError = (error: Error, errorInfo: any) => {
  console.error('Layout Error:', error, errorInfo)
  
  // 发送错误报告到监控服务
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false
    })
  }
}

const handleRetry = () => {
  // 重新检测设备性能
  deviceCapabilities.value = detectDeviceCapabilities()
  
  // 重新加载页面资源
  window.location.reload()
}

// 页面切换动画处理
const onPageEnter = (el: Element) => {
  markPerformance('page-enter-start')
  
  // 添加入场动画类
  el.classList.add('page-enter-active')
  
  // 为内容元素添加交错动画
  if (shouldShowAnimations.value) {
    nextTick(() => {
      const contentElements = el.querySelectorAll('.vp-doc > *')
      contentElements.forEach((element, index) => {
        if (index < 10) { // 限制动画元素数量以提高性能
          (element as HTMLElement).style.animationDelay = `${index * 0.05}s`
          element.classList.add('animate-slide-in-up')
        }
      })
      
      markPerformance('page-enter-end')
      measurePerformance('page-enter-duration', 'page-enter-start', 'page-enter-end')
    })
  }
}

const onPageLeave = (el: Element) => {
  el.classList.add('page-leave-active')
}

// 网络状态监听
const handleOnline = () => {
  isOnline.value = true
  showNetworkStatus.value = true
  loadingText.value = 'Loading...'
  
  setTimeout(() => {
    showNetworkStatus.value = false
  }, 3000)
}

const handleOffline = () => {
  isOnline.value = false
  showNetworkStatus.value = true
  loadingText.value = 'Offline mode...'
}

// 防抖的性能重新检测
const recheckPerformance = debounce(() => {
  deviceCapabilities.value = detectDeviceCapabilities()
}, 1000)

// 监听路由变化，显示加载动画
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    markPerformance('route-change-start')
    isLoading.value = true
    
    // 根据设备性能调整加载时间
    const loadingDuration = deviceCapabilities.value.isLowEnd ? 500 : 300
    
    setTimeout(() => {
      isLoading.value = false
      markPerformance('route-change-end')
      measurePerformance('route-change-duration', 'route-change-start', 'route-change-end')
    }, loadingDuration)
  }
}, { immediate: false })

// 监听窗口大小变化，重新检测性能
const handleResize = debounce(() => {
  recheckPerformance()
}, 250)

onMounted(() => {
  // 添加事件监听器
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  window.addEventListener('resize', handleResize)
  
  // 初始化性能标记
  markPerformance('layout-mounted')
  
  // 预加载关键资源
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // 在空闲时预加载资源
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = '/assets/fonts/inter.woff2'
      document.head.appendChild(link)
    })
  }
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss">
.futuristic-layout {
  position: relative;
  min-height: 100vh;
  background: var(--vp-c-bg);
  
  // 确保背景动画在最底层
  .tech-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }
}

// 页面过渡动画
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateX(0);
}

// 内容进入动画
.content-enter-animation {
  position: relative;
  
  .tech-scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
    animation: scanHorizontal 2s ease-out;
    z-index: 1;
  }
}

// 页面加载指示器
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    border-top-color: var(--vp-c-brand-2);
    animation-delay: 0.1s;
    animation-direction: reverse;
  }
  
  &:nth-child(3) {
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    border-top-color: var(--vp-c-brand-3);
    animation-delay: 0.2s;
  }
}

.loading-text {
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.3s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

// 导航栏科技感装饰
.nav-tech-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 2px;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 10px var(--vp-c-brand-1);
  animation: pulse 2s infinite;
}

// 侧边栏科技感头部
.sidebar-tech-header {
  position: relative;
  height: 60px;
  margin-bottom: 20px;
  
  .tech-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
    animation: scan 3s infinite;
  }
}

// 动画关键帧
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes scan {
  0% { transform: translate(-50%, -50%) scaleX(0); }
  50% { transform: translate(-50%, -50%) scaleX(1); }
  100% { transform: translate(-50%, -50%) scaleX(0); }
}

@keyframes scanHorizontal {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 交互动画增强
:deep(.vp-doc) {
  // 为文档内容添加悬停效果
  h1, h2, h3, h4, h5, h6 {
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      color: var(--vp-c-brand-1);
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
      
      &::before {
        content: '';
        position: absolute;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: var(--vp-c-brand-1);
        border-radius: 2px;
        opacity: 0;
        animation: slideInLeft 0.3s ease forwards;
      }
    }
  }
  
  // 段落悬停效果
  p {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateX(4px);
      padding-left: 8px;
      border-left: 2px solid rgba(0, 212, 255, 0.3);
    }
  }
  
  // 列表项动画
  li {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateX(2px);
      color: var(--vp-c-brand-1);
    }
  }
  
  // 代码块悬停效果
  div[class*="language-"] {
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
    }
  }
  
  // 表格行悬停动画
  table tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(0, 212, 255, 0.1) !important;
      transform: scale(1.01);
    }
  }
}

// 侧边栏导航增强动画
:deep(.VPSidebar) {
  .group .items .item a {
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover::before {
      left: 100%;
    }
    
    &.active {
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: var(--vp-c-brand-1);
        border-radius: 2px;
        box-shadow: 0 0 10px var(--vp-c-brand-1);
      }
    }
  }
}

// 布局类修饰符
.futuristic-layout {
  &--low-performance {
    .nav-tech-accent,
    .tech-glow,
    .tech-scan-line {
      display: none;
    }
  }
  
  &--reduced-motion {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  &--offline {
    .tech-background {
      opacity: 0.3;
    }
  }
}

// 简化的加载动画
.page-loading--simple {
  .loading-spinner {
    .spinner-ring {
      &:nth-child(2),
      &:nth-child(3) {
        display: none;
      }
    }
  }
}

// 网络状态指示器
.network-status {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  backdrop-filter: blur(10px);
  
  &--online {
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.3);
    color: #00ff88;
  }
  
  &--offline {
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid rgba(255, 68, 68, 0.3);
    color: #ff4444;
  }
  
  .network-icon {
    width: 16px;
    height: 16px;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.network-status-enter-active,
.network-status-leave-active {
  transition: all 0.3s ease;
}

.network-status-enter-from,
.network-status-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

// 响应式动画优化
@media (max-width: 1024px) {
  .futuristic-layout {
    // 平板设备优化
    .nav-tech-accent {
      width: 60px;
    }
    
    .sidebar-tech-header {
      height: 40px;
      margin-bottom: 15px;
    }
  }
}

@media (max-width: 768px) {
  .page-loading {
    .loading-spinner {
      width: 40px;
      height: 40px;
    }
    
    .loading-text {
      font-size: 12px;
    }
  }
  
  .network-status {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 12px;
    
    .network-icon {
      width: 14px;
      height: 14px;
    }
  }
  
  // 在移动设备上简化动画
  :deep(.vp-doc) {
    h1, h2, h3, h4, h5, h6,
    p,
    li {
      &:hover {
        transform: none;
      }
    }
  }
  
  // 简化装饰元素
  .nav-tech-accent {
    width: 40px;
    height: 1px;
  }
  
  .sidebar-tech-header {
    height: 30px;
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .page-loading {
    .loading-spinner {
      width: 32px;
      height: 32px;
    }
    
    .loading-text {
      font-size: 11px;
    }
  }
  
  .network-status {
    position: relative;
    top: auto;
    right: auto;
    margin: 10px;
    align-self: flex-end;
  }
  
  // 移除所有装饰效果
  .nav-tech-accent,
  .sidebar-tech-header,
  .content-enter-animation {
    display: none;
  }
}

// 横屏手机优化
@media (max-height: 500px) and (orientation: landscape) {
  .page-loading {
    .loading-spinner {
      width: 30px;
      height: 30px;
    }
    
    .loading-text {
      font-size: 10px;
    }
  }
  
  .network-status {
    top: 5px;
    right: 5px;
    padding: 4px 8px;
    font-size: 11px;
  }
}

// 减少动画偏好设置
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active,
  .loading-enter-active,
  .loading-leave-active {
    transition-duration: 0.01ms !important;
  }
  
  .nav-tech-accent,
  .tech-glow,
  .tech-scan-line,
  .spinner-ring {
    animation: none !important;
  }
  
  :deep(.vp-doc) {
    h1, h2, h3, h4, h5, h6,
    p,
    li,
    div[class*="language-"],
    table tr {
      transition: none !important;
      
      &:hover {
        transform: none !important;
      }
    }
  }
}
</style>