# 最佳实践

基于实际项目经验总结的AI智能体开发和部署最佳实践。

## 设计原则

### 1. 单一职责原则

每个智能体应该专注于特定的任务领域：

```python
# ❌ 避免：功能过于复杂的智能体
class UniversalAgent:
    def chat(self): pass
    def code(self): pass
    def analyze_data(self): pass
    def generate_images(self): pass
    def translate(self): pass

# ✅ 推荐：专门化的智能体
class ChatAgent:
    def chat(self): pass

class CodeAgent:
    def generate_code(self): pass
    def review_code(self): pass

class DataAnalyst:
    def analyze(self): pass
    def visualize(self): pass
```

### 2. 渐进式增强

从简单功能开始，逐步增加复杂性：

```python
# 第一版：基础对话
agent_v1 = Agent(
    model='gpt-3.5-turbo',
    system_prompt="你是一个友好的助手"
)

# 第二版：添加工具
agent_v2 = Agent(
    model='gpt-4',
    system_prompt="你是一个友好的助手",
    tools=['web_search', 'calculator']
)

# 第三版：添加记忆
agent_v3 = Agent(
    model='gpt-4',
    system_prompt="你是一个友好的助手",
    tools=['web_search', 'calculator'],
    memory=VectorMemory()
)
```

### 3. 优雅降级

确保在组件失败时系统仍能正常工作：

```python
class RobustAgent:
    def __init__(self):
        self.primary_model = 'gpt-4'
        self.fallback_model = 'gpt-3.5-turbo'
        
    def chat(self, prompt):
        try:
            return self.call_model(self.primary_model, prompt)
        except Exception as e:
            logger.warning(f"Primary model failed: {e}")
            return self.call_model(self.fallback_model, prompt)
```

## 提示词工程

### 结构化提示词

使用清晰的结构来组织提示词：

```python
SYSTEM_PROMPT = """
你是一个专业的客服助手。

## 角色定位
- 友好、耐心、专业
- 以解决用户问题为目标
- 在不确定时会主动询问

## 工作流程
1. 理解用户问题
2. 提供准确信息
3. 确认用户满意度
4. 必要时转接人工

## 回答格式
- 使用简洁明了的语言
- 提供具体的解决步骤
- 包含相关链接或资源

## 限制条件
- 不提供医疗建议
- 不处理财务交易
- 不透露内部信息
"""
```

### 少样本学习

提供具体的示例来指导模型行为：

```python
FEW_SHOT_EXAMPLES = """
用户：我的订单什么时候能到？
助手：我来帮您查询订单状态。请提供您的订单号，我会立即为您查询物流信息。

用户：产品有质量问题怎么办？
助手：非常抱歉给您带来不便。请您：
1. 拍照记录问题
2. 提供订单号
3. 我会立即为您安排退换货流程

用户：{user_input}
助手：
"""
```

### 动态提示词

根据上下文动态调整提示词：

```python
def build_prompt(user_type, conversation_history):
    base_prompt = "你是一个AI助手。"
    
    if user_type == "developer":
        base_prompt += "你擅长编程和技术问题。"
    elif user_type == "business":
        base_prompt += "你专注于商业分析和策略。"
    
    if len(conversation_history) > 5:
        base_prompt += "请保持回答简洁。"
    
    return base_prompt
```

## 错误处理

### 分层错误处理

```python
class ErrorHandler:
    def handle_error(self, error, context):
        if isinstance(error, RateLimitError):
            return self.handle_rate_limit(error)
        elif isinstance(error, ModelError):
            return self.handle_model_error(error)
        elif isinstance(error, NetworkError):
            return self.handle_network_error(error)
        else:
            return self.handle_unknown_error(error, context)
    
    def handle_rate_limit(self, error):
        # 实施退避策略
        time.sleep(error.retry_after)
        return "请稍后再试"
    
    def handle_model_error(self, error):
        # 切换到备用模型
        return self.fallback_response()
```

### 用户友好的错误消息

```python
ERROR_MESSAGES = {
    'rate_limit': "系统繁忙，请稍后再试",
    'model_error': "抱歉，我现在无法处理这个请求",
    'network_error': "网络连接异常，请检查网络设置",
    'timeout': "处理时间过长，请尝试简化您的问题"
}

def get_user_message(error_type):
    return ERROR_MESSAGES.get(error_type, "发生了未知错误，请联系技术支持")
```

## 性能优化

### 缓存策略

```python
from functools import lru_cache
import hashlib

class SmartCache:
    def __init__(self):
        self.cache = {}
        self.ttl = {}
    
    def get_cache_key(self, prompt, model, temperature):
        content = f"{prompt}:{model}:{temperature}"
        return hashlib.md5(content.encode()).hexdigest()
    
    @lru_cache(maxsize=1000)
    def cached_response(self, cache_key):
        if self.is_cache_valid(cache_key):
            return self.cache[cache_key]
        return None
```

### 批量处理

```python
class BatchProcessor:
    def __init__(self, batch_size=10, max_wait=5.0):
        self.batch_size = batch_size
        self.max_wait = max_wait
        self.pending_requests = []
    
    async def add_request(self, request):
        self.pending_requests.append(request)
        
        if len(self.pending_requests) >= self.batch_size:
            return await self.process_batch()
        
        # 等待更多请求或超时
        await asyncio.sleep(self.max_wait)
        return await self.process_batch()
```

