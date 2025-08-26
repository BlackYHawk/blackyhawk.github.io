# 安全实践

确保AI智能体系统安全的最佳实践。

## 输入安全

### 输入验证
```python
import re

def validate_input(user_input):
    # 长度检查
    if len(user_input) > 4000:
        raise ValueError("输入过长")
    
    # 内容过滤
    dangerous_patterns = [
        r'<script.*?>.*?</script>',
        r'DROP\s+TABLE',
        r'rm\s+-rf'
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, user_input, re.IGNORECASE):
            raise ValueError("检测到危险内容")
    
    return True
```

### 内容过滤
- XSS攻击防护
- SQL注入防护
- 命令注入防护

## 输出安全

### 敏感信息过滤
```python
def filter_sensitive_info(text):
    # 过滤信用卡号
    text = re.sub(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', '[CARD]', text)
    
    # 过滤邮箱
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
    
    return text
```

## 访问控制

### 身份认证
- API密钥验证
- JWT令牌
- OAuth 2.0

### 权限管理
```python
from functools import wraps

def require_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not current_user.has_permission(permission):
                raise PermissionError("权限不足")
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

## 数据安全

### 加密存储
- 敏感数据加密
- 密钥管理
- 传输加密

### 隐私保护
- 数据脱敏
- 访问日志
- 数据清理