<template>
  <div 
    :class="cardClasses"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="glow-effect" v-if="glow"></div>
    
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <h3 class="card-title" v-if="title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="card-body">
      <slot></slot>
    </div>
    
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  glow?: boolean
  interactive?: boolean
  bordered?: boolean
  shadow?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  glow: false,
  interactive: false,
  bordered: true,
  shadow: false,
  rounded: true
})

const isHovered = ref(false)

const cardClasses = computed(() => [
  'glow-card',
  `glow-card--${props.variant}`,
  `glow-card--${props.size}`,
  {
    'glow-card--glow': props.glow,
    'glow-card--interactive': props.interactive,
    'glow-card--bordered': props.bordered,
    'glow-card--shadow': props.shadow,
    'glow-card--rounded': props.rounded,
    'glow-card--hovered': isHovered.value
  }
])

const handleMouseEnter = () => {
  if (props.interactive) {
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  if (props.interactive) {
    isHovered.value = false
  }
}
</script>

<style lang="scss" scoped>
.glow-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  // 尺寸变体
  &--small {
    padding: 16px;
  }
  
  &--medium {
    padding: 24px;
  }
  
  &--large {
    padding: 32px;
  }
  
  // 边框
  &--bordered {
    border: 1px solid var(--vp-c-border);
  }
  
  // 圆角
  &--rounded {
    border-radius: 12px;
  }
  
  // 阴影
  &--shadow {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  // 交互效果
  &--interactive {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
  }
  
  // 发光效果
  &--glow {
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, 
        var(--vp-c-brand) 0%, 
        #6c5ce7 50%, 
        var(--vp-c-brand) 100%);
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }
    
    &.glow-card--hovered::before,
    &:hover::before {
      opacity: 0.6;
    }
  }
  
  // 颜色变体
  &--primary {
    border-color: var(--vp-c-brand);
    background: linear-gradient(135deg, 
      rgba(0, 212, 255, 0.05) 0%, 
      rgba(108, 92, 231, 0.05) 100%);
  }
  
  &--secondary {
    border-color: #6c5ce7;
    background: linear-gradient(135deg, 
      rgba(108, 92, 231, 0.05) 0%, 
      rgba(0, 212, 255, 0.05) 100%);
  }
  
  &--success {
    border-color: #00ff88;
    background: rgba(0, 255, 136, 0.05);
  }
  
  &--warning {
    border-color: #ffaa00;
    background: rgba(255, 170, 0, 0.05);
  }
  
  &--danger {
    border-color: #ff4444;
    background: rgba(255, 68, 68, 0.05);
  }
}

.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, 
    rgba(0, 212, 255, 0.1) 0%, 
    transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glow-card--interactive:hover .glow-effect {
  opacity: 1;
}

.card-header {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.card-body {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  
  // 处理嵌套内容的间距
  > *:first-child {
    margin-top: 0;
  }
  
  > *:last-child {
    margin-bottom: 0;
  }
}

.card-footer {
  margin-top: 16px;
  
  &:first-child {
    margin-top: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .glow-card {
    &--large {
      padding: 24px;
    }
    
    &--medium {
      padding: 20px;
    }
    
    &--small {
      padding: 16px;
    }
  }
  
  .card-title {
    font-size: 1.1rem;
  }
}
</style>