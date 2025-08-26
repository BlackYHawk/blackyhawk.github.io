# Markdown 渲染测试文档

这个文档用于测试 VitePress 中 Markdown 内容的渲染效果。

## 基础文本格式

**粗体文本** 和 *斜体文本* 以及 ~~删除线文本~~

`行内代码` 和 [链接文本](https://example.com)

## 标题层级测试

### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 列表测试

### 无序列表
- 第一项
- 第二项
  - 嵌套项目 1
  - 嵌套项目 2
- 第三项

### 有序列表
1. 第一步
2. 第二步
   1. 子步骤 A
   2. 子步骤 B
3. 第三步

## 代码块测试

### JavaScript 代码
```javascript
// 这是一个 JavaScript 代码示例
function createAIAgent(config) {
  return {
    name: config.name,
    model: config.model || 'gpt-4',
    tools: config.tools || [],
    
    async process(input) {
      console.log(`Processing: ${input}`);
      return `AI response for: ${input}`;
    }
  };
}

const agent = createAIAgent({
  name: 'Assistant',
  model: 'gpt-4',
  tools: ['search', 'calculator']
});
```

### Python 代码
```python
# Python AI Agent 示例
class AIAgent:
    def __init__(self, name, model="gpt-4"):
        self.name = name
        self.model = model
        self.tools = []
    
    def add_tool(self, tool):
        self.tools.append(tool)
        print(f"Added tool: {tool}")
    
    async def process(self, input_text):
        """处理用户输入"""
        return f"AI response for: {input_text}"

# 创建智能体实例
agent = AIAgent("Assistant", "gpt-4")
agent.add_tool("web_search")
```

### TypeScript 代码
```typescript
// TypeScript 接口定义
interface AIAgentConfig {
  name: string;
  model?: string;
  tools?: string[];
  temperature?: number;
}

interface AIResponse {
  content: string;
  tokens: number;
  model: string;
}

class AIAgent {
  private config: AIAgentConfig;
  
  constructor(config: AIAgentConfig) {
    this.config = {
      model: 'gpt-4',
      tools: [],
      temperature: 0.7,
      ...config
    };
  }
  
  async process(input: string): Promise<AIResponse> {
    // 模拟 AI 处理
    return {
      content: `Response to: ${input}`,
      tokens: input.length * 2,
      model: this.config.model!
    };
  }
}
```

## 表格测试

| 智能体类型 | 应用场景 | 技术栈 | 难度 |
|-----------|---------|--------|------|
| 对话助手 | 客服、咨询 | GPT-4, LangChain | 简单 |
| 代码助手 | 编程辅助 | CodeT5, GitHub Copilot | 中等 |
| 数据分析 | 商业智能 | Python, Pandas | 复杂 |
| 多模态 | 图像理解 | GPT-4V, CLIP | 高级 |

## 引用块测试

> 这是一个引用块示例。
> 
> 人工智能的发展正在改变我们的世界，智能体技术是其中的重要组成部分。
> 
> — AI 专家

> **重要提示**
> 
> 在开发 AI 智能体时，请注意以下几点：
> - 确保数据安全和隐私保护
> - 遵循 AI 伦理准则
> - 进行充分的测试和验证

## 自定义组件测试

<FuturisticHero />

<AIAgentCard
  title="智能客服助手"
  description="基于大语言模型的智能客服系统，能够理解用户意图并提供准确回答"
  category="对话助手"
  icon="ChatDotRound"
  status="active"
  :tags="['GPT-4', 'LangChain', '多轮对话']"
  :features="['自然语言理解', '上下文记忆', '多语言支持']"
  :primary-action="{ text: '立即体验', link: '/examples/customer-service' }"
  :secondary-action="{ text: '查看文档', link: '/guides/chat-agent' }"
/>

<GlowCard title="性能优化提示">

在使用 AI 智能体时，可以通过以下方式优化性能：

1. **缓存机制**: 对常见问题建立缓存
2. **批量处理**: 合并多个请求减少 API 调用
3. **流式输出**: 使用流式响应提升用户体验
4. **负载均衡**: 分布式部署处理高并发

</GlowCard>

## 数学公式测试

行内公式：$E = mc^2$

块级公式：
$$
\begin{aligned}
\text{Attention}(Q, K, V) &= \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V \\
\text{MultiHead}(Q, K, V) &= \text{Concat}(\text{head}_1, ..., \text{head}_h)W^O
\end{aligned}
$$

## 任务列表

- [x] 完成基础框架搭建
- [x] 集成 Element Plus 组件库
- [x] 实现响应式设计
- [ ] 添加国际化支持
- [ ] 优化 SEO 配置
- [ ] 部署到生产环境

## 警告和提示框

::: tip 提示
这是一个提示信息，用于给用户提供有用的建议。
:::

::: warning 警告
这是一个警告信息，提醒用户注意潜在的问题。
:::

::: danger 危险
这是一个危险警告，表示可能导致严重后果的操作。
:::

::: info 信息
这是一个信息提示，提供额外的背景信息。
:::

::: details 点击查看详细信息
这里是折叠的详细内容，用户可以点击展开查看。

```javascript
// 详细的代码示例
const advancedConfig = {
  model: 'gpt-4-turbo',
  temperature: 0.3,
  maxTokens: 2048,
  tools: [
    'web_search',
    'code_interpreter',
    'image_generation'
  ]
};
```
:::

## 徽章测试

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

## 脚注测试

这是一个包含脚注的段落[^1]。AI 智能体技术[^2]正在快速发展。

[^1]: 脚注是对正文内容的补充说明
[^2]: AI 智能体是能够感知环境并采取行动以实现目标的计算机程序

## Emoji 测试

🤖 机器人 | 🚀 火箭 | 💡 灯泡 | ⚡ 闪电 | 🎯 目标 | 📊 图表 | 🔧 工具 | 🌟 星星

## 分隔线测试

---

## 总结

这个测试文档涵盖了 Markdown 的各种语法特性，包括：

1. **基础格式**: 粗体、斜体、删除线、行内代码
2. **结构元素**: 标题、列表、表格、引用块
3. **代码展示**: 多种编程语言的语法高亮
4. **自定义组件**: VitePress 主题的自定义 Vue 组件
5. **扩展功能**: 数学公式、任务列表、提示框、脚注
6. **视觉元素**: 徽章、Emoji、分隔线

通过这个测试文档，可以验证 VitePress 主题是否正确渲染各种 Markdown 内容。