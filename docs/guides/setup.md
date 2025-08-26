# 环境搭建

设置AI智能体开发环境的详细指南。

## 系统要求

### 硬件要求
- CPU: 2核心以上
- 内存: 4GB以上
- 存储: 10GB可用空间

### 软件要求
- Python 3.8+
- Node.js 16+
- Git

## 安装步骤

### 1. 安装Python依赖

```bash
# 创建虚拟环境
python -m venv ai-agent-env

# 激活虚拟环境
source ai-agent-env/bin/activate  # Linux/Mac
# 或
ai-agent-env\Scripts\activate     # Windows

# 安装依赖包
pip install ai-agent-framework
```

### 2. 配置API密钥

```bash
# 创建配置文件
cp .env.example .env

# 编辑配置文件
nano .env
```

配置内容：
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 3. 验证安装

```python
from ai_agent import Agent

# 创建测试智能体
agent = Agent(model="gpt-3.5-turbo")
response = agent.chat("Hello!")
print(response)
```

## 开发工具推荐

- **IDE**: VS Code, PyCharm
- **调试**: Python Debugger
- **版本控制**: Git
- **API测试**: Postman, curl