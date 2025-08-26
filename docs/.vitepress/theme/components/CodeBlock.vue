<template>
  <div class="code-block" :class="{ 'code-block--copyable': copyable }">
    <div class="code-header" v-if="title || copyable">
      <div class="code-title" v-if="title">
        <el-icon class="code-icon"><Document /></el-icon>
        {{ title }}
      </div>
      <div class="code-actions">
        <el-button 
          v-if="copyable"
          size="small" 
          type="text" 
          class="copy-button"
          @click="copyCode"
        >
          <el-icon><CopyDocument /></el-icon>
          {{ copied ? 'Copied!' : 'Copy' }}
        </el-button>
      </div>
    </div>
    
    <div class="code-content">
      <pre><code :class="languageClass" ref="codeRef"><slot>{{ code }}</slot></code></pre>
    </div>
    
    <div class="code-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { Document, CopyDocument } from '@element-plus/icons-vue'

interface Props {
  code?: string
  language?: string
  title?: string
  copyable?: boolean
  lineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  copyable: true,
  lineNumbers: false
})

const codeRef = ref<HTMLElement>()
const copied = ref(false)

const languageClass = computed(() => {
  return props.language ? `language-${props.language}` : ''
})

const copyCode = async () => {
  if (!codeRef.value) return
  
  const codeText = codeRef.value.textContent || props.code || ''
  
  try {
    await navigator.clipboard.writeText(codeText)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = codeText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

onMounted(() => {
  // 如果需要语法高亮，可以在这里集成 Prism.js 或其他库
  nextTick(() => {
    if (window.Prism && codeRef.value) {
      window.Prism.highlightElement(codeRef.value)
    }
  })
})
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;
  background: var(--vp-code-block-bg, #1e1e1e);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
  
  &--copyable {
    .code-header {
      padding-right: 80px;
    }
  }
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--vp-c-border);
  position: relative;
}

.code-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.code-icon {
  color: var(--vp-c-brand);
}

.code-actions {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.copy-button {
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--vp-c-brand);
  }
}

.code-content {
  position: relative;
  overflow-x: auto;
  
  pre {
    margin: 0;
    padding: 20px;
    background: transparent;
    font-family: var(--vp-font-family-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--vp-code-color, #e6e6e6);
    
    code {
      background: transparent;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
      color: inherit;
      white-space: pre;
      word-wrap: normal;
      word-break: normal;
      word-spacing: normal;
      tab-size: 2;
      hyphens: none;
    }
  }
}

.code-footer {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid var(--vp-c-border);
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

// 语法高亮样式（基础版本）
:deep(.language-javascript),
:deep(.language-js) {
  .token.keyword {
    color: #ff79c6;
  }
  
  .token.string {
    color: #f1fa8c;
  }
  
  .token.function {
    color: #50fa7b;
  }
  
  .token.number {
    color: #bd93f9;
  }
  
  .token.comment {
    color: #6272a4;
    font-style: italic;
  }
}

:deep(.language-typescript),
:deep(.language-ts) {
  .token.keyword {
    color: #ff79c6;
  }
  
  .token.string {
    color: #f1fa8c;
  }
  
  .token.function {
    color: #50fa7b;
  }
  
  .token.number {
    color: #bd93f9;
  }
  
  .token.type {
    color: #8be9fd;
  }
}

:deep(.language-css) {
  .token.property {
    color: #66d9ef;
  }
  
  .token.string,
  .token.url {
    color: #f1fa8c;
  }
  
  .token.selector {
    color: #50fa7b;
  }
}

:deep(.language-html) {
  .token.tag {
    color: #ff79c6;
  }
  
  .token.attr-name {
    color: #50fa7b;
  }
  
  .token.attr-value {
    color: #f1fa8c;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .code-content pre {
    padding: 16px;
    font-size: 0.8rem;
  }
  
  .code-header {
    padding: 10px 12px;
  }
  
  .code-title {
    font-size: 0.8rem;
  }
  
  .copy-button {
    font-size: 0.8rem;
  }
}
</style>