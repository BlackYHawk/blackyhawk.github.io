# 带记忆对话示例

实现能够记住对话历史的智能体。

## 基础记忆实现

```python
from ai_agent import Agent
from ai_agent.memory import ConversationMemory

# 创建带记忆的智能体
memory_agent = Agent(
    name="记忆助手",
    model="gpt-4",
    memory=ConversationMemory(max_turns=10),
    system_prompt="你能记住我们的对话历史，请根据上下文回答问题。"
)

# 测试记忆功能
print(memory_agent.chat("我叫张三"))
print(memory_agent.chat("我今年25岁"))
print(memory_agent.chat("请介绍一下我"))  # 会基于之前信息回答
```

## 长期记忆

```python
from ai_agent.memory import VectorMemory

# 使用向量数据库存储长期记忆
long_term_agent = Agent(
    name="长期记忆助手",
    model="gpt-4",
    memory=VectorMemory(
        embedding_model="text-embedding-ada-002",
        max_memories=1000
    )
)

# 存储重要信息
long_term_agent.chat("请记住：我的生日是1月1日")
long_term_agent.chat("我的爱好是编程和阅读")

# 稍后查询
response = long_term_agent.chat("我的生日是什么时候？")
print(response)
```

## 混合记忆系统

```python
from ai_agent.memory import HybridMemory

# 结合短期和长期记忆
hybrid_agent = Agent(
    name="混合记忆助手",
    model="gpt-4",
    memory=HybridMemory(
        short_term=ConversationMemory(max_turns=5),
        long_term=VectorMemory(max_memories=500)
    )
)
```