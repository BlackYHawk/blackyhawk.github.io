<template>
  <div 
    class="responsive-container"
    :class="containerClasses"
    :style="containerStyles"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { debounce } from '../utils/performance'

interface Props {
  maxWidth?: string
  padding?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string }
  margin?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string }
  fluid?: boolean
  centerContent?: boolean
  adaptiveSpacing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '1200px',
  padding: '1rem',
  margin: '0 auto',
  fluid: false,
  centerContent: true,
  adaptiveSpacing: true
})

const screenWidth = ref(0)
const screenHeight = ref(0)

// 获取当前断点
const currentBreakpoint = computed(() => {
  if (screenWidth.value < 480) return 'xs'
  if (screenWidth.value < 768) return 'sm'
  if (screenWidth.value < 1024) return 'md'
  if (screenWidth.value < 1200) return 'lg'
  return 'xl'
})

// 容器类名
const containerClasses = computed(() => ({
  'responsive-container--fluid': props.fluid,
  'responsive-container--center': props.centerContent,
  'responsive-container--adaptive': props.adaptiveSpacing,
  [`responsive-container--${currentBreakpoint.value}`]: true
}))

// 动态样式
const containerStyles = computed(() => {
  const styles: Record<string, string> = {}

  // 最大宽度
  if (!props.fluid) {
    styles.maxWidth = props.maxWidth
  }

  // 响应式内边距
  if (typeof props.padding === 'string') {
    styles.padding = props.padding
  } else if (props.padding && typeof props.padding === 'object') {
    const breakpoint = currentBreakpoint.value as keyof typeof props.padding
    styles.padding = props.padding[breakpoint] || props.padding.md || '1rem'
  }

  // 响应式外边距
  if (typeof props.margin === 'string') {
    styles.margin = props.margin
  } else if (props.margin && typeof props.margin === 'object') {
    const breakpoint = currentBreakpoint.value as keyof typeof props.margin
    styles.margin = props.margin[breakpoint] || props.margin.md || '0 auto'
  }

  return styles
})

// 更新屏幕尺寸
const updateScreenSize = debounce(() => {
  if (typeof window !== 'undefined') {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }
}, 100)

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

// 暴露当前断点给父组件
defineExpose({
  currentBreakpoint,
  screenWidth,
  screenHeight
})
</script>

<style lang="scss" scoped>
.responsive-container {
  width: 100%;
  transition: all var(--tech-transition-normal) var(--tech-ease-out-cubic);

  &--fluid {
    max-width: none !important;
  }

  &--center {
    margin-left: auto;
    margin-right: auto;
  }

  &--adaptive {
    // 自适应间距
    &.responsive-container--xs {
      --container-spacing: 0.5rem;
    }

    &.responsive-container--sm {
      --container-spacing: 0.75rem;
    }

    &.responsive-container--md {
      --container-spacing: 1rem;
    }

    &.responsive-container--lg {
      --container-spacing: 1.5rem;
    }

    &.responsive-container--xl {
      --container-spacing: 2rem;
    }
  }

  // 响应式网格支持
  &.grid {
    display: grid;
    gap: var(--container-spacing, 1rem);

    &.responsive-container--xs {
      grid-template-columns: 1fr;
    }

    &.responsive-container--sm {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    &.responsive-container--md {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    &.responsive-container--lg {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }

    &.responsive-container--xl {
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
  }

  // 响应式弹性布局支持
  &.flex {
    display: flex;
    gap: var(--container-spacing, 1rem);

    &.responsive-container--xs,
    &.responsive-container--sm {
      flex-direction: column;
    }

    &.responsive-container--md,
    &.responsive-container--lg,
    &.responsive-container--xl {
      flex-direction: row;
    }
  }
}

// 打印样式优化
@media print {
  .responsive-container {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>