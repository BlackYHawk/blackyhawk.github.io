<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-fallback">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      <h3 class="error-title">{{ errorTitle }}</h3>
      <p class="error-message">{{ errorMessage }}</p>
      
      <div class="error-actions">
        <button 
          class="error-button error-button--primary"
          @click="retry"
        >
          重试
        </button>
        
        <button 
          class="error-button error-button--secondary"
          @click="reportError"
          v-if="showReportButton"
        >
          报告问题
        </button>
      </div>
      
      <details v-if="showDetails && errorDetails" class="error-details">
        <summary>错误详情</summary>
        <pre class="error-stack">{{ errorDetails }}</pre>
      </details>
    </div>
    
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, provide } from 'vue'

interface Props {
  fallbackTitle?: string
  fallbackMessage?: string
  showReportButton?: boolean
  showDetails?: boolean
  onError?: (error: Error, errorInfo: any) => void
  onRetry?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: '出现了一些问题',
  fallbackMessage: '页面遇到了意外错误，请尝试刷新页面或稍后再试。',
  showReportButton: true,
  showDetails: false
})

const emit = defineEmits<{
  error: [error: Error, errorInfo: any]
  retry: []
}>()

const hasError = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')
const errorDetails = ref('')
const retryCount = ref(0)

// 捕获子组件错误
onErrorCaptured((error: Error, instance, errorInfo) => {
  console.error('Error caught by boundary:', error, errorInfo)
  
  hasError.value = true
  errorTitle.value = props.fallbackTitle
  errorMessage.value = getErrorMessage(error)
  errorDetails.value = error.stack || error.toString()
  
  // 调用错误处理回调
  if (props.onError) {
    props.onError(error, errorInfo)
  }
  
  emit('error', error, errorInfo)
  
  // 阻止错误继续向上传播
  return false
})

// 获取用户友好的错误消息
function getErrorMessage(error: Error): string {
  if (error.name === 'ChunkLoadError') {
    return '资源加载失败，请检查网络连接后重试。'
  }
  
  if (error.message.includes('Loading chunk')) {
    return '页面资源加载失败，请刷新页面重试。'
  }
  
  if (error.message.includes('Network Error')) {
    return '网络连接异常，请检查网络后重试。'
  }
  
  if (error.message.includes('timeout')) {
    return '请求超时，请稍后重试。'
  }
  
  // 开发环境显示详细错误，生产环境显示通用错误
  if (import.meta.env.DEV) {
    return error.message || props.fallbackMessage
  }
  
  return props.fallbackMessage
}

// 重试功能
function retry() {
  retryCount.value++
  
  if (retryCount.value > 3) {
    errorMessage.value = '多次重试失败，请刷新页面或联系技术支持。'
    return
  }
  
  hasError.value = false
  errorTitle.value = ''
  errorMessage.value = ''
  errorDetails.value = ''
  
  if (props.onRetry) {
    props.onRetry()
  }
  
  emit('retry')
  
  // 延迟一下再重新渲染，给组件恢复的时间
  setTimeout(() => {
    // 如果仍然有错误，会被重新捕获
  }, 100)
}

// 报告错误
function reportError() {
  const errorReport = {
    title: errorTitle.value,
    message: errorMessage.value,
    details: errorDetails.value,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    retryCount: retryCount.value
  }
  
  // 这里可以发送错误报告到监控服务
  console.log('Error Report:', errorReport)
  
  // 可以集成第三方错误监控服务，如 Sentry
  // Sentry.captureException(new Error(errorDetails.value), {
  //   extra: errorReport
  // })
  
  // 显示反馈
  alert('错误报告已发送，感谢您的反馈！')
}

// 提供错误边界上下文
provide('errorBoundary', {
  hasError,
  reportError: (error: Error) => {
    hasError.value = true
    errorTitle.value = '组件错误'
    errorMessage.value = getErrorMessage(error)
    errorDetails.value = error.stack || error.toString()
  }
})

// 暴露方法给父组件
defineExpose({
  hasError,
  retry,
  reportError
})
</script>

<style lang="scss" scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: var(--tech-spacing-xl);
  text-align: center;
  background: var(--tech-bg-secondary);
  border: 1px solid var(--tech-border);
  border-radius: 12px;
  margin: var(--tech-spacing-lg);
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ff6b6b;
  margin-bottom: var(--tech-spacing-lg);
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.error-title {
  font-size: var(--tech-font-size-xl);
  font-weight: var(--tech-font-weight-semibold);
  color: var(--tech-text-primary);
  margin: 0 0 var(--tech-spacing-md) 0;
}

.error-message {
  font-size: var(--tech-font-size-base);
  color: var(--tech-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--tech-spacing-xl) 0;
  max-width: 500px;
}

.error-actions {
  display: flex;
  gap: var(--tech-spacing-md);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--tech-spacing-lg);
}

.error-button {
  padding: var(--tech-spacing-sm) var(--tech-spacing-lg);
  border-radius: 6px;
  font-weight: var(--tech-font-weight-medium);
  cursor: pointer;
  transition: all var(--tech-transition-normal) var(--tech-ease-out-cubic);
  border: none;
  font-size: var(--tech-font-size-sm);
  
  &--primary {
    background: var(--tech-gradient-primary);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--tech-glow-soft);
    }
  }
  
  &--secondary {
    background: transparent;
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    
    &:hover {
      border-color: var(--tech-primary);
      color: var(--tech-primary);
      background: rgba(0, 212, 255, 0.05);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.error-details {
  width: 100%;
  max-width: 600px;
  margin-top: var(--tech-spacing-lg);
  
  summary {
    cursor: pointer;
    font-weight: var(--tech-font-weight-medium);
    color: var(--tech-text-secondary);
    margin-bottom: var(--tech-spacing-sm);
    
    &:hover {
      color: var(--tech-primary);
    }
  }
}

.error-stack {
  background: var(--tech-bg-tertiary);
  border: 1px solid var(--tech-border);
  border-radius: 6px;
  padding: var(--tech-spacing-md);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--tech-font-size-xs);
  color: var(--tech-text-muted);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

// 响应式适配
@media (max-width: 768px) {
  .error-fallback {
    margin: var(--tech-spacing-md);
    padding: var(--tech-spacing-lg);
    min-height: 250px;
  }
  
  .error-icon {
    width: 48px;
    height: 48px;
  }
  
  .error-title {
    font-size: var(--tech-font-size-lg);
  }
  
  .error-message {
    font-size: var(--tech-font-size-sm);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-button {
    width: 100%;
    max-width: 200px;
  }
}

// 打印样式
@media print {
  .error-fallback {
    border: 1px solid #ccc;
    background: white;
    color: black;
  }
  
  .error-button {
    display: none;
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .error-fallback {
    border-width: 2px;
  }
  
  .error-button--primary {
    background: #0066cc;
  }
  
  .error-button--secondary {
    border-width: 2px;
  }
}
</style>