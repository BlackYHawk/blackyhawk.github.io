#!/usr/bin/env bash

# 确保脚本在出错时停止执行
set -e

echo "🚀 开始构建和部署..."

# 清理之前的构建文件
echo "🧹 清理构建缓存..."
rm -rf docs/.vitepress/dist
rm -rf docs/.vitepress/cache

# 类型检查
echo "🔍 执行类型检查..."
pnpm run type-check

# 构建项目
echo "📦 构建项目..."
pnpm run docs:build

# 进入构建输出目录
cd docs/.vitepress/dist

# 初始化 git 仓库
echo "📝 初始化 Git 仓库..."
git init
git add -A
git commit -m "deploy: $(date +'%Y-%m-%d %H:%M:%S')"

# 推送到 GitHub Pages
echo "🚀 部署到 GitHub Pages..."
git push -f https://github.com/BlackYHawk/blackyhawk.github.io.git master:gh-pages

# 返回项目根目录
cd -

# 清理构建文件
echo "🧹 清理构建文件..."
rm -rf docs/.vitepress/dist

echo "✅ 部署完成！"
echo "🌐 网站地址: https://blackyhawk.github.io"
