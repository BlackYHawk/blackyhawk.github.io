// 动画工具函数
export interface AnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * 滚动触发动画观察器
 */
export class ScrollRevealObserver {
  private observer: IntersectionObserver
  private elements: Set<Element> = new Set()

  constructor(options: AnimationOptions = {}) {
    const {
      threshold = 0.1,
      rootMargin = '0px 0px -50px 0px',
      once = true
    } = options

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          
          // 如果设置了 once，则停止观察该元素
          if (once) {
            this.observer.unobserve(entry.target)
            this.elements.delete(entry.target)
          }
        } else if (!once) {
          entry.target.classList.remove('revealed')
        }
      })
    }, {
      threshold,
      rootMargin
    })
  }

  /**
   * 观察元素
   */
  observe(element: Element): void {
    this.observer.observe(element)
    this.elements.add(element)
  }

  /**
   * 停止观察元素
   */
  unobserve(element: Element): void {
    this.observer.unobserve(element)
    this.elements.delete(element)
  }

  /**
   * 停止观察所有元素
   */
  disconnect(): void {
    this.observer.disconnect()
    this.elements.clear()
  }

  /**
   * 自动发现并观察页面中的滚动动画元素
   */
  autoDiscover(): void {
    const selectors = [
      '.scroll-reveal',
      '.scroll-reveal-left',
      '.scroll-reveal-right',
      '.scroll-reveal-scale'
    ]

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => this.observe(element))
    })
  }
}

/**
 * 创建波纹效果
 */
export function createRippleEffect(element: HTMLElement, event: MouseEvent): void {
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = document.createElement('div')
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(0, 212, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 1000;
  `

  element.style.position = 'relative'
  element.style.overflow = 'hidden'
  element.appendChild(ripple)

  // 动画结束后移除元素
  ripple.addEventListener('animationend', () => {
    ripple.remove()
  })
}

/**
 * 添加打字机效果
 */
export function typewriterEffect(
  element: HTMLElement,
  text: string,
  speed: number = 50
): Promise<void> {
  return new Promise((resolve) => {
    element.textContent = ''
    let index = 0

    const timer = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index)
        index++
      } else {
        clearInterval(timer)
        resolve()
      }
    }, speed)
  })
}

/**
 * 数字计数动画
 */
export function animateNumber(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1000,
  easing: (t: number) => number = (t) => t
): void {
  const startTime = performance.now()
  const difference = end - start

  function updateNumber(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easing(progress)
    const current = start + difference * easedProgress

    element.textContent = Math.round(current).toString()

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }

  requestAnimationFrame(updateNumber)
}

/**
 * 缓动函数
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

/**
 * 视差滚动效果
 */
export function parallaxScroll(elements: NodeListOf<Element> | Element[], speed: number = 0.5): void {
  function updateParallax() {
    const scrollTop = window.pageYOffset

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + scrollTop
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // 只对可见元素应用视差效果
      if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
        const yPos = -(scrollTop - elementTop) * speed
        ;(element as HTMLElement).style.transform = `translateY(${yPos}px)`
      }
    })
  }

  // 节流滚动事件
  let ticking = false
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  function handleScroll() {
    ticking = false
    requestTick()
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 初始化
  updateParallax()
}

/**
 * 元素进入视口检测
 */
export function isElementInViewport(element: Element, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  )
}

/**
 * 平滑滚动到元素
 */
export function smoothScrollTo(element: Element, offset: number = 0): void {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
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

/**
 * 节流函数
 */
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

/**
 * 初始化所有动画效果
 */
export function initializeAnimations(): ScrollRevealObserver {
  // 检查是否支持 Intersection Observer
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver is not supported in this browser')
    return null as any
  }

  // 检查用户是否偏好减少动画
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.info('User prefers reduced motion, skipping animations')
    return null as any
  }

  // 创建滚动动画观察器
  const scrollObserver = new ScrollRevealObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    once: true
  })

  // 自动发现并观察滚动动画元素
  scrollObserver.autoDiscover()

  // 为按钮添加波纹效果
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('animate-ripple') || target.closest('.animate-ripple')) {
      const rippleElement = target.classList.contains('animate-ripple') 
        ? target 
        : target.closest('.animate-ripple') as HTMLElement
      
      if (rippleElement) {
        createRippleEffect(rippleElement, event)
      }
    }
  })

  return scrollObserver
}