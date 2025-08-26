# API 参考文档

本文档提供了AI智能体系统的完整API参考，包括所有可用的接口、参数说明和使用示例。

## 核心 API

### Agent 类

智能体的核心类，提供基本的对话和任务执行功能。

```python
class Agent:
    def __init__(
        self,
        name: str,
        model: str = "gpt-4",
        system_prompt: str = "",
        tools: List[Tool] = None,
        memory: Memory = None,
        temperature: float = 0.7,
        max_tokens: int = 2048
    )
```

#### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `str` | 必需 | 智能体名称 |
| `model` | `str` | `"gpt-4"` | 使用的语言模型 |
| `system_prompt` | `str` | `""` | 系统提示词 |
| `tools` | `List[Tool]` | `None` | 可用工具列表 |
| `memory` | `Memory` | `None` | 记忆系统 |
| `temperature` | `float` | `0.7` | 生成温度 |
| `max_tokens` | `int` | `2048` | 最大令牌数 |

#### 方法

##### chat()

进行对话交互的主要方法。

```python
def chat(
    self,
    message: str,
    user_id: str = "default",
    context: Dict = None,
    stream: bool = False
) -> str
```

**参数：**
- `message` (str): 用户输入消息
- `user_id` (str): 用户标识符
- `context` (Dict): 额外上下文信息
- `stream` (bool): 是否流式返回

**返回：**
- `str`: 智能体回复

**示例：**
```python
agent = Agent(name="助手", model="gpt-4")
response = agent.chat("你好，请介绍一下自己")
print(response)
```

##### async_chat()

异步版本的对话方法。

```python
async def async_chat(
    self,
    message: str,
    user_id: str = "default",
    context: Dict = None
) -> str
```

##### add_tool()

动态添加工具。

```python
def add_tool(self, tool: Tool) -> None
```

##### remove_tool()

移除工具。

```python
def remove_tool(self, tool_name: str) -> bool
```

##### get_memory()

获取记忆内容。

```python
def get_memory(self, user_id: str = "default") -> Dict
```

##### clear_memory()

清除记忆。

```python
def clear_memory(self, user_id: str = "default") -> None
```

## 记忆系统 API

### ConversationMemory

对话记忆管理类。

```python
class ConversationMemory:
    def __init__(
        self,
        max_turns: int = 10,
        summarize_after: int = 20,
        storage_backend: str = "memory"
    )
```

#### 方法

##### add_turn()

添加对话轮次。

```python
def add_turn(
    self,
    user_input: str,
    agent_response: str,
    user_id: str = "default",
    metadata: Dict = None
) -> None
```

##### get_history()

获取对话历史。

```python
def get_history(
    self,
    user_id: str = "default",
    limit: int = None
) -> List[Dict]
```

##### summarize()

总结对话历史。

```python
def summarize(self, user_id: str = "default") -> str
```

### VectorMemory

向量记忆系统，支持语义搜索。

```python
class VectorMemory:
    def __init__(
        self,
        embedding_model: str = "text-embedding-ada-002",
        vector_store: str = "faiss",
        dimension: int = 1536
    )
```

#### 方法

##### store()

存储记忆。

```python
def store(
    self,
    content: str,
    metadata: Dict = None,
    user_id: str = "default"
) -> str
```

##### search()

搜索相关记忆。

```python
def search(
    self,
    query: str,
    user_id: str = "default",
    limit: int = 5,
    threshold: float = 0.7
) -> List[Dict]
```

## 工具系统 API

### Tool 基类

所有工具的基类。

```python
class Tool:
    def __init__(self, name: str, description: str)
    
    def execute(self, **kwargs) -> Any:
        """执行工具功能"""
        raise NotImplementedError
    
    def get_schema(self) -> Dict:
        """获取工具参数模式"""
        raise NotImplementedError
```

### 内置工具

#### WebSearchTool

网络搜索工具。

```python
class WebSearchTool(Tool):
    def __init__(
        self,
        search_engine: str = "google",
        api_key: str = None,
        max_results: int = 5
    )
    
    def execute(self, query: str, **kwargs) -> List[Dict]:
        """执行搜索"""
        pass
```

**使用示例：**
```python
search_tool = WebSearchTool(api_key="your-api-key")
agent = Agent(name="搜索助手", tools=[search_tool])
response = agent.chat("搜索最新的AI新闻")
```

#### CodeExecutorTool

代码执行工具。

```python
class CodeExecutorTool(Tool):
    def __init__(
        self,
        languages: List[str] = ["python"],
        timeout: int = 30,
        sandbox: bool = True
    )
    
    def execute(
        self,
        code: str,
        language: str = "python",
        **kwargs
    ) -> Dict:
        """执行代码"""
        pass
```

#### DatabaseTool

数据库操作工具。

```python
class DatabaseTool(Tool):
    def __init__(
        self,
        connection_string: str,
        allowed_operations: List[str] = ["SELECT"]
    )
    
    def execute(
        self,
        query: str,
        operation: str = "SELECT",
        **kwargs
    ) -> List[Dict]:
        """执行数据库查询"""
        pass
```

## 多智能体系统 API

### MultiAgentSystem

多智能体协作系统。

```python
class MultiAgentSystem:
    def __init__(
        self,
        agents: List[Agent],
        coordinator: Agent = None,
        communication_protocol: str = "broadcast"
    )
```

