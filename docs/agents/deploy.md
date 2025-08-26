# 部署智能体

将你的AI智能体部署到生产环境的完整指南。

## 部署前准备

### 环境检查

确保你的部署环境满足以下要求：

- [ ] 服务器资源充足
- [ ] 网络连接稳定
- [ ] API密钥配置正确
- [ ] 安全策略已设置

### 配置验证

```bash
# 验证配置文件
./validate-config.sh

# 测试API连接
curl -X POST "https://api.example.com/test" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 部署方式

### 1. 云服务部署

#### AWS部署

```yaml
# docker-compose.yml
version: '3.8'
services:
  ai-agent:
    image: your-registry/ai-agent:latest
    ports:
      - "8080:8080"
    environment:
      - API_KEY=${API_KEY}
      - MODEL_NAME=gpt-4
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

#### Azure部署

```json
{
  "containerSettings": {
    "image": "your-registry/ai-agent:latest",
    "cpu": 1.0,
    "memory": "2Gi",
    "environmentVariables": [
      {
        "name": "API_KEY",
        "secureValue": "your-secure-api-key"
      }
    ]
  }
}
```

### 2. 本地部署

```bash
# 克隆项目
git clone https://github.com/your-repo/ai-agent.git
cd ai-agent

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 启动服务
npm start
```

### 3. Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 8080

CMD ["npm", "start"]
```

## 负载均衡

### Nginx配置

```nginx
upstream ai_agent {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://ai_agent;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 监控和日志

### 健康检查

```javascript
// health-check.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 日志收集

```yaml
# logging-config.yml
version: '3.8'
services:
  ai-agent:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 安全配置

### HTTPS配置

```bash
# 使用Let's Encrypt获取SSL证书
certbot --nginx -d your-domain.com
```

### API安全

```javascript
// 添加API密钥验证
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});
```

## 扩展和维护

### 自动扩展

```yaml
# kubernetes-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-agent
  template:
    spec:
      containers:
      - name: ai-agent
        image: your-registry/ai-agent:latest
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
```

### 更新策略

- 蓝绿部署
- 滚动更新
- 金丝雀发布

## 故障排除

### 常见问题

1. **API连接超时**
   - 检查网络连接
   - 验证API密钥
   - 调整超时设置

2. **内存不足**
   - 增加服务器内存
   - 优化模型参数
   - 实施缓存策略

3. **响应缓慢**
   - 启用负载均衡
   - 优化数据库查询
   - 使用CDN加速

### 监控指标

- CPU使用率
- 内存使用率
- 响应时间
- 错误率
- 并发用户数