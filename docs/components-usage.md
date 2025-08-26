# 组件使用指南

本文档展示了如何在 Markdown 文件中使用自定义组件。

## 快速开始

所有组件都已全局注册，可以直接在 Markdown 文件中使用：

### 1. AIAgentCard - AI智能体卡片

```markdown
<AIAgentCard
  title="GPT-4 助手"
  description="强大的AI助手，能够处理各种复杂任务"
  category="语言模型"
  status="active"
  :tags="['AI', 'GPT-4']"
  :primary-action="{ text: '开始使用' }"
/>
```

### 2. TechButton - 科技按钮

```markdown
<TechButton 
  variant="primary" 
  text="立即开始" 
  icon="ArrowRight" 
/>
```

### 3. GlowCard - 发光卡片

```markdown
<GlowCard title="卡片标题" variant="primary" :glow="true">
  这里是卡片内容
</GlowCard>
```

### 4. FeatureGrid - 功能网格

```markdown
<FeatureGrid 
  :columns="3"
  :features="[
    {
      title: '智能对话',
      description: '支持自然语言对话',
      icon: 'ChatDotRound'
    }
  ]"
/>
```

### 5. CodeBlock - 代码块

```markdown
<CodeBlock language="javascript" title="示例代码">
console.log('Hello World')
</CodeBlock>
```

## 组件特性

- ✅ 响应式设计
- ✅ 深色主题支持
- ✅ Element Plus 集成
- ✅ TypeScript 支持
- ✅ 动画效果
- ✅ 可访问性支持

## 注意事项

1. 所有组件都支持 Vue 3 的响应式数据绑定
2. 使用 `:` 前缀来绑定动态属性
3. 组件样式与网站主题保持一致
4. 支持插槽（slot）内容