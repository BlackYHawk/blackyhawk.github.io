# 组件演示

本页面展示了所有可用的自定义组件及其使用方法。

## AIAgentCard - AI智能体卡片

### 基础用法

<AIAgentCard
  title="GPT-4 助手"
  description="强大的AI助手，能够处理各种复杂任务，包括代码生成、文档编写、问题解答等。"
  category="语言模型"
  icon="Robot"
  status="active"
  :tags="['AI', 'GPT-4', '多模态']"
  :features="['代码生成', '文档编写', '多语言支持', '上下文理解']"
  :primary-action="{ text: '开始使用', icon: 'ArrowRight' }"
  :secondary-action="{ text: '了解更多', icon: 'InfoFilled' }"
/>

### 精选卡片

<AIAgentCard
  title="代码助手"
  description="专门用于代码生成和优化的AI助手，支持多种编程语言。"
  category="开发工具"
  icon="Code"
  status="beta"
  :tags="['代码', '开发', 'AI']"
  :features="['多语言支持', '代码优化', '错误检测']"
  :featured="true"
  :primary-action="{ text: '试用', icon: 'Play' }"
/>

## TechButton - 科技按钮

### 不同变体

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 20px 0;">
  <TechButton variant="primary" text="主要按钮" />
  <TechButton variant="secondary" text="次要按钮" />
  <TechButton variant="ghost" text="幽灵按钮" />
  <TechButton variant="danger" text="危险按钮" />
</div>

### 不同尺寸

<div style="display: flex; gap: 12px; align-items: center; margin: 20px 0;">
  <TechButton size="small" text="小按钮" />
  <TechButton size="medium" text="中等按钮" />
  <TechButton size="large" text="大按钮" />
</div>

### 带图标

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 20px 0;">
  <TechButton text="下载" icon="Download" />
  <TechButton text="设置" icon="Setting" icon-position="left" />
  <TechButton variant="secondary" text="分享" icon="Share" />
</div>

## GlowCard - 发光卡片

### 基础卡片

<GlowCard title="基础卡片">
这是一个基础的发光卡片组件，可以用来展示各种内容。
</GlowCard>

### 交互式卡片

<GlowCard 
  title="交互式卡片" 
  variant="primary" 
  :interactive="true" 
  :glow="true"
>
这是一个具有交互效果和发光效果的卡片，鼠标悬停时会有动画效果。
</GlowCard>

### 不同变体

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 20px 0;">
  <GlowCard variant="success" title="成功">
    成功状态的卡片
  </GlowCard>
  
  <GlowCard variant="warning" title="警告">
    警告状态的卡片
  </GlowCard>
  
  <GlowCard variant="danger" title="危险">
    危险状态的卡片
  </GlowCard>
</div>

## FeatureGrid - 功能网格

<FeatureGrid 
  :columns="3"
  :features="[
    {
      title: '智能对话',
      description: '支持自然语言对话，理解上下文，提供准确回答',
      icon: 'ChatDotRound',
      tags: ['AI', '对话'],
      action: { text: '体验', variant: 'primary' }
    },
    {
      title: '代码生成',
      description: '自动生成高质量代码，支持多种编程语言',
      icon: 'Code',
      tags: ['代码', '生成'],
      highlighted: true,
      action: { text: '试用', variant: 'secondary' }
    },
    {
      title: '文档编写',
      description: '智能生成技术文档，格式规范，内容准确',
      icon: 'Document',
      tags: ['文档', '写作'],
      action: { text: '开始', variant: 'ghost' }
    }
  ]"
/>

## CodeBlock - 代码块

### JavaScript 代码

<CodeBlock 
  language="javascript" 
  title="示例代码"
  :copyable="true"
>
function createAIAgent(config) {
  return {
    name: config.name,
    model: config.model,
    async chat(message) {
      const response = await this.model.generate(message)
      return response
    }
  }
}

const agent = createAIAgent({
  name: 'Assistant',
  model: new GPTModel('gpt-4')
})
</CodeBlock>

### TypeScript 代码

<CodeBlock 
  language="typescript" 
  title="TypeScript 接口定义"
>

```typescript
interface AIAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  chat(message: string): Promise<string>
  configure(options: AgentOptions): void
}

class SmartAgent implements AIAgent {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public capabilities: string[]
  ) {}
  
  async chat(message: string): Promise<string> {
    // 实现聊天逻辑
    return "AI response"
  }
  
  configure(options: AgentOptions): void {
    // 配置逻辑
  }
}
```

</CodeBlock>

## 组合使用示例

<GlowCard variant="primary" :glow="true" :interactive="true">
  <template #header>
    <h2 style="margin: 0; display: flex; align-items: center; gap: 8px;">
      <el-icon><Robot /></el-icon>
      AI智能体平台
    </h2>
  </template>
  
  <p>探索强大的AI智能体生态系统，构建属于你的智能助手。</p>
  
  <FeatureGrid 
    :columns="2"
    gap="small"
    :features="[
      {
        title: '快速部署',
        description: '一键部署AI智能体',
        icon: 'Lightning',
        tags: ['部署']
      },
      {
        title: '自定义配置',
        description: '灵活的配置选项',
        icon: 'Setting',
        tags: ['配置']
      }
    ]"
  />
  
  <template #footer>
    <div style="display: flex; gap: 12px;">
      <TechButton variant="primary" text="立即开始" icon="ArrowRight" />
      <TechButton variant="secondary" text="查看文档" icon="Document" />
    </div>
  </template>
</GlowCard>

## 使用说明

所有组件都已全局注册，可以直接在 Markdown 文件中使用。组件支持以下特性：

- **响应式设计**: 自动适配不同屏幕尺寸
- **主题一致性**: 与网站整体主题保持一致
- **交互动画**: 丰富的悬停和点击效果
- **可访问性**: 支持键盘导航和屏幕阅读器
- **TypeScript 支持**: 完整的类型定义

### 在 Markdown 中使用组件

```markdown
<!-- 基础用法 -->
<AIAgentCard 
  title="我的AI助手" 
  description="描述信息"
/>

<!-- 带属性 -->
<TechButton 
  variant="primary" 
  text="按钮文字" 
  icon="ArrowRight"
/>

<!-- 插槽内容 -->
<GlowCard title="卡片标题">
  这里是卡片内容
</GlowCard>
```