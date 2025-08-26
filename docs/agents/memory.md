# 记忆系统

AI智能体的记忆管理和存储机制。

## 记忆类型

### 短期记忆
存储当前对话的上下文信息。

```python
from ai_agent.memory import ConversationMemory

short_memory = ConversationMemory(
    max_turns=10,  # 最多记住10轮对话
    max_tokens=4000  # 最大token数
)
```

### 长期记忆
使用向量数据库存储重要信息。

```python
from ai_agent.memory import VectorMemory

long_memory = VectorMemory(
    embedding_model="text-embedding-ada-002",
    vector_db="pinecone",
    max_memories=10000
)
```

### 情节记忆
记录特定事件和经历。

```python
from ai_agent.memory import EpisodicMemory

episodic_memory = EpisodicMemory(
    storage_backend="postgresql"
)
```

## 记忆检索

### 相似性搜索
基于语义相似性检索相关记忆。

### 时间过滤
根据时间范围筛选记忆。

### 重要性排序
按照记忆的重要性进行排序。

## 记忆管理

### 自动清理
定期清理过期或不重要的记忆。

### 记忆压缩
对长期记忆进行压缩存储。

### 隐私保护
确保敏感信息的安全存储。