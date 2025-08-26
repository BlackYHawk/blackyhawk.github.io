# AI智能体指南网站

基于 VitePress 构建的具有科技感和未来感的 AI 智能体知识网站，集成了 Element Plus UI 组件库。

## 功能特性

- 🚀 基于 VitePress 的静态站点生成
- 🎨 Element Plus UI 组件库集成
- 💫 科技感深色主题设计
- 📱 响应式布局设计
- 🔍 内置搜索功能
- 🌐 支持 GitHub Pages 部署
- 📝 Markdown 内容管理
- 🎯 TypeScript 支持

## 技术栈

- **VitePress**: 静态站点生成器
- **Element Plus**: Vue 3 UI 组件库
- **Vue 3**: 前端框架
- **TypeScript**: 类型安全支持
- **SCSS**: CSS 预处理器
- **GitHub Actions**: 自动化部署

## 开发环境设置

### 前置要求

- Node.js 18+ 
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发服务器

```bash
pnpm run docs:dev
```

### 构建生产版本

```bash
pnpm run docs:build
```

### 预览构建结果

```bash
pnpm run docs:preview
```

### 类型检查

```bash
pnpm run type-check
```

## GitHub Pages 部署

### 自动部署

1. 确保仓库设置中启用了 GitHub Pages
2. 在 `docs/.vitepress/config.mts` 中取消注释 `base` 配置并设置正确的仓库名
3. 推送代码到 `main` 分支，GitHub Actions 将自动构建和部署

### 手动部署

```bash
# 构建
pnpm run docs:build

# 部署到 GitHub Pages
# 可以使用 gh-pages 包或手动上传 docs/.vitepress/dist 目录
```

## 项目结构

```
├── docs/                          # 文档源文件
│   ├── .vitepress/               # VitePress 配置
│   │   ├── theme/                # 自定义主题
│   │   │   ├── styles/           # 样式文件
│   │   │   │   └── variables.scss # SCSS 变量
│   │   │   └── index.ts          # 主题入口
│   │   └── config.mts            # VitePress 配置
│   ├── agents/                   # AI智能体相关内容
│   ├── guides/                   # 使用指南
│   ├── examples/                 # 示例内容
│   └── index.md                  # 首页
├── .github/workflows/            # GitHub Actions 工作流
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目配置
```

## 配置说明

### VitePress 配置

主要配置文件位于 `docs/.vitepress/config.mts`，包含：

- 站点基本信息
- 导航和侧边栏配置
- 主题定制
- 构建优化
- GitHub Pages 支持

### Element Plus 集成

Element Plus 已在主题中全局注册，可以在任何 Vue 组件或 Markdown 文件中直接使用。

### 样式定制

样式变量定义在 `docs/.vitepress/theme/styles/variables.scss` 中，包含：

- 科技感配色方案
- 深色主题变量
- 动画时长设置
- 响应式断点

## 内容管理

### 添加新页面

1. 在相应目录下创建 `.md` 文件
2. 添加 frontmatter 元数据
3. 更新导航配置（如需要）

### 使用 Vue 组件

可以在 Markdown 文件中直接使用 Vue 组件和 Element Plus 组件：

```markdown
# 示例页面

<el-button type="primary">点击按钮</el-button>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License