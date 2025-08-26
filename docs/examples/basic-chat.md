# 简单对话示例

最基础的AI智能体对话实现。

## 基础实现

```python
from ai_agent import Agent

# 创建简单对话智能体
chatbot = Agent(
    name="简单助手",
    model="gpt-3.5-turbo",
    system_prompt="你是一个友好的AI助手。"
)

# 单次对话
response = chatbot.chat("你好！")
print(response)
```

## 交互式对话

```python
def interactive_chat():
    chatbot = Agent(
        name="交互助手",
        model="gpt-3.5-turbo"
    )
    
    print("开始对话（输入 'exit' 退出）:")
    
    while True:
        user_input = input("你: ")
        
        if user_input.lower() == 'exit':
            print("再见！")
            break
            
        response = chatbot.chat(user_input)
        print(f"助手: {response}")

# 运行交互式对话
interactive_chat()
```

## 自定义配置

```python
# 配置不同的对话风格
formal_agent = Agent(
    name="正式助手",
    model="gpt-4",
    system_prompt="你是一个正式、专业的AI助手。",
    temperature=0.3
)

casual_agent = Agent(
    name="随意助手", 
    model="gpt-3.5-turbo",
    system_prompt="你是一个轻松、幽默的AI助手。",
    temperature=0.8
)
```