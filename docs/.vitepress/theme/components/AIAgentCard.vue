<template>
  <div class="ai-agent-card" :class="{ 'featured': featured, 'interactive': interactive }">
    <div class="card-glow"></div>
    <div class="card-content">
      <!-- 头部区域 -->
      <div class="card-header">
        <div class="agent-icon" v-if="icon">
          <el-icon :size="iconSize">
            <component :is="icon" />
          </el-icon>
        </div>
        <div class="agent-info">
          <h3 class="agent-title">{{ title }}</h3>
          <p class="agent-category" v-if="category">{{ category }}</p>
        </div>
        <div class="agent-status" v-if="status">
          <el-tag :type="getStatusType(status)" size="small">{{ status }}</el-tag>
        </div>
      </div>

      <!-- 描述区域 -->
      <div class="card-body">
        <p class="agent-description">{{ description }}</p>
        
        <!-- 标签区域 -->
        <div class="agent-tags" v-if="tags && tags.length > 0">
          <el-tag 
            v-for="tag in tags" 
            :key="tag" 
            size="small" 
            effect="plain"
            class="tech-tag"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 特性列表 -->
        <ul class="agent-features" v-if="features && features.length > 0">
          <li v-for="feature in features" :key="feature" class="feature-item">
            <el-icon class="feature-icon"><Check /></el-icon>
            {{ feature }}
          </li>
        </ul>
      </div>

      <!-- 操作区域 -->
      <div class="card-footer" v-if="showActions">
        <el-button 
          v-if="primaryAction"
          type="primary" 
          :size="buttonSize"
          class="tech-button primary-action"
          @click="handlePrimaryAction"
        >
          {{ primaryAction.text }}
          <el-icon class="ml-1" v-if="primaryAction.icon">
            <component :is="primaryAction.icon" />
          </el-icon>
        </el-button>
        
        <el-button 
          v-if="secondaryAction"
          :size="buttonSize"
          class="tech-button secondary-action"
          @click="handleSecondaryAction"
        >
          {{ secondaryAction.text }}
          <el-icon class="ml-1" v-if="secondaryAction.icon">
            <component :is="secondaryAction.icon" />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElTag, ElIcon } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

interface ActionButton {
  text: string
  icon?: string
  action?: () => void
  link?: string
}

interface Props {
  title: string
  description: string
  category?: string
  icon?: string
  iconSize?: number
  status?: 'active' | 'inactive' | 'development' | 'beta'
  tags?: string[]
  features?: string[]
  featured?: boolean
  interactive?: boolean
  primaryAction?: ActionButton
  secondaryAction?: ActionButton
  buttonSize?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 32,
  featured: false,
  interactive: true,
  buttonSize: 'default'
})

const emit = defineEmits<{
  primaryClick: [action: ActionButton]
  secondaryClick: [action: ActionButton]
}>()

const showActions = computed(() => {
  return props.primaryAction || props.secondaryAction
})

const getStatusType = (status: string) => {
  const statusMap = {
    'active': 'success',
    'inactive': 'info',
    'development': 'warning',
    'beta': 'primary'
  }
  return statusMap[status as keyof typeof statusMap] || 'info'
}

const handlePrimaryAction = () => {
  if (props.primaryAction) {
    if (props.primaryAction.action) {
      props.primaryAction.action()
    } else if (props.primaryAction.link) {
      window.open(props.primaryAction.link, '_blank')
    }
    emit('primaryClick', props.primaryAction)
  }
}

const handleSecondaryAction = () => {
  if (props.secondaryAction) {
    if (props.secondaryAction.action) {
      props.secondaryAction.action()
    } else if (props.secondaryAction.link) {
      window.open(props.secondaryAction.link, '_blank')
    }
    emit('secondaryClick', props.secondaryAction)
  }
}
</script>

<style lang="scss" scoped>
.ai-agent-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &.interactive {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      border-color: var(--vp-c-brand);
      box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
      
      .card-glow {
        opacity: 1;
      }
    }
  }

  &.featured {
    border-color: var(--vp-c-brand);
    background: linear-gradient(135deg, 
      rgba(0, 212, 255, 0.05) 0%, 
      rgba(108, 92, 231, 0.05) 100%);
    
    .card-glow {
      opacity: 0.6;
    }
  }
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, 
    var(--vp-c-brand) 0%, 
    #6c5ce7 50%, 
    var(--vp-c-brand) 100%);
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.agent-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--vp-c-brand), #6c5ce7);
  border-radius: 12px;
  color: white;
}

.agent-info {
  flex: 1;
  min-width: 0;
}

.agent-title {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.agent-category {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.agent-status {
  flex-shrink: 0;
}

.card-body {
  margin-bottom: 20px;
}

.agent-description {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-size: 0.95rem;
}

.agent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tech-tag {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
  color: var(--vp-c-brand);
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
  }
}

.agent-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.feature-icon {
  color: var(--vp-c-brand);
  font-size: 14px;
}

.card-footer {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tech-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &.primary-action {
    background: linear-gradient(135deg, var(--vp-c-brand), #6c5ce7);
    border: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3);
    }
  }
  
  &.secondary-action {
    border-color: var(--vp-c-brand);
    color: var(--vp-c-brand);
    background: transparent;
    
    &:hover {
      background: rgba(0, 212, 255, 0.1);
      transform: translateY(-1px);
    }
  }
}

.ml-1 {
  margin-left: 4px;
}

// 响应式设计
@media (max-width: 768px) {
  .ai-agent-card {
    padding: 20px;
    margin: 12px 0;
  }
  
  .card-header {
    gap: 12px;
  }
  
  .agent-icon {
    width: 40px;
    height: 40px;
  }
  
  .agent-title {
    font-size: 1.1rem;
  }
  
  .card-footer {
    flex-direction: column;
    
    .tech-button {
      width: 100%;
    }
  }
}
</style>