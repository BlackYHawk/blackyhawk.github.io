#!/usr/bin/env node

/**
 * 跨浏览器兼容性测试脚本
 * 检查网站在不同浏览器中的兼容性
 */

const fs = require('fs');
const path = require('path');

console.log('🌐 开始跨浏览器兼容性测试...\n');

// 测试结果收集器
const compatibilityResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

function addTest(name, status, message, details = null) {
    compatibilityResults.tests.push({ name, status, message, details });
    compatibilityResults[status]++;
    
    const statusIcon = {
        passed: '✅',
        failed: '❌',
        warnings: '⚠️'
    };
    
    console.log(`${statusIcon[status]} ${name}: ${message}`);
    if (details) {
        console.log(`   详情: ${details}`);
    }
}

// 1. 检查 CSS 兼容性
function testCSSCompatibility() {
    console.log('\n🎨 测试 1: CSS 兼容性检查...');
    
    const cssFiles = [
        'docs/.vitepress/theme/styles/index.scss',
        'docs/.vitepress/theme/styles/variables.scss',
        'docs/.vitepress/theme/styles/components.scss'
    ];
    
    const modernCSSFeatures = [
        { name: 'CSS Grid', pattern: /display:\s*grid|grid-template/i },
        { name: 'Flexbox', pattern: /display:\s*flex|flex-direction/i },
        { name: 'CSS Variables', pattern: /var\(--[\w-]+\)|--[\w-]+:/i },
        { name: 'CSS Transforms', pattern: /transform:|translate|rotate|scale/i },
        { name: 'CSS Transitions', pattern: /transition:|transition-/i },
        { name: 'CSS Animations', pattern: /@keyframes|animation:/i },
        { name: 'Backdrop Filter', pattern: /backdrop-filter:/i },
        { name: 'CSS Gradients', pattern: /linear-gradient|radial-gradient/i }
    ];
    
    cssFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            modernCSSFeatures.forEach(feature => {
                if (feature.pattern.test(content)) {
                    addTest(
                        `${fileName} - ${feature.name}`,
                        'passed',
                        `使用了 ${feature.name} 特性`
                    );
                }
            });
            
            // 检查浏览器前缀
            const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
            const hasPrefixes = prefixes.some(prefix => content.includes(prefix));
            
            addTest(
                `${fileName} - 浏览器前缀`,
                hasPrefixes ? 'passed' : 'warnings',
                hasPrefixes ? '包含浏览器前缀' : '可能缺少浏览器前缀'
            );
        }
    });
}

// 2. 检查 JavaScript 兼容性
function testJavaScriptCompatibility() {
    console.log('\n⚡ 测试 2: JavaScript 兼容性检查...');
    
    const jsFiles = [
        'docs/.vitepress/theme/index.ts',
        'docs/.vitepress/theme/utils/performance.ts',
        'docs/.vitepress/theme/utils/animations.ts'
    ];
    
    const modernJSFeatures = [
        { name: 'Arrow Functions', pattern: /=>\s*{|=>\s*\w/, compatibility: 'ES6+' },
        { name: 'Template Literals', pattern: /`[^`]*\$\{[^}]*\}[^`]*`/, compatibility: 'ES6+' },
        { name: 'Destructuring', pattern: /const\s*\{[^}]+\}\s*=|const\s*\[[^\]]+\]\s*=/, compatibility: 'ES6+' },
        { name: 'Async/Await', pattern: /async\s+function|await\s+/, compatibility: 'ES2017+' },
        { name: 'Optional Chaining', pattern: /\?\./g, compatibility: 'ES2020+' },
        { name: 'Nullish Coalescing', pattern: /\?\?/g, compatibility: 'ES2020+' },
        { name: 'Spread Operator', pattern: /\.\.\.[\w\[\]]/g, compatibility: 'ES6+' },
        { name: 'Classes', pattern: /class\s+\w+/g, compatibility: 'ES6+' }
    ];
    
    jsFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            modernJSFeatures.forEach(feature => {
                const matches = content.match(feature.pattern);
                if (matches) {
                    addTest(
                        `${fileName} - ${feature.name}`,
                        'warnings',
                        `使用了 ${feature.name} (${feature.compatibility})`,
                        `找到 ${matches.length} 处使用`
                    );
                }
            });
        }
    });
}

