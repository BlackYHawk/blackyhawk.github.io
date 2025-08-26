# 工具集成

为AI智能体集成外部工具和能力。

## 内置工具

### 网络搜索工具
```python
from ai_agent.tools import WebSearchTool

search_tool = WebSearchTool(
    search_engine="google",
    max_results=5
)

agent = Agent(
    model="gpt-4",
    tools=[search_tool]
)
```

### 代码执行工具
```python
from ai_agent.tools import CodeExecutorTool

code_tool = CodeExecutorTool(
    languages=["python", "javascript"],
    timeout=30
)
```

### 计算器工具
```python
from ai_agent.tools import CalculatorTool

calc_tool = CalculatorTool()
```

## 自定义工具

```python
from ai_agent.tools import BaseTool

class WeatherTool(BaseTool):
    name = "weather"
    description = "获取天气信息"
    
    def execute(self, location: str):
        # 实现天气查询逻辑
        return f"{location}的天气信息"

# 注册工具
agent.register_tool(WeatherTool())
```

## 工具管理

### 动态工具选择
智能体会根据用户请求自动选择合适的工具。

### 工具链
多个工具可以组合使用完成复杂任务。

### 安全控制
对工具的使用进行安全限制和监控。