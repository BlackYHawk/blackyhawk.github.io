<template>
  <div class="futuristic-hero">
    <div class="hero-content">
      <div class="hero-title-wrapper">
        <h1 class="hero-title">
          <span class="title-line">AI智能体</span>
          <span class="title-line">未来指南</span>
        </h1>
        <div class="title-underline"></div>
      </div>
      
      <p class="hero-description">
        探索人工智能的无限可能，构建智能化的未来世界
      </p>
      
      <div class="hero-actions">
        <el-button 
          type="primary" 
          size="large" 
          class="hero-btn hero-btn-primary"
          @click="navigateTo('/guides/')"
        >
          <el-icon class="btn-icon"><ArrowRight /></el-icon>
          开始探索
        </el-button>
        
        <el-button 
          size="large" 
          class="hero-btn hero-btn-secondary"
          @click="navigateTo('/agents/')"
        >
          <el-icon class="btn-icon"><Robot /></el-icon>
          智能体库
        </el-button>
      </div>
      
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-number">50+</div>
          <div class="stat-label">智能体模板</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">1000+</div>
          <div class="stat-label">用户使用</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">技术支持</div>
        </div>
      </div>
    </div>
    
    <div class="hero-visual">
      <div class="visual-container">
        <div class="floating-elements">
          <div class="floating-element element-1"></div>
          <div class="floating-element element-2"></div>
          <div class="floating-element element-3"></div>
          <div class="floating-element element-4"></div>
        </div>
        <div class="central-orb">
          <div class="orb-core"></div>
          <div class="orb-ring ring-1"></div>
          <div class="orb-ring ring-2"></div>
          <div class="orb-ring ring-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

import { h } from 'vue'
import { useRouter } from 'vitepress'

// 创建一个简单的 Robot 图标组件
const Robot = {
  name: 'Robot',
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 8.5c0-.83-.67-1.5-1.5-1.5S15 9.67 15 10.5s.67 1.5 1.5 1.5S18 11.33 18 10.5zM7.5 9C6.67 9 6 9.67 6 10.5S6.67 12 7.5 12 9 11.33 9 10.5 8.33 9 7.5 9zm12.5 3.5h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H8c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h1v1c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1h1c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1z'
      })
    ])
  }
}

const router = useRouter()

const navigateTo = (path: string) => {
  router.go(path)
}
</script>

<style lang="scss" scoped>
.futuristic-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80vh;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
  
  // 响应式布局优化
  @media (max-width: 1024px) {
    min-height: 70vh;
    padding: 1.5rem 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    min-height: 60vh;
    padding: 1rem 0;
  }
  
  @media (max-width: 480px) {
    min-height: 50vh;
    padding: 0.5rem 0;
  }
  
  // 横屏手机优化
  @media (max-height: 500px) and (orientation: landscape) {
    min-height: 90vh;
    flex-direction: row;
    
    .hero-content {
      margin-bottom: 0;
    }
  }
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
  
  @media (max-width: 1024px) {
    max-width: 500px;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }
}

.hero-title-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  // 确保在不支持background-clip的浏览器中有回退
  color: var(--vp-c-brand-1);
  
  @supports (-webkit-background-clip: text) {
    color: transparent;
  }
  
  @media (max-width: 1024px) {
    font-size: clamp(1.8rem, 7vw, 3.5rem);
  }
  
  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.3rem, 5vw, 2rem);
    line-height: 1.2;
  }
  
  .title-line {
    display: block;
    animation: slideInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    // 减少动画偏好时的处理
    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
}

.title-underline {
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  margin-top: 1rem;
  animation: expandWidth 1s ease-out 0.5s forwards;
  width: 0;
}

.hero-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--vp-c-text-2);
  margin-bottom: 3rem;
  line-height: 1.6;
  animation: fadeInUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
  transform: translateY(20px);
  
  @media (max-width: 1024px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  // 减少动画偏好时的处理
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out 0.6s forwards;
  opacity: 0;
  transform: translateY(20px);
  flex-wrap: wrap;
  
  @media (max-width: 1024px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    gap: 0.5rem;
  }
  
  // 减少动画偏好时的处理
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

.hero-btn {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  padding: clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px);
  font-weight: 600;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;
  min-width: 120px;
  
  .btn-icon {
    margin-right: 8px;
    font-size: 1.1em;
  }
  
  &.hero-btn-primary {
    background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
    border: none;
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.hero-btn-secondary {
    background: transparent;
    border: 2px solid var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    
    &:hover:not(:disabled) {
      background: var(--vp-c-brand-1);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  // 触摸设备优化
  @media (hover: none) {
    &:hover {
      transform: none !important;
      box-shadow: none !important;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  // 小屏设备按钮优化
  @media (max-width: 768px) {
    width: 100%;
    max-width: 280px;
    padding: 14px 24px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    max-width: 240px;
    padding: 12px 20px;
    font-size: 0.9rem;
  }
  
  // 减少动画偏好时的处理
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none !important;
    }
  }
  
  // 高对比度模式
  @media (prefers-contrast: high) {
    &.hero-btn-primary {
      background: var(--vp-c-brand-1);
      border: 2px solid var(--vp-c-brand-1);
    }
    
    &.hero-btn-secondary {
      border-width: 3px;
    }
  }
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  animation: fadeInUp 0.8s ease-out 0.8s forwards;
  opacity: 0;
  transform: translateY(20px);
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.stat-item {
  text-align: center;
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--vp-c-brand-1);
    line-height: 1;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin-top: 0.25rem;
  }
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--vp-c-divider);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
}

.visual-container {
  position: relative;
  width: 400px;
  height: 400px;
  
  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.6;
  
  &.element-1 {
    width: 20px;
    height: 20px;
    top: 20%;
    left: 10%;
    animation: float 3s ease-in-out infinite;
  }
  
  &.element-2 {
    width: 15px;
    height: 15px;
    top: 60%;
    right: 15%;
    animation: float 3s ease-in-out infinite 1s;
  }
  
  &.element-3 {
    width: 25px;
    height: 25px;
    bottom: 20%;
    left: 20%;
    animation: float 3s ease-in-out infinite 2s;
  }
  
  &.element-4 {
    width: 18px;
    height: 18px;
    top: 30%;
    right: 30%;
    animation: float 3s ease-in-out infinite 0.5s;
  }
}

.central-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
}

.orb-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 50%;
  box-shadow: 0 0 30px var(--vp-c-brand-1);
  animation: pulse 2s ease-in-out infinite;
}

.orb-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.3;
  
  &.ring-1 {
    width: 80px;
    height: 80px;
    animation: rotate 10s linear infinite;
  }
  
  &.ring-2 {
    width: 100px;
    height: 100px;
    animation: rotate 15s linear infinite reverse;
  }
  
  &.ring-3 {
    width: 120px;
    height: 120px;
    animation: rotate 20s linear infinite;
  }
}

// 动画定义
@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes expandWidth {
  to {
    width: 200px;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>