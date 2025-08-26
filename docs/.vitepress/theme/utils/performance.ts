/**
 * 性能优化工具函数
 */

// 检测设备性能等级
export interface DeviceCapabilities {
  isLowEnd: boolean
  supportsAnimations: boolean
  supportsComplexEffects: boolean
  preferReducedMotion: boolean
  connectionSpeed: 'slow' | 'fast' | 'unknown'
}

// 检测设备性能
export function detectDeviceCapabilities(): DeviceCapabilities {
  const capabilities: DeviceCapabilities = {
    isLowEnd: false,
    supportsAnimations: true,
    supportsComplexEffects: true,
    preferReducedMotion: false,
    connectionSpeed: 'unknown'
  }

  // 检测是否偏好减少动画
  if (typeof window !== 'undefined') {
    capabilities.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // 检测网络连接速度
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      const effectiveType = connection.effectiveType
      capabilities.connectionSpeed = ['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast'
    }

    // 检测设备内存 (如果支持)
    const deviceMemory = (navigator as any).deviceMemory
    if (deviceMemory && deviceMemory < 4) {
      capabilities.isLowEnd = true
    }

    // 检测硬件并发数
    const hardwareConcurrency = navigator.hardwareConcurrency
    if (hardwareConcurrency && hardwareConcurrency < 4) {
      capabilities.isLowEnd = true
    }

    // 根据用户代理检测低端设备
    const userAgent = navigator.userAgent.toLowerCase()
    const isLowEndDevice = /android.*(sm-|gt-|sgh-|sph-|sch-)/i.test(userAgent) ||
                          /iphone.*os [5-9]_/i.test(userAgent)
    
    if (isLowEndDevice) {
      capabilities.isLowEnd = true
    }

    // 根据性能和偏好设置动画支持
    if (capabilities.preferReducedMotion || capabilities.isLowEnd) {
      capabilities.supportsAnimations = false
      capabilities.supportsComplexEffects = false
    }
  }

  return capabilities
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 懒加载观察器
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

// 预加载资源
export function preloadResource(href: string, as: string = 'script'): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// 检测是否支持WebP
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// 获取设备像素比
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1
  return window.devicePixelRatio || 1
}

// 检测触摸设备
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 内存使用监控
export function getMemoryUsage(): any | null {
  if (typeof window === 'undefined' || !('performance' in window)) return null
  return (performance as any).memory || null
}

// 性能标记
export function markPerformance(name: string): void {
  if (typeof window !== 'undefined' && 'performance' in window && performance.mark) {
    performance.mark(name)
  }
}

// 性能测量
export function measurePerformance(name: string, startMark: string, endMark: string): void {
  if (typeof window !== 'undefined' && 'performance' in window && performance.measure) {
    try {
      performance.measure(name, startMark, endMark)
    } catch (error) {
      console.warn('Performance measurement failed:', error)
    }
  }
}

// 清理性能标记
export function clearPerformanceMarks(name?: string): void {
  if (typeof window !== 'undefined' && 'performance' in window && performance.clearMarks) {
    performance.clearMarks(name)
  }
}

// 获取关键性能指标
export function getWebVitals(): Promise<{
  FCP?: number
  LCP?: number
  FID?: number
  CLS?: number
}> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({})
      return
    }

    const vitals: any = {}

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        vitals.FCP = fcpEntry.startTime
      }
    })

    try {
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('FCP observation failed:', error)
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        vitals.LCP = lastEntry.startTime
      }
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP observation failed:', error)
    }

    // 延迟返回结果以收集指标
    setTimeout(() => {
      resolve(vitals)
    }, 3000)
  })
}

// 自适应图片加载
export function getOptimalImageSrc(
  baseSrc: string,
  width: number,
  supportsWebP: boolean = false
): string {
  const dpr = getDevicePixelRatio()
  const optimalWidth = Math.ceil(width * dpr)
  
  // 根据设备能力选择格式
  const format = supportsWebP ? 'webp' : 'jpg'
  
  // 这里可以根据实际的图片服务进行调整
  return `${baseSrc}?w=${optimalWidth}&f=${format}&q=80`
}

// 错误边界处理
export class ErrorBoundary {
  private static instance: ErrorBoundary
  private errorHandlers: Array<(error: Error, errorInfo?: any) => void> = []

  static getInstance(): ErrorBoundary {
    if (!ErrorBoundary.instance) {
      ErrorBoundary.instance = new ErrorBoundary()
    }
    return ErrorBoundary.instance
  }

  addErrorHandler(handler: (error: Error, errorInfo?: any) => void): void {
    this.errorHandlers.push(handler)
  }

  removeErrorHandler(handler: (error: Error, errorInfo?: any) => void): void {
    const index = this.errorHandlers.indexOf(handler)
    if (index > -1) {
      this.errorHandlers.splice(index, 1)
    }
  }

  handleError(error: Error, errorInfo?: any): void {
    console.error('Application Error:', error, errorInfo)
    
    this.errorHandlers.forEach(handler => {
      try {
        handler(error, errorInfo)
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError)
      }
    })
  }
}

// 初始化全局错误处理
export function initGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return

  const errorBoundary = ErrorBoundary.getInstance()

  // 捕获未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    errorBoundary.handleError(new Error(event.reason), { type: 'unhandledrejection' })
  })

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    errorBoundary.handleError(event.error || new Error(event.message), {
      type: 'global',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })
}