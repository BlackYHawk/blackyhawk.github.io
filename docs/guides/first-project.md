# 第一个项目

通过实际项目学习AI智能体开发。

## 项目目标

创建一个简单的问答智能体，能够回答用户问题并记住对话历史。

## 项目结构

```
my-first-agent/
├── main.py
├── config.py
├── requirements.txt
└── README.md
```

## 实现步骤

### 1. 创建项目目录

```bash
mkdir my-first-agent
cd my-first-agent
```

### 2. 安装依赖

```bash
pip install ai-agent-framework python-dotenv
```

### 3. 编写代码

**main.py**:
```python
from ai_agent import Agent
from ai_agent.memory import ConversationMemory
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

def main():
    # 创建智能体
    agent = Agent(
        name="问答助手",
        model="gpt-3.5-turbo",
        memory=ConversationMemory(max_turns=10),
        system_prompt="你是一个友好的问答助手，能够记住对话历史。"
    )
    
    print("问答助手已启动！输入 'quit' 退出。")
    
    while True:
        user_input = input("\n用户: ")
        
        if user_input.lower() == 'quit':
            break
            
        response = agent.chat(user_input)
        print(f"助手: {response}")

if __name__ == "__main__":
    main()
```

### 4. 运行项目

```bash
python main.py
```

## 扩展功能

### 添加工具支持

```python
from ai_agent.tools import WebSearchTool

agent = Agent(
    name="增强助手",
    model="gpt-4",
    tools=[WebSearchTool()],
    memory=ConversationMemory(max_turns=10)
)
```

### 添加日志记录

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 在对话中添加日志
logger.info(f"用户输入: {user_input}")
logger.info(f"助手回复: {response}")
```

## 下一步

- [学习高级配置](./advanced.md)
- [了解最佳实践](./best-practices.md)
- [查看更多示例](../examples/)