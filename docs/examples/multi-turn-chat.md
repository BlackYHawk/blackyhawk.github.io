# 多轮对话智能体

这个示例展示如何创建一个支持复杂多轮对话的AI智能体，能够维护对话上下文并处理复杂的交互场景。

## 核心特性

- 🧠 **上下文记忆** - 记住整个对话历史
- 🎯 **意图跟踪** - 跟踪用户意图的变化
- 🔄 **话题切换** - 自然处理话题转换
- 📝 **状态管理** - 维护对话状态

## 实现示例

```python
from ai_agent import Agent
from ai_agent.memory import ConversationMemory
from ai_agent.context import ContextManager

class MultiTurnChatAgent:
    def __init__(self):
        self.agent = Agent(
            name="多轮对话助手",
            model="gpt-4",
            memory=ConversationMemory(
                max_turns=20,
                summarize_after=10
            ),
            system_prompt=self.get_system_prompt()
        )
        self.context_manager = ContextManager()
        self.conversation_state = {}
    
    def get_system_prompt(self):
        return """
        你是一个智能对话助手，擅长进行自然、连贯的多轮对话。
        
        对话原则：
        1. 保持对话的连贯性和一致性
        2. 主动询问澄清问题
        3. 记住用户提到的重要信息
        4. 适时总结和确认理解
        5. 自然地处理话题转换
        
        当用户改变话题时，要自然地过渡。
        当需要更多信息时，要主动询问。
        """
    
    def chat(self, user_input, user_id="default"):
        # 更新对话状态
        self.update_conversation_state(user_input, user_id)
        
        # 构建上下文
        context = self.build_context(user_id)
        
        # 生成回复
        response = self.agent.chat(
            user_input,
            context=context,
            user_id=user_id
        )
        
        # 更新记忆
        self.update_memory(user_input, response, user_id)
        
        return response
    
    def update_conversation_state(self, user_input, user_id):
        if user_id not in self.conversation_state:
            self.conversation_state[user_id] = {
                'current_topic': None,
                'user_info': {},
                'pending_questions': [],
                'conversation_flow': []
            }
        
        # 分析用户输入
        intent = self.analyze_intent(user_input)
        topic = self.extract_topic(user_input)
        
        state = self.conversation_state[user_id]
        state['conversation_flow'].append({
            'input': user_input,
            'intent': intent,
            'topic': topic,
            'timestamp': datetime.now()
        })
        
        # 更新当前话题
        if topic and topic != state['current_topic']:
            state['current_topic'] = topic
    
    def build_context(self, user_id):
        state = self.conversation_state.get(user_id, {})
        
        context = {
            'current_topic': state.get('current_topic'),
            'user_info': state.get('user_info', {}),
            'recent_flow': state.get('conversation_flow', [])[-5:],
            'pending_questions': state.get('pending_questions', [])
        }
        
        return context
    
    def analyze_intent(self, user_input):
        # 简化的意图分析
        intents = {
            'question': ['什么', '如何', '为什么', '哪里', '什么时候'],
            'request': ['请', '帮我', '能否', '可以'],
            'information': ['我是', '我的', '我有', '我想'],
            'greeting': ['你好', '早上好', '晚上好'],
            'goodbye': ['再见', '拜拜', '结束']
        }
        
        for intent, keywords in intents.items():
            if any(keyword in user_input for keyword in keywords):
                return intent
        
        return 'general'
    
    def extract_topic(self, user_input):
        # 简化的话题提取
        topics = {
            '工作': ['工作', '职业', '公司', '项目'],
            '学习': ['学习', '课程', '考试', '知识'],
            '生活': ['生活', '家庭', '朋友', '爱好'],
            '技术': ['编程', '代码', '算法', '开发'],
            '健康': ['健康', '运动', '饮食', '医疗']
        }
        
        for topic, keywords in topics.items():
            if any(keyword in user_input for keyword in keywords):
                return topic
        
        return None
    
    def update_memory(self, user_input, response, user_id):
        # 提取重要信息
        important_info = self.extract_important_info(user_input)
        
        if important_info and user_id in self.conversation_state:
            self.conversation_state[user_id]['user_info'].update(important_info)
    
    def extract_important_info(self, text):
        # 简化的信息提取
        info = {}
        
        # 提取姓名
        if '我叫' in text or '我是' in text:
            # 这里可以使用更复杂的NLP技术
            pass
        
        # 提取年龄
        if '岁' in text:
            # 提取年龄信息
            pass
        
        return info

# 使用示例
def demo_multi_turn_chat():
    agent = MultiTurnChatAgent()
    
    print("多轮对话智能体演示")
    print("输入 'quit' 退出")
    print("-" * 40)
    
    while True:
        user_input = input("用户: ")
        if user_input.lower() == 'quit':
            break
        
        response = agent.chat(user_input)
        print(f"助手: {response}")
        print()

if __name__ == "__main__":
    demo_multi_turn_chat()
```

