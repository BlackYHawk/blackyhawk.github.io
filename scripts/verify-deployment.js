#!/usr/bin/env node

/**
 * 部署验证脚本
 * 检查构建输出是否包含所有必要的文件
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../docs/.vitepress/dist');
const REQUIRED_FILES = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  '.nojekyll',
  'hashmap.json'
];

const REQUIRED_DIRS = [
  'assets',
  'agents',
  'guides',
  'examples'
];

console.log('🔍 验证部署构建...');

// 检查构建目录是否存在
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ 构建目录不存在:', DIST_DIR);
  process.exit(1);
}

// 检查必需文件
let missingFiles = [];
for (const file of REQUIRED_FILES) {
  const filePath = path.join(DIST_DIR, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  } else {
    console.log('✅', file);
  }
}

// 检查必需目录
let missingDirs = [];
for (const dir of REQUIRED_DIRS) {
  const dirPath = path.join(DIST_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    missingDirs.push(dir);
  } else {
    console.log('✅', dir + '/');
  }
}

// 检查 sitemap.xml 内容
const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemapContent.includes('blackyhawk.github.io')) {
    console.log('✅ sitemap.xml 包含正确的域名');
  } else {
    console.warn('⚠️  sitemap.xml 可能不包含正确的域名');
  }
}

// 检查 robots.txt 内容
const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes('blackyhawk.github.io')) {
    console.log('✅ robots.txt 包含正确的站点地图链接');
  } else {
    console.warn('⚠️  robots.txt 可能不包含正确的站点地图链接');
  }
}

// 报告结果
if (missingFiles.length > 0) {
  console.error('❌ 缺少必需文件:', missingFiles.join(', '));
}

if (missingDirs.length > 0) {
  console.error('❌ 缺少必需目录:', missingDirs.join(', '));
}

if (missingFiles.length === 0 && missingDirs.length === 0) {
  console.log('\n🎉 部署验证通过！所有必需文件和目录都存在。');
  console.log('🌐 准备部署到: https://blackyhawk.github.io');
} else {
  console.error('\n❌ 部署验证失败！请检查构建过程。');
  process.exit(1);
}