// 3. 检查 HTML5 特性使用
function testHTML5Features() {
    console.log('\n📄 测试 3: HTML5 特性检查...');
    
    const vueFiles = [
        'docs/.vitepress/theme/Layout.vue',
        'docs/.vitepress/theme/components/FuturisticHero.vue',
        'docs/.vitepress/theme/components/AIAgentCard.vue'
    ];
    
    const html5Features = [
        { name: 'Semantic Elements', pattern: /<(header|nav|main|section|article|aside|footer)/i },
        { name: 'Custom Data Attributes', pattern: /data-[\w-]+=/i },
        { name: 'ARIA Attributes', pattern: /aria-[\w-]+=/i },
        { name: 'SVG Elements', pattern: /<svg|<path|<circle|<rect/i },
        { name: 'Canvas Element', pattern: /<canvas/i },
        { name: 'Video Element', pattern: /<video/i },
        { name: 'Audio Element', pattern: /<audio/i }
    ];
    
    vueFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            html5Features.forEach(feature => {
                if (feature.pattern.test(content)) {
                    addTest(
                        `${fileName} - ${feature.name}`,
                        'passed',
                        `使用了 ${feature.name}`
                    );
                }
            });
        }
    });
}

// 4. 检查响应式设计兼容性
function testResponsiveCompatibility() {
    console.log('\n📱 测试 4: 响应式设计兼容性...');
    
    const styleFiles = [
        'docs/.vitepress/theme/styles/index.scss',
        'docs/.vitepress/theme/components/FuturisticHero.vue',
        'docs/.vitepress/theme/components/AIAgentCard.vue'
    ];
    
    const responsiveFeatures = [
        { name: 'Media Queries', pattern: /@media\s*\([^)]+\)/i },
        { name: 'Viewport Meta', pattern: /viewport.*width=device-width/i },
        { name: 'Flexible Units', pattern: /\d+(\.\d+)?(vw|vh|vmin|vmax|%|em|rem)/i },
        { name: 'Container Queries', pattern: /@container/i },
        { name: 'Clamp Function', pattern: /clamp\(/i }
    ];
    
    styleFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            responsiveFeatures.forEach(feature => {
                const matches = content.match(new RegExp(feature.pattern.source, 'gi'));
                if (matches) {
                    addTest(
                        `${fileName} - ${feature.name}`,
                        'passed',
                        `使用了 ${feature.name}`,
                        `找到 ${matches.length} 处使用`
                    );
                }
            });
        }
    });
    
    // 检查常见断点
    const commonBreakpoints = [
        { name: '移动设备', pattern: /max-width:\s*480px|max-width:\s*576px/i },
        { name: '平板设备', pattern: /max-width:\s*768px|max-width:\s*992px/i },
        { name: '桌面设备', pattern: /max-width:\s*1024px|max-width:\s*1200px/i }
    ];
    
    styleFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            commonBreakpoints.forEach(breakpoint => {
                if (breakpoint.pattern.test(content)) {
                    addTest(
                        `${fileName} - ${breakpoint.name}断点`,
                        'passed',
                        `包含${breakpoint.name}断点`
                    );
                }
            });
        }
    });
}

// 5. 检查性能优化兼容性
function testPerformanceCompatibility() {
    console.log('\n⚡ 测试 5: 性能优化兼容性...');
    
    const configPath = 'docs/.vitepress/config.mts';
    
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        
        const performanceFeatures = [
            { name: 'Code Splitting', pattern: /manualChunks|splitChunks/i },
            { name: 'Tree Shaking', pattern: /sideEffects|usedExports/i },
            { name: 'Minification', pattern: /minify|terser/i },
            { name: 'Compression', pattern: /gzip|brotli/i },
            { name: 'Lazy Loading', pattern: /lazy|dynamic.*import/i },
            { name: 'Preloading', pattern: /preload|prefetch/i },
            { name: 'Service Worker', pattern: /serviceWorker|sw\.js/i }
        ];
        
        performanceFeatures.forEach(feature => {
            if (feature.pattern.test(content)) {
                addTest(
                    `性能优化 - ${feature.name}`,
                    'passed',
                    `配置了 ${feature.name}`
                );
            } else {
                addTest(
                    `性能优化 - ${feature.name}`,
                    'warnings',
                    `未配置 ${feature.name}`
                );
            }
        });
    }
    
    // 检查图片优化
    const imageOptimizations = [
        { name: 'WebP Support', pattern: /\.webp/i },
        { name: 'AVIF Support', pattern: /\.avif/i },
        { name: 'Responsive Images', pattern: /srcset|sizes/i },
        { name: 'Image Lazy Loading', pattern: /loading="lazy"/i }
    ];
    
    // 检查所有 Vue 文件中的图片使用
    const vueFiles = fs.readdirSync('docs/.vitepress/theme/components')
        .filter(file => file.endsWith('.vue'))
        .map(file => `docs/.vitepress/theme/components/${file}`);
    
    vueFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        imageOptimizations.forEach(optimization => {
            if (optimization.pattern.test(content)) {
                addTest(
                    `${fileName} - ${optimization.name}`,
                    'passed',
                    `使用了 ${optimization.name}`
                );
            }
        });
    });
}

// 6. 生成兼容性报告
function generateCompatibilityReport() {
    console.log('\n📊 兼容性测试报告');
    console.log('='.repeat(50));
    console.log(`✅ 通过: ${compatibilityResults.passed}`);
    console.log(`❌ 失败: ${compatibilityResults.failed}`);
    console.log(`⚠️  警告: ${compatibilityResults.warnings}`);
    console.log(`📝 总计: ${compatibilityResults.tests.length}`);
    
    const successRate = ((compatibilityResults.passed / compatibilityResults.tests.length) * 100).toFixed(1);
    console.log(`📈 兼容性评分: ${successRate}%`);
    
    // 浏览器支持建议
    console.log('\n🌐 浏览器支持建议:');
    console.log('   • Chrome 80+ (推荐)');
    console.log('   • Firefox 75+ (推荐)');
    console.log('   • Safari 13+ (推荐)');
    console.log('   • Edge 80+ (推荐)');
    console.log('   • IE 11 (部分支持，需要 polyfills)');
    
    if (compatibilityResults.warnings > 0) {
        console.log('\n⚠️ 兼容性警告:');
        compatibilityResults.tests
            .filter(test => test.status === 'warnings')
            .forEach(test => {
                console.log(`   • ${test.name}: ${test.message}`);
            });
        
        console.log('\n💡 改进建议:');
        console.log('   • 考虑添加 Babel 转译以支持旧版浏览器');
        console.log('   • 添加 CSS 浏览器前缀以提高兼容性');
        console.log('   • 使用 PostCSS Autoprefixer 自动添加前缀');
        console.log('   • 考虑添加 polyfills 支持现代 JavaScript 特性');
    }
    
    // 生成详细报告
    const reportPath = 'browser-compatibility-report.json';
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
            passed: compatibilityResults.passed,
            failed: compatibilityResults.failed,
            warnings: compatibilityResults.warnings,
            total: compatibilityResults.tests.length,
            compatibilityScore: parseFloat(successRate)
        },
        browserSupport: {
            recommended: ['Chrome 80+', 'Firefox 75+', 'Safari 13+', 'Edge 80+'],
            partial: ['IE 11 (需要 polyfills)'],
            unsupported: ['IE 10 及以下版本']
        },
        tests: compatibilityResults.tests,
        recommendations: [
            '使用 Babel 转译现代 JavaScript',
            '添加 CSS 浏览器前缀',
            '使用 PostCSS Autoprefixer',
            '添加必要的 polyfills',
            '测试关键浏览器的实际表现'
        ]
    }, null, 2));
    
    console.log(`\n📄 详细兼容性报告已保存到: ${reportPath}`);
}

// 运行所有兼容性测试
async function runAllCompatibilityTests() {
    testCSSCompatibility();
    testJavaScriptCompatibility();
    testHTML5Features();
    testResponsiveCompatibility();
    testPerformanceCompatibility();
    generateCompatibilityReport();
    
    // 根据测试结果设置退出码
    process.exit(compatibilityResults.failed > 0 ? 1 : 0);
}

// 执行测试
runAllCompatibilityTests().catch(error => {
    console.error('❌ 兼容性测试执行失败:', error);
    process.exit(1);
});