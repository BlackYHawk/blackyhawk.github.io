<template>
  <div :class="gridClasses">
    <div 
      v-for="(feature, index) in features" 
      :key="index"
      class="feature-item"
      :class="{ 'feature-item--highlighted': feature.highlighted }"
    >
      <div class="feature-icon" v-if="feature.icon">
        <el-icon :size="iconSize">
          <component :is="feature.icon" />
        </el-icon>
      </div>
      
      <div class="feature-content">
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
        
        <div class="feature-tags" v-if="feature.tags && feature.tags.length > 0">
          <el-tag 
            v-for="tag in feature.tags" 
            :key="tag" 
            size="small" 
            effect="plain"
            class="feature-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div class="feature-actions" v-if="feature.action">
          <TechButton
            :variant="feature.action.variant || 'secondary'"
            :size="feature.action.size || 'small'"
            :text="feature.action.text"
            :icon="feature.action.icon"
            @click="handleFeatureAction(feature, index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElIcon, ElTag } from 'element-plus'
import TechButton from './TechButton.vue'

interface FeatureAction {
  text: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'small' | 'medium' | 'large'
  action?: () => void
  link?: string
}

interface Feature {
  title: string
  description: string
  icon?: string
  tags?: string[]
  highlighted?: boolean
  action?: FeatureAction
}

interface Props {
  features: Feature[]
  columns?: 1 | 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
  iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  gap: 'medium',
  iconSize: 32
})

const emit = defineEmits<{
  featureClick: [feature: Feature, index: number]
}>()

const gridClasses = computed(() => [
  'feature-grid',
  `feature-grid--columns-${props.columns}`,
  `feature-grid--gap-${props.gap}`
])

const handleFeatureAction = (feature: Feature, index: number) => {
  if (feature.action) {
    if (feature.action.action) {
      feature.action.action()
    } else if (feature.action.link) {
      window.open(feature.action.link, '_blank')
    }
  }
  emit('featureClick', feature, index)
}
</script>

<style lang="scss" scoped>
.feature-grid {
  display: grid;
  width: 100%;
  
  // 列数变体
  &--columns-1 {
    grid-template-columns: 1fr;
  }
  
  &--columns-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  &--columns-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  &--columns-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  
  // 间距变体
  &--gap-small {
    gap: 16px;
  }
  
  &--gap-medium {
    gap: 24px;
  }
  
  &--gap-large {
    gap: 32px;
  }
}

.feature-item {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--vp-c-brand);
    box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
  }
  
  &--highlighted {
    border-color: var(--vp-c-brand);
    background: linear-gradient(135deg, 
      rgba(0, 212, 255, 0.05) 0%, 
      rgba(108, 92, 231, 0.05) 100%);
    
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(135deg, var(--vp-c-brand), #6c5ce7);
      border-radius: 13px;
      opacity: 0.3;
      z-index: -1;
    }
  }
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--vp-c-brand), #6c5ce7);
  border-radius: 12px;
  color: white;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.feature-description {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-size: 0.9rem;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.feature-tag {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
  color: var(--vp-c-brand);
  font-size: 0.75rem;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
  }
}

.feature-actions {
  margin-top: auto;
}

// 响应式设计
@media (max-width: 1024px) {
  .feature-grid {
    &--columns-4 {
      grid-template-columns: repeat(2, 1fr);
    }
    
    &--columns-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .feature-grid {
    &--columns-4,
    &--columns-3,
    &--columns-2 {
      grid-template-columns: 1fr;
    }
    
    &--gap-large {
      gap: 20px;
    }
    
    &--gap-medium {
      gap: 16px;
    }
  }
  
  .feature-item {
    padding: 20px;
  }
  
  .feature-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }
  
  .feature-title {
    font-size: 1rem;
  }
  
  .feature-description {
    font-size: 0.85rem;
  }
}
</style>