## 高级功能

### 对话状态跟踪

```python
class ConversationStateTracker:
    def __init__(self):
        self.states = {}
    
    def track_state(self, user_id, state_info):
        if user_id not in self.states:
            self.states[user_id] = {
                'entities': {},
                'intents': [],
                'context': {},
                'flow_stage': 'initial'
            }
        
        self.states[user_id].update(state_info)
    
    def get_state(self, user_id):
        return self.states.get(user_id, {})
```

### 智能话题切换

```python
class TopicManager:
    def __init__(self):
        self.topic_transitions = {
            '工作': ['学习', '技术', '生活'],
            '学习': ['工作', '技术'],
            '生活': ['工作', '健康'],
            '技术': ['工作', '学习'],
            '健康': ['生活']
        }
    
    def can_transition(self, from_topic, to_topic):
        return to_topic in self.topic_transitions.get(from_topic, [])
    
    def generate_transition(self, from_topic, to_topic):
        if self.can_transition(from_topic, to_topic):
            return f"好的，我们从{from_topic}话题转到{to_topic}话题。"
        else:
            return f"让我们聊聊{to_topic}相关的内容。"
```

### 对话质量评估

```python
class ConversationQualityAssessor:
    def __init__(self):
        self.metrics = {
            'coherence': 0.0,
            'engagement': 0.0,
            'informativeness': 0.0,
            'naturalness': 0.0
        }
    
    def assess_turn(self, user_input, agent_response, context):
        # 评估对话质量
        coherence = self.assess_coherence(agent_response, context)
        engagement = self.assess_engagement(agent_response)
        informativeness = self.assess_informativeness(agent_response)
        naturalness = self.assess_naturalness(agent_response)
        
        return {
            'coherence': coherence,
            'engagement': engagement,
            'informativeness': informativeness,
            'naturalness': naturalness
        }
    
    def assess_coherence(self, response, context):
        # 评估回复的连贯性
        return 0.8  # 简化实现
    
    def assess_engagement(self, response):
        # 评估回复的吸引力
        question_count = response.count('?') + response.count('？')
        return min(1.0, question_count * 0.3)
    
    def assess_informativeness(self, response):
        # 评估回复的信息量
        return min(1.0, len(response) / 100)
    
    def assess_naturalness(self, response):
        # 评估回复的自然度
        return 0.9  # 简化实现
```

## 测试示例

```python
import pytest
from unittest.mock import Mock

class TestMultiTurnChatAgent:
    @pytest.fixture
    def agent(self):
        return MultiTurnChatAgent()
    
    def test_context_maintenance(self, agent):
        # 测试上下文维护
        agent.chat("我叫张三", "user1")
        response = agent.chat("我的名字是什么？", "user1")
        assert "张三" in response
    
    def test_topic_switching(self, agent):
        # 测试话题切换
        agent.chat("我在学习编程", "user1")
        agent.chat("我们聊聊工作吧", "user1")
        
        state = agent.conversation_state["user1"]
        assert state['current_topic'] == '工作'
    
    def test_intent_recognition(self, agent):
        # 测试意图识别
        intent = agent.analyze_intent("请帮我解决这个问题")
        assert intent == 'request'
        
        intent = agent.analyze_intent("什么是人工智能？")
        assert intent == 'question'
```

## 部署配置

```yaml
# docker-compose.yml
version: '3.8'
services:
  multi-turn-chat:
    build: .
    ports:
      - "8080:8080"
    environment:
      - MODEL_NAME=gpt-4
      - MAX_MEMORY_TURNS=20
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

这个多轮对话智能体提供了完整的对话管理功能，包括上下文维护、话题跟踪、状态管理等高级特性，适合构建复杂的对话应用。