### 流式响应

```python
async def stream_chat(prompt):
    async for chunk in model.stream(prompt):
        # 实时处理和验证
        if chunk.is_valid():
            yield chunk.content
        else:
            # 处理无效内容
            continue
```

## 安全实践

### 输入验证

```python
import re
from typing import List

class InputValidator:
    def __init__(self):
        self.max_length = 4000
        self.forbidden_patterns = [
            r'<script.*?>.*?</script>',  # XSS
            r'DROP\s+TABLE',            # SQL注入
            r'rm\s+-rf',                # 危险命令
        ]
    
    def validate(self, user_input: str) -> bool:
        if len(user_input) > self.max_length:
            return False
        
        for pattern in self.forbidden_patterns:
            if re.search(pattern, user_input, re.IGNORECASE):
                return False
        
        return True
```

### 输出过滤

```python
class OutputFilter:
    def __init__(self):
        self.sensitive_patterns = [
            r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',  # 信用卡号
            r'\b\d{3}-\d{2}-\d{4}\b',                        # SSN
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # 邮箱
        ]
    
    def filter_output(self, text: str) -> str:
        for pattern in self.sensitive_patterns:
            text = re.sub(pattern, '[REDACTED]', text)
        return text
```

### 访问控制

```python
from functools import wraps

def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            raise UnauthorizedError("Authentication required")
        return func(*args, **kwargs)
    return wrapper

def rate_limit(max_requests=100, window=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_id = current_user.id
            if not check_rate_limit(user_id, max_requests, window):
                raise RateLimitError("Too many requests")
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

## 测试策略

### 单元测试

```python
import pytest
from unittest.mock import Mock, patch

class TestAgent:
    def setup_method(self):
        self.agent = Agent(model='gpt-4')
    
    @patch('agent.model.call')
    def test_simple_chat(self, mock_call):
        mock_call.return_value = "Hello!"
        response = self.agent.chat("Hi")
        assert response == "Hello!"
        mock_call.assert_called_once()
    
    def test_input_validation(self):
        with pytest.raises(ValueError):
            self.agent.chat("")  # 空输入
        
        with pytest.raises(ValueError):
            self.agent.chat("x" * 10000)  # 过长输入
```

### 集成测试

```python
class TestAgentIntegration:
    def test_end_to_end_conversation(self):
        agent = Agent(model='gpt-4')
        
        # 测试多轮对话
        response1 = agent.chat("我叫张三")
        response2 = agent.chat("我的名字是什么？")
        
        assert "张三" in response2
    
    def test_tool_integration(self):
        agent = Agent(
            model='gpt-4',
            tools=['calculator']
        )
        
        response = agent.chat("计算 2 + 2")
        assert "4" in response
```

### 性能测试

```python
import time
import asyncio

class TestPerformance:
    async def test_concurrent_requests(self):
        agent = Agent(model='gpt-4')
        
        start_time = time.time()
        tasks = [
            agent.chat(f"请求 {i}")
            for i in range(100)
        ]
        
        responses = await asyncio.gather(*tasks)
        end_time = time.time()
        
        assert len(responses) == 100
        assert end_time - start_time < 30  # 30秒内完成
```

## 监控和运维

### 关键指标

```python
class MetricsCollector:
    def __init__(self):
        self.metrics = {
            'requests_total': 0,
            'requests_success': 0,
            'requests_error': 0,
            'response_time_sum': 0,
            'token_usage_sum': 0
        }
    
    def record_request(self, success, response_time, tokens):
        self.metrics['requests_total'] += 1
        if success:
            self.metrics['requests_success'] += 1
        else:
            self.metrics['requests_error'] += 1
        
        self.metrics['response_time_sum'] += response_time
        self.metrics['token_usage_sum'] += tokens
    
    def get_stats(self):
        total = self.metrics['requests_total']
        if total == 0:
            return {}
        
        return {
            'success_rate': self.metrics['requests_success'] / total,
            'error_rate': self.metrics['requests_error'] / total,
            'avg_response_time': self.metrics['response_time_sum'] / total,
            'avg_token_usage': self.metrics['token_usage_sum'] / total
        }
```

### 告警系统

```python
class AlertManager:
    def __init__(self):
        self.thresholds = {
            'error_rate': 0.05,      # 5%错误率
            'response_time': 5.0,    # 5秒响应时间
            'token_usage': 1000000   # 100万token/小时
        }
    
    def check_alerts(self, metrics):
        alerts = []
        
        if metrics['error_rate'] > self.thresholds['error_rate']:
            alerts.append(f"高错误率: {metrics['error_rate']:.2%}")
        
        if metrics['avg_response_time'] > self.thresholds['response_time']:
            alerts.append(f"响应时间过长: {metrics['avg_response_time']:.2f}s")
        
        return alerts
```

## 部署和扩展

### 容器化

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# 启动应用
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

### 自动扩展

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-agent-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-agent
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 总结

遵循这些最佳实践可以帮助你构建更可靠、高效和安全的AI智能体系统：

1. **设计阶段**：明确职责、渐进增强、优雅降级
2. **开发阶段**：结构化提示词、完善错误处理、性能优化
3. **安全阶段**：输入验证、输出过滤、访问控制
4. **测试阶段**：全面的测试策略
5. **运维阶段**：监控告警、自动扩展

记住，最佳实践是在实际项目中不断演进的，要根据具体场景灵活调整。