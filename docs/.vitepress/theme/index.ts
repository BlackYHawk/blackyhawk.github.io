import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入自定义布局
import Layout from './Layout.vue'

// 导入自定义样式
import './styles/index.scss'

// 导入动画工具
import { initializeAnimations } from './utils/animations'

// 导入性能工具
import { initGlobalErrorHandling, detectDeviceCapabilities } from './utils/performance'

// 导入自定义组件
import {
  FuturisticHero,
  TechBackground,
  AIAgentCard,
  TechButton,
  GlowCard,
  FeatureGrid,
  CodeBlock
} from './components'

// 导入新的优化组件
import ResponsiveContainer from './components/ResponsiveContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'

import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    // 注册 Element Plus
    app.use(ElementPlus)
    
    // 注册 Element Plus 图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

    // 注册自定义组件，使其可在 Markdown 中使用
    app.component('FuturisticHero', FuturisticHero)
    app.component('TechBackground', TechBackground)
    app.component('AIAgentCard', AIAgentCard)
    app.component('TechButton', TechButton)
    app.component('GlowCard', GlowCard)
    app.component('FeatureGrid', FeatureGrid)
    app.component('CodeBlock', CodeBlock)
    app.component('ResponsiveContainer', ResponsiveContainer)
    app.component('ErrorBoundary', ErrorBoundary)

    // 在客户端初始化
    if (typeof window !== 'undefined') {
      // 初始化全局错误处理
      initGlobalErrorHandling()
      
      // 检测设备性能并设置全局变量
      const capabilities = detectDeviceCapabilities()
      ;(window as any).__DEVICE_CAPABILITIES__ = capabilities
      
      // 根据设备性能调整Element Plus配置
      if (capabilities.isLowEnd) {
        // 为低端设备禁用一些动画效果
        document.documentElement.style.setProperty('--el-transition-duration', '0ms')
        document.documentElement.style.setProperty('--el-transition-duration-fast', '0ms')
      }
      
      // 添加性能监控
      if ('performance' in window && performance.mark) {
        performance.mark('theme-enhanced')
      }
      
      // 页面加载完成后初始化动画（仅在支持动画的设备上）
      const initAnimationsIfSupported = () => {
        if (capabilities.supportsAnimations) {
          setTimeout(() => {
            initializeAnimations()
          }, capabilities.isLowEnd ? 200 : 100)
        }
      }
      
      // 使用新的路由事件（替代已废弃的onAfterRouteChanged）
      if (router && router.onAfterPageLoad) {
        router.onAfterPageLoad = initAnimationsIfSupported
      }

      // 初始页面加载时也要初始化
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimationsIfSupported)
      } else {
        initAnimationsIfSupported()
      }
    }
  }
} satisfies Theme