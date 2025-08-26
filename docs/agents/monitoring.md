# 性能监控

监控AI智能体系统性能和健康状态。

## 监控指标

### 系统指标
- CPU使用率
- 内存使用率
- 磁盘I/O
- 网络流量

### 应用指标
- 响应时间
- 请求量
- 错误率
- 并发用户数

### 业务指标
- 任务完成率
- 用户满意度
- Token消耗量
- 成本效益

## 监控工具

### Prometheus + Grafana
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ai-agent'
    static_configs:
      - targets: ['localhost:8080']
```

### 自定义监控
```python
from prometheus_client import Counter, Histogram, generate_latest

# 定义指标
REQUEST_COUNT = Counter('requests_total', 'Total requests')
REQUEST_DURATION = Histogram('request_duration_seconds', 'Request duration')

@REQUEST_DURATION.time()
def process_request():
    REQUEST_COUNT.inc()
    # 处理请求
    pass
```

## 告警配置

### 告警规则
```yaml
groups:
  - name: ai-agent-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
```

### 通知渠道
- 邮件通知
- 短信告警
- Slack集成
- 钉钉机器人

## 日志分析

### 结构化日志
```python
import structlog

logger = structlog.get_logger()

logger.info(
    "Request processed",
    user_id="123",
    request_id="abc",
    duration=0.5,
    status="success"
)
```

### 日志聚合
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Fluentd
- 云日志服务