#### 方法

##### execute_workflow()

执行工作流。

```python
def execute_workflow(
    self,
    workflow: List[Dict],
    initial_input: str,
    context: Dict = None
) -> Dict
```

**工作流格式：**
```python
workflow = [
    {
        "agent": "researcher",
        "task": "收集信息",
        "inputs": ["user_query"],
        "outputs": ["research_results"]
    },
    {
        "agent": "analyst",
        "task": "分析数据",
        "inputs": ["research_results"],
        "outputs": ["analysis_report"]
    }
]
```

##### broadcast_message()

广播消息给所有智能体。

```python
def broadcast_message(
    self,
    message: str,
    sender: str = "system"
) -> List[str]
```

## REST API 接口

### 聊天接口

**POST** `/api/v1/chat`

发送消息给智能体。

**请求体：**
```json
{
  "message": "用户消息",
  "agent_id": "agent-123",
  "user_id": "user-456",
  "context": {
    "key": "value"
  },
  "stream": false
}
```

**响应：**
```json
{
  "success": true,
  "response": "智能体回复",
  "agent_id": "agent-123",
  "user_id": "user-456",
  "timestamp": "2024-01-01T12:00:00Z",
  "metadata": {
    "tokens_used": 150,
    "response_time": 1.2
  }
}
```

### 智能体管理

**GET** `/api/v1/agents`

获取智能体列表。

**响应：**
```json
{
  "success": true,
  "agents": [
    {
      "id": "agent-123",
      "name": "客服助手",
      "model": "gpt-4",
      "status": "active",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**POST** `/api/v1/agents`

创建新智能体。

**请求体：**
```json
{
  "name": "新助手",
  "model": "gpt-4",
  "system_prompt": "你是一个有用的助手",
  "tools": ["web_search", "calculator"],
  "config": {
    "temperature": 0.7,
    "max_tokens": 2048
  }
}
```

**PUT** `/api/v1/agents/{agent_id}`

更新智能体配置。

**DELETE** `/api/v1/agents/{agent_id}`

删除智能体。

### 记忆管理

**GET** `/api/v1/memory/{user_id}`

获取用户记忆。

**POST** `/api/v1/memory/{user_id}/clear`

清除用户记忆。

### 工具管理

**GET** `/api/v1/tools`

获取可用工具列表。

**POST** `/api/v1/tools/{tool_name}/execute`

执行工具。

## WebSocket API

### 实时聊天

连接到 `ws://localhost:8080/ws/chat`

**发送消息：**
```json
{
  "type": "message",
  "agent_id": "agent-123",
  "user_id": "user-456",
  "message": "用户消息",
  "context": {}
}
```

**接收消息：**
```json
{
  "type": "response",
  "agent_id": "agent-123",
  "user_id": "user-456",
  "message": "智能体回复",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 错误处理

### 错误代码

| 代码 | 说明 |
|------|------|
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求频率限制 |
| 500 | 服务器内部错误 |

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Invalid request parameters",
    "details": {
      "field": "message",
      "issue": "Message cannot be empty"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 配置选项

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `AI_MODEL_PROVIDER` | `openai` | AI模型提供商 |
| `OPENAI_API_KEY` | - | OpenAI API密钥 |
| `MAX_CONCURRENT_REQUESTS` | `100` | 最大并发请求数 |
| `MEMORY_BACKEND` | `memory` | 记忆存储后端 |
| `REDIS_URL` | - | Redis连接URL |
| `LOG_LEVEL` | `INFO` | 日志级别 |

### 配置文件

```yaml
# config.yaml
agent:
  default_model: "gpt-4"
  default_temperature: 0.7
  max_tokens: 2048

memory:
  backend: "redis"
  max_turns: 20
  summarize_after: 50

tools:
  web_search:
    enabled: true
    api_key: "${SEARCH_API_KEY}"
  
  code_executor:
    enabled: true
    timeout: 30
    sandbox: true

api:
  host: "0.0.0.0"
  port: 8080
  cors_origins: ["*"]
  rate_limit: "100/minute"
```

## SDK 示例

### Python SDK

```python
from ai_agent_sdk import AgentClient

# 初始化客户端
client = AgentClient(
    base_url="http://localhost:8080",
    api_key="your-api-key"
)

# 创建智能体
agent = client.create_agent(
    name="我的助手",
    model="gpt-4",
    system_prompt="你是一个有用的助手"
)

# 发送消息
response = client.chat(
    agent_id=agent.id,
    message="你好",
    user_id="user123"
)

print(response.message)
```

### JavaScript SDK

```javascript
import { AgentClient } from 'ai-agent-sdk';

// 初始化客户端
const client = new AgentClient({
  baseUrl: 'http://localhost:8080',
  apiKey: 'your-api-key'
});

// 创建智能体
const agent = await client.createAgent({
  name: '我的助手',
  model: 'gpt-4',
  systemPrompt: '你是一个有用的助手'
});

// 发送消息
const response = await client.chat({
  agentId: agent.id,
  message: '你好',
  userId: 'user123'
});

console.log(response.message);
```

这个API参考文档涵盖了AI智能体系统的所有主要接口和功能，为开发者提供了完整的技术参考。