import { defineConfig } from 'vitepress'

// GitHub Pages base path configuration
// 由于这是 blackyhawk.github.io 仓库，部署到根域名，不需要 base 路径
const base = '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: base, // GitHub Pages 部署配置
  title: "AI智能体指南",
  description: "未来科技感的AI智能体知识网站",
  lang: 'zh-CN',

  // 静态站点生成配置
  cleanUrls: true,
  lastUpdated: true,
  
  // 站点地图配置
  sitemap: {
    hostname: 'https://blackyhawk.github.io'
  },
  
  // 生产环境优化
  ignoreDeadLinks: false,
  
  // 元数据配置
  metaChunk: true,

  // Vite配置
  vite: {
    ssr: {
      noExternal: ['element-plus', '@element-plus/icons-vue']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./docs/.vitepress/theme/styles/variables.scss";`
        }
      }
    },
    optimizeDeps: {
      include: ['element-plus', '@element-plus/icons-vue']
    },
    build: {
      // 性能优化配置
      rollupOptions: {
        output: {
          // 代码分割优化
          manualChunks: {
            'element-plus': ['element-plus'],
            'element-icons': ['@element-plus/icons-vue']
          }
        }
      },
      // 生产环境启用压缩
      minify: 'terser',
      // 资源内联阈值
      assetsInlineLimit: 4096,
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 静态资源处理
      assetsDir: 'assets',
      // 输出目录清理
      emptyOutDir: true
    },
    // 开发服务器优化
    server: {
      hmr: {
        overlay: false // 减少开发时的干扰
      }
    }
  },

  // 头部配置
  head: [
    // 基础meta标签
    ['meta', { name: 'theme-color', content: '#00d4ff' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    
    // 性能优化
    ['meta', { name: 'dns-prefetch', content: '//fonts.googleapis.com' }],
    ['meta', { name: 'preconnect', content: 'https://fonts.gstatic.com', crossorigin: '' }],
    
    // PWA支持
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'AI智能体指南' }],
    
    // 图标配置
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#00d4ff' }],
    
    // 字体预加载
    ['link', { rel: 'preload', href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    
    // 性能监控脚本
    ['script', {}, `
      // 性能监控
      if ('performance' in window) {
        window.addEventListener('load', function() {
          setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && perfData.loadEventEnd > 0) {
              const loadTime = perfData.loadEventEnd - perfData.navigationStart;
              console.log('Page load time:', loadTime + 'ms');
              
              // 发送性能数据到分析服务
              if (window.gtag) {
                gtag('event', 'timing_complete', {
                  name: 'load',
                  value: Math.round(loadTime)
                });
              }
            }
          }, 0);
        });
      }
      
      // 检测设备性能
      const isLowEnd = navigator.hardwareConcurrency < 4 || 
                      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
                      /Android.*(SM-|GT-|SGH-|SPH-|SCH-)/i.test(navigator.userAgent);
      
      if (isLowEnd) {
        document.documentElement.classList.add('low-end-device');
      }
      
      // 检测网络状态
      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          document.documentElement.classList.add('slow-connection');
        }
      }
    `]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { 
        text: 'AI智能体', 
        link: '/agents/',
        activeMatch: '/agents/'
      },
      { 
        text: '使用指南', 
        link: '/guides/',
        activeMatch: '/guides/'
      },
      { 
        text: '示例代码', 
        link: '/examples/',
        activeMatch: '/examples/'
      },
      {
        text: '资源',
        items: [
          { text: 'API参考', link: '/api-reference' },
          { text: '常见问题', link: '/faq' },
          { text: '更新日志', link: '/changelog' }
        ]
      }
    ],

    sidebar: {
      '/agents/': [
        {
          text: '🤖 AI智能体基础',
          collapsed: false,
          items: [
            { text: '智能体概述', link: '/agents/' },
            { text: '核心概念', link: '/agents/concepts' },
            { text: '架构设计', link: '/agents/architecture' }
          ]
        },
        {
          text: '🚀 快速开始',
          collapsed: false,
          items: [
            { text: '创建智能体', link: '/agents/create' },
            { text: '配置管理', link: '/agents/config' },
            { text: '部署上线', link: '/agents/deploy' }
          ]
        },
        {
          text: '🔧 高级功能',
          collapsed: true,
          items: [
            { text: '工具集成', link: '/agents/tools' },
            { text: '记忆系统', link: '/agents/memory' },
            { text: '多模态支持', link: '/agents/multimodal' },
            { text: '安全防护', link: '/agents/security' }
          ]
        },
        {
          text: '📊 监控运维',
          collapsed: true,
          items: [
            { text: '性能监控', link: '/agents/monitoring' },
            { text: '日志分析', link: '/agents/logging' },
            { text: '故障排除', link: '/agents/troubleshooting' }
          ]
        }
      ],
      '/guides/': [
        {
          text: '📚 入门指南',
          collapsed: false,
          items: [
            { text: '快速开始', link: '/guides/' },
            { text: '环境搭建', link: '/guides/setup' },
            { text: '第一个项目', link: '/guides/first-project' }
          ]
        },
        {
          text: '🎯 进阶教程',
          collapsed: false,
          items: [
            { text: '高级配置', link: '/guides/advanced' },
            { text: '工具开发', link: '/guides/tool-development' },
            { text: '插件系统', link: '/guides/plugins' }
          ]
        },
        {
          text: '💡 最佳实践',
          collapsed: false,
          items: [
            { text: '开发规范', link: '/guides/best-practices' },
            { text: '性能优化', link: '/guides/performance' },
            { text: '安全实践', link: '/guides/security-practices' }
          ]
        },
        {
          text: '🔍 深入理解',
          collapsed: true,
          items: [
            { text: '提示词工程', link: '/guides/prompt-engineering' },
            { text: '模型选择', link: '/guides/model-selection' },
            { text: '成本优化', link: '/guides/cost-optimization' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '🎨 基础示例',
          collapsed: false,
          items: [
            { text: '示例总览', link: '/examples/' },
            { text: '简单对话', link: '/examples/basic-chat' },
            { text: '带记忆对话', link: '/examples/memory-chat' }
          ]
        },
        {
          text: '🛠️ 工具集成',
          collapsed: false,
          items: [
            { text: '网络搜索', link: '/examples/web-search' },
            { text: '代码执行', link: '/examples/code-execution' },
            { text: '文件处理', link: '/examples/file-processing' }
          ]
        },
        {
          text: '🏢 企业应用',
          collapsed: false,
          items: [
            { text: '客服机器人', link: '/examples/customer-service' },
            { text: '内容创作', link: '/examples/content-creation' },
            { text: '数据分析', link: '/examples/data-analysis' }
          ]
        },
        {
          text: '🚀 高级案例',
          collapsed: true,
          items: [
            { text: '多智能体协作', link: '/examples/multi-agent' },
            { text: '自适应学习', link: '/examples/adaptive-learning' },
            { text: '实时聊天', link: '/examples/realtime-chat' }
          ]
        },
        {
          text: '📱 部署示例',
          collapsed: true,
          items: [
            { text: 'Web API', link: '/examples/web-api' },
            { text: 'WebSocket', link: '/examples/websocket' },
            { text: '微信小程序', link: '/examples/wechat-miniprogram' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/BlackYHawk' }
    ],

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 页脚配置
    footer: {
      message: '基于 VitePress 构建的AI智能体知识网站',
      copyright: 'Copyright © 2025 AI智能体指南'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-username/your-repo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 文档页脚导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式切换标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
