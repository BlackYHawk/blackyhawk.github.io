# 部署指南

本文档描述了如何将 AI 智能体指南网站部署到 GitHub Pages。

## 🚀 自动部署 (推荐)

### GitHub Actions 自动部署

项目已配置 GitHub Actions 工作流，当代码推送到 `main` 分支时会自动构建和部署。

**工作流特性:**
- ✅ 自动触发：推送到 main 分支时
- ✅ 路径过滤：只有相关文件变更时才触发
- ✅ 缓存优化：pnpm 依赖缓存
- ✅ 类型检查：构建前进行 TypeScript 检查
- ✅ 构建验证：确保所有必需文件存在

**触发条件:**
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'package.json'
      - 'pnpm-lock.yaml'
      - '.github/workflows/deploy.yml'
```

### 手动触发部署

在 GitHub 仓库页面：
1. 点击 "Actions" 标签
2. 选择 "Deploy VitePress site to Pages" 工作流
3. 点击 "Run workflow" 按钮

## 🛠️ 手动部署

### 使用部署脚本

```bash
# 执行部署脚本
./deploy.sh
```

### 使用 npm 脚本

```bash
# 构建并验证
pnpm run build:verify

# 仅构建
pnpm run build

# 仅验证构建输出
pnpm run verify

# 清理构建文件
pnpm run clean
```

## 📋 部署前检查清单

### 环境要求
- [x] Node.js 20+
- [x] pnpm 9+
- [x] Git 配置正确

### 配置检查
- [x] VitePress 配置正确 (`docs/.vitepress/config.mts`)
- [x] Base 路径配置正确 (根域名部署，base: '/')
- [x] 站点地图配置 (hostname: 'https://blackyhawk.github.io')
- [x] GitHub Actions 工作流配置

### 构建验证
- [x] TypeScript 类型检查通过
- [x] VitePress 构建成功
- [x] 所有必需文件存在：
  - `index.html`
  - `404.html`
  - `sitemap.xml`
  - `robots.txt`
  - `.nojekyll`
  - `hashmap.json`

## 🔧 配置说明

### VitePress 配置

```typescript
// docs/.vitepress/config.mts
export default defineConfig({
  base: '/', // GitHub Pages 用户站点，使用根路径
  sitemap: {
    hostname: 'https://blackyhawk.github.io'
  },
  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true
})
```

### GitHub Pages 设置

1. 在 GitHub 仓库设置中：
   - Settings → Pages
   - Source: GitHub Actions
   - 确保 Actions 有写入权限

2. 仓库权限设置：
   - Settings → Actions → General
   - Workflow permissions: Read and write permissions

## 📊 性能优化

### 构建优化
- ✅ 代码分割 (Element Plus 单独打包)
- ✅ 资源压缩 (Terser 压缩)
- ✅ CSS 代码分割
- ✅ 静态资源优化

### 缓存策略
- ✅ pnpm 依赖缓存
- ✅ 构建输出缓存
- ✅ 静态资源版本控制

## 🐛 故障排除

### 常见问题

**1. 构建失败**
```bash
# 清理缓存重新构建
pnpm run clean
pnpm run build
```

**2. 样式不生效**
- 检查 SCSS 导入路径
- 确保 Element Plus 样式正确加载

**3. 404 页面不显示**
- 确保 `docs/404.md` 存在
- 检查 GitHub Pages 设置

**4. 站点地图问题**
- 验证 `sitemap.xml` 生成
- 检查 hostname 配置

### 调试命令

```bash
# 本地预览构建结果
pnpm run docs:preview

# 检查构建输出
pnpm run verify

# 查看详细构建日志
pnpm run docs:build --debug
```

## 📈 监控和维护

### 部署状态监控
- GitHub Actions 工作流状态
- GitHub Pages 部署状态
- 网站可访问性检查

### 定期维护
- 依赖更新检查
- 性能监控
- 内容更新

## 🌐 访问地址

- **生产环境**: https://blackyhawk.github.io
- **本地开发**: http://localhost:5173
- **本地预览**: http://localhost:4173

## 📝 更新日志

查看 [CHANGELOG.md](./docs/changelog.md) 了解版本更新信息。

---

如有部署问题，请查看 GitHub Actions 日志或提交 Issue。