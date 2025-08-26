# 示例集合

这里收集了各种AI智能体的实际应用示例，帮助你快速理解和实现不同场景的智能体。

## 基础示例

### 简单对话机器人

最基础的智能体实现，适合初学者：

```python
from ai_agent import Agent

# 创建基础对话机器人
chatbot = Agent(
    name="小助手",
    model="gpt-3.5-turbo",
    system_prompt="你是一个友好的AI助手，乐于帮助用户解答问题。"
)

# 开始对话
while True:
    user_input = input("用户: ")
    if user_input.lower() in ['退出', 'quit', 'exit']:
        break
    
    response = chatbot.chat(user_input)
    print(f"助手: {response}")
```

### 带记忆的智能体

能够记住对话历史的智能体：

```python
from ai_agent import Agent
from ai_agent.memory import ConversationMemory

# 创建带记忆的智能体
memory_agent = Agent(
    name="记忆助手",
    model="gpt-4",
    memory=ConversationMemory(max_turns=10),
    system_prompt="""
    你是一个能够记住对话历史的AI助手。
    请根据之前的对话内容来回答用户的问题。
    """
)

# 示例对话
print(memory_agent.chat("我叫张三，今年25岁"))
print(memory_agent.chat("我的爱好是编程和阅读"))
print(memory_agent.chat("请介绍一下我自己"))  # 会基于之前的信息回答
```

## 工具集成示例

### 网络搜索助手

集成搜索功能的智能体：

```python
from ai_agent import Agent
from ai_agent.tools import WebSearchTool

# 创建搜索助手
search_agent = Agent(
    name="搜索助手",
    model="gpt-4",
    tools=[WebSearchTool()],
    system_prompt="""
    你是一个搜索助手，可以帮助用户搜索最新信息。
    当用户询问需要实时信息的问题时，请使用搜索工具。
    """
)

# 使用示例
response = search_agent.chat("今天的天气怎么样？")
print(response)
```

### 代码执行助手

能够执行代码的智能体：

```python
from ai_agent import Agent
from ai_agent.tools import CodeExecutorTool

# 创建代码助手
code_agent = Agent(
    name="代码助手",
    model="gpt-4",
    tools=[CodeExecutorTool(languages=['python', 'javascript'])],
    system_prompt="""
    你是一个编程助手，可以帮助用户编写和执行代码。
    当需要验证代码结果时，请使用代码执行工具。
    """
)

# 使用示例
response = code_agent.chat("帮我计算斐波那契数列的前10项")
print(response)
```

## 专业应用示例

### 客服机器人

完整的客服系统实现：

```python
from ai_agent import Agent
from ai_agent.tools import DatabaseTool, EmailTool
from ai_agent.memory import VectorMemory

class CustomerServiceBot:
    def __init__(self):
        self.agent = Agent(
            name="客服机器人",
            model="gpt-4",
            tools=[
                DatabaseTool(connection_string="sqlite:///customer.db"),
                EmailTool(smtp_config={...})
            ],
            memory=VectorMemory(),
            system_prompt=self.get_system_prompt()
        )
    
    def get_system_prompt(self):
        return """
        你是一个专业的客服机器人，负责处理客户咨询。
        
        工作流程：
        1. 友好地问候客户
        2. 理解客户问题
        3. 查询相关信息
        4. 提供解决方案
        5. 确认客户满意度
        
        如果无法解决问题，请转接人工客服。
        """
    
    def handle_inquiry(self, customer_message):
        return self.agent.chat(customer_message)

# 使用示例
customer_service = CustomerServiceBot()
response = customer_service.handle_inquiry("我的订单什么时候能到？")
```

### 内容创作助手

专门用于内容创作的智能体：

```python
from ai_agent import Agent
from ai_agent.tools import ImageGeneratorTool, SEOAnalyzerTool

class ContentCreator:
    def __init__(self):
        self.agent = Agent(
            name="内容创作助手",
            model="gpt-4",
            tools=[
                ImageGeneratorTool(),
                SEOAnalyzerTool()
            ],
            system_prompt="""
            你是一个专业的内容创作助手，擅长：
            - 文章写作和编辑
            - SEO优化建议
            - 配图生成
            - 内容策略规划
            """
        )
    
    def create_article(self, topic, target_audience, word_count=800):
        prompt = f"""
        请为以下主题创作一篇文章：
        主题：{topic}
        目标受众：{target_audience}
        字数要求：{word_count}字左右
        
        请包含：
        1. 吸引人的标题
        2. 结构清晰的内容
        3. SEO关键词建议
        4. 配图建议
        """
        return self.agent.chat(prompt)

# 使用示例
creator = ContentCreator()
article = creator.create_article(
    topic="AI在教育中的应用",
    target_audience="教育工作者",
    word_count=1000
)
```

### 数据分析助手

专门处理数据分析任务的智能体：

```python
import pandas as pd
from ai_agent import Agent
from ai_agent.tools import DataVisualizationTool, StatisticsToolkit

class DataAnalyst:
    def __init__(self):
        self.agent = Agent(
            name="数据分析师",
            model="gpt-4",
            tools=[
                DataVisualizationTool(),
                StatisticsToolkit()
            ],
            system_prompt="""
            你是一个专业的数据分析师，能够：
            - 分析数据趋势和模式
            - 创建可视化图表
            - 提供统计洞察
            - 生成分析报告
            """
        )
    
    def analyze_dataset(self, data_path, analysis_type="comprehensive"):
        # 读取数据
        df = pd.read_csv(data_path)
        
        prompt = f"""
        请分析以下数据集：
        数据形状：{df.shape}
        列名：{list(df.columns)}
        数据类型：{df.dtypes.to_dict()}
        
        分析类型：{analysis_type}
        
        请提供：
        1. 数据概览
        2. 关键统计指标
        3. 趋势分析
        4. 可视化建议
        5. 结论和建议
        """
        
        return self.agent.chat(prompt)

# 使用示例
analyst = DataAnalyst()
report = analyst.analyze_dataset("sales_data.csv", "sales_performance")
```

## 高级示例

### 多智能体协作系统

多个智能体协同工作的示例：

```python
from ai_agent import Agent, MultiAgentSystem

class ProjectManager:
    def __init__(self):
        # 创建不同角色的智能体
        self.researcher = Agent(
            name="研究员",
            model="gpt-4",
            system_prompt="你负责收集和分析信息"
        )
        
        self.designer = Agent(
            name="设计师",
            model="gpt-4",
            system_prompt="你负责创意设计和用户体验"
        )
        
        self.developer = Agent(
            name="开发者",
            model="gpt-4",
            system_prompt="你负责技术实现和代码编写"
        )
        
        # 创建多智能体系统
        self.system = MultiAgentSystem([
            self.researcher,
            self.designer,
            self.developer
        ])
    
    def execute_project(self, project_description):
        # 定义工作流
        workflow = [
            ("researcher", "分析项目需求和市场调研"),
            ("designer", "基于研究结果设计用户界面"),
            ("developer", "根据设计实现技术方案")
        ]
        
        results = {}
        context = project_description
        
        for agent_name, task in workflow:
            agent = getattr(self, agent_name)
            prompt = f"项目背景：{context}\n任务：{task}"
            result = agent.chat(prompt)
            results[agent_name] = result
            context += f"\n{agent_name}的输出：{result}"
        
        return results

# 使用示例
pm = ProjectManager()
project_results = pm.execute_project("开发一个AI驱动的学习平台")
```

### 自适应学习系统

能够根据用户反馈自我改进的智能体：

```python
from ai_agent import Agent
from ai_agent.learning import ReinforcementLearning

class AdaptiveTutor:
    def __init__(self):
        self.agent = Agent(
            name="自适应导师",
            model="gpt-4",
            learning_system=ReinforcementLearning()
        )
        self.user_progress = {}
    
    def teach(self, user_id, topic, difficulty_level=1):
        # 获取用户历史表现
        user_history = self.user_progress.get(user_id, {})
        
        prompt = f"""
        用户ID：{user_id}
        学习主题：{topic}
        难度级别：{difficulty_level}
        历史表现：{user_history}
        
        请提供个性化的教学内容，包括：
        1. 概念解释
        2. 实例演示
        3. 练习题目
        4. 学习建议
        """
        
        response = self.agent.chat(prompt)
        return response
    
    def receive_feedback(self, user_id, topic, feedback_score):
        # 更新用户进度
        if user_id not in self.user_progress:
            self.user_progress[user_id] = {}
        
        self.user_progress[user_id][topic] = feedback_score
        
        # 让智能体学习用户反馈
        self.agent.learning_system.update(
            state=topic,
            action=self.agent.last_response,
            reward=feedback_score
        )

# 使用示例
tutor = AdaptiveTutor()
lesson = tutor.teach("user123", "Python基础", difficulty_level=2)
tutor.receive_feedback("user123", "Python基础", feedback_score=0.8)
```

## 部署示例

### Web API服务

将智能体部署为Web服务：

```python
from flask import Flask, request, jsonify
from ai_agent import Agent

app = Flask(__name__)

# 初始化智能体
agent = Agent(
    name="API助手",
    model="gpt-4",
    system_prompt="你是一个通过API提供服务的AI助手"
)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        user_id = data.get('user_id', 'anonymous')
        
        # 处理消息
        response = agent.chat(user_message, user_id=user_id)
        
        return jsonify({
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

### 实时聊天应用

使用WebSocket的实时聊天示例：

```python
import asyncio
import websockets
import json
from ai_agent import Agent

class ChatServer:
    def __init__(self):
        self.agent = Agent(
            name="聊天助手",
            model="gpt-4",
            system_prompt="你是一个实时聊天助手"
        )
        self.clients = set()
    
    async def register(self, websocket):
        self.clients.add(websocket)
        print(f"客户端已连接，当前连接数：{len(self.clients)}")
    
    async def unregister(self, websocket):
        self.clients.remove(websocket)
        print(f"客户端已断开，当前连接数：{len(self.clients)}")
    
    async def handle_message(self, websocket, message):
        try:
            data = json.loads(message)
            user_message = data.get('message', '')
            
            # 生成回复
            response = await self.agent.async_chat(user_message)
            
            # 发送回复
            await websocket.send(json.dumps({
                'type': 'response',
                'message': response
            }))
            
        except Exception as e:
            await websocket.send(json.dumps({
                'type': 'error',
                'message': f'处理消息时出错：{str(e)}'
            }))
    
    async def handler(self, websocket, path):
        await self.register(websocket)
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        finally:
            await self.unregister(websocket)

# 启动服务器
chat_server = ChatServer()
start_server = websockets.serve(chat_server.handler, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
```

## 测试示例

### 单元测试

```python
import pytest
from unittest.mock import Mock, patch
from ai_agent import Agent

class TestAgent:
    @pytest.fixture
    def agent(self):
        return Agent(
            name="测试助手",
            model="gpt-3.5-turbo"
        )
    
    def test_basic_chat(self, agent):
        with patch.object(agent, 'call_model') as mock_call:
            mock_call.return_value = "Hello, World!"
            
            response = agent.chat("Hello")
            
            assert response == "Hello, World!"
            mock_call.assert_called_once()
    
    def test_empty_input(self, agent):
        with pytest.raises(ValueError):
            agent.chat("")
    
    def test_long_input(self, agent):
        long_input = "x" * 10000
        with pytest.raises(ValueError):
            agent.chat(long_input)

# 运行测试
# pytest test_agent.py -v
```

这些示例涵盖了从基础到高级的各种应用场景，你可以根据自己的需求选择合适的示例作为起点。每个示例都包含了完整的代码和使用说明，帮助你快速理解和实现。