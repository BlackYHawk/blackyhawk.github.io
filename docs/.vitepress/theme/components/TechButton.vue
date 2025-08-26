<template>
  <component 
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled"
    :href="href"
    :to="to"
    @click="handleClick"
  >
    <span class="button-content">
      <el-icon v-if="icon && iconPosition === 'left'" class="button-icon left">
        <component :is="icon" />
      </el-icon>
      
      <span class="button-text">
        <slot>{{ text }}</slot>
      </span>
      
      <el-icon v-if="icon && iconPosition === 'right'" class="button-icon right">
        <component :is="icon" />
      </el-icon>
    </span>
    
    <div class="button-glow" v-if="glow"></div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElIcon } from 'element-plus'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'small' | 'medium' | 'large'
  text?: string
  icon?: string
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  glow?: boolean
  href?: string
  to?: string
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  iconPosition: 'right',
  disabled: false,
  loading: false,
  glow: false,
  tag: 'button'
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => [
  'tech-button',
  `tech-button--${props.variant}`,
  `tech-button--${props.size}`,
  {
    'tech-button--disabled': props.disabled,
    'tech-button--loading': props.loading,
    'tech-button--glow': props.glow,
    'tech-button--icon-only': props.icon && !props.text && !$slots.default
  }
])

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.tech-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  user-select: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.3);
  }
  
  // 尺寸变体
  &--small {
    padding: 8px 16px;
    font-size: 0.875rem;
    min-height: 32px;
    
    &.tech-button--icon-only {
      padding: 8px;
      width: 32px;
    }
  }
  
  &--medium {
    padding: 12px 24px;
    font-size: 0.95rem;
    min-height: 40px;
    
    &.tech-button--icon-only {
      padding: 12px;
      width: 40px;
    }
  }
  
  &--large {
    padding: 16px 32px;
    font-size: 1.1rem;
    min-height: 48px;
    
    &.tech-button--icon-only {
      padding: 16px;
      width: 48px;
    }
  }
  
  // 颜色变体
  &--primary {
    background: linear-gradient(135deg, var(--vp-c-brand), #6c5ce7);
    color: white;
    
    &:hover:not(.tech-button--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
    }
    
    &:active:not(.tech-button--disabled) {
      transform: translateY(0);
    }
  }
  
  &--secondary {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: var(--vp-c-brand);
    
    &:hover:not(.tech-button--disabled) {
      background: rgba(0, 212, 255, 0.2);
      border-color: var(--vp-c-brand);
      transform: translateY(-1px);
    }
  }
  
  &--ghost {
    background: transparent;
    border: 1px solid var(--vp-c-border);
    color: var(--vp-c-text-1);
    
    &:hover:not(.tech-button--disabled) {
      border-color: var(--vp-c-brand);
      color: var(--vp-c-brand);
      background: rgba(0, 212, 255, 0.05);
    }
  }
  
  &--danger {
    background: linear-gradient(135deg, #ff4757, #ff3742);
    color: white;
    
    &:hover:not(.tech-button--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
    }
  }
  
  // 状态变体
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &--loading {
    cursor: wait;
    
    .button-text {
      opacity: 0.7;
    }
  }
  
  &--glow {
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, var(--vp-c-brand), #6c5ce7);
      border-radius: 10px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }
    
    &:hover::before {
      opacity: 0.7;
    }
  }
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.button-icon {
  display: flex;
  align-items: center;
  
  &.left {
    margin-right: 4px;
  }
  
  &.right {
    margin-left: 4px;
  }
}

.button-text {
  white-space: nowrap;
}

.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  transition: transform 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.tech-button:hover .button-glow {
  transform: translate(-50%, -50%) scale(1.5);
}

// 响应式设计
@media (max-width: 768px) {
  .tech-button {
    &--large {
      padding: 14px 28px;
      font-size: 1rem;
      min-height: 44px;
    }
    
    &--medium {
      padding: 10px 20px;
      font-size: 0.9rem;
      min-height: 36px;
    }
  }
}
</style>