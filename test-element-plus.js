#!/usr/bin/env node

/**
 * Element Plus 集成测试脚本
 * 测试 Element Plus 组件是否正确集成到 VitePress 主题中
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 开始测试 Element Plus 集成...\n');

// 测试结果收集器
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

function addTest(name, status, message, details = null) {
    testResults.tests.push({ name, status, message, details });
    testResults[status]++;
    
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

// 1. 检查 package.json 中的 Element Plus 依赖
function testPackageDependencies() {
    console.log('\n📦 测试 1: 检查包依赖...');
    
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // 检查 Element Plus 核心包
        if (packageJson.dependencies && packageJson.dependencies['element-plus']) {
            addTest(
                'Element Plus 核心包',
                'passed',
                `已安装版本 ${packageJson.dependencies['element-plus']}`
            );
        } else {
            addTest(
                'Element Plus 核心包',
                'failed',
                '未找到 element-plus 依赖'
            );
        }
        
        // 检查 Element Plus 图标包
        if (packageJson.dependencies && packageJson.dependencies['@element-plus/icons-vue']) {
            addTest(
                'Element Plus 图标包',
                'passed',
                `已安装版本 ${packageJson.dependencies['@element-plus/icons-vue']}`
            );
        } else {
            addTest(
                'Element Plus 图标包',
                'failed',
                '未找到 @element-plus/icons-vue 依赖'
            );
        }
        
    } catch (error) {
        addTest(
            '包依赖检查',
            'failed',
            '无法读取 package.json',
            error.message
        );
    }
}

// 2. 检查主题配置文件
function testThemeConfiguration() {
    console.log('\n⚙️ 测试 2: 检查主题配置...');
    
    const themeIndexPath = 'docs/.vitepress/theme/index.ts';
    
    try {
        if (!fs.existsSync(themeIndexPath)) {
            addTest(
                '主题入口文件',
                'failed',
                '主题入口文件不存在'
            );
            return;
        }
        
        const themeContent = fs.readFileSync(themeIndexPath, 'utf8');
        
        // 检查 Element Plus 导入
        if (themeContent.includes("import ElementPlus from 'element-plus'")) {
            addTest(
                'Element Plus 导入',
                'passed',
                'Element Plus 正确导入'
            );
        } else {
            addTest(
                'Element Plus 导入',
                'failed',
                'Element Plus 未正确导入'
            );
        }
        
        // 检查 Element Plus CSS 导入
        if (themeContent.includes("import 'element-plus/dist/index.css'")) {
            addTest(
                'Element Plus CSS',
                'passed',
                'Element Plus CSS 正确导入'
            );
        } else {
            addTest(
                'Element Plus CSS',
                'warnings',
                'Element Plus CSS 可能未正确导入'
            );
        }
        
        // 检查图标导入
        if (themeContent.includes("import * as ElementPlusIconsVue from '@element-plus/icons-vue'")) {
            addTest(
                'Element Plus 图标导入',
                'passed',
                'Element Plus 图标正确导入'
            );
        } else {
            addTest(
                'Element Plus 图标导入',
                'failed',
                'Element Plus 图标未正确导入'
            );
        }
        
        // 检查 app.use(ElementPlus)
        if (themeContent.includes('app.use(ElementPlus)')) {
            addTest(
                'Element Plus 注册',
                'passed',
                'Element Plus 正确注册到 Vue 应用'
            );
        } else {
            addTest(
                'Element Plus 注册',
                'failed',
                'Element Plus 未正确注册到 Vue 应用'
            );
        }
        
    } catch (error) {
        addTest(
            '主题配置检查',
            'failed',
            '无法读取主题配置文件',
            error.message
        );
    }
}

// 3. 检查 VitePress 配置
function testVitePressConfiguration() {
    console.log('\n🔧 测试 3: 检查 VitePress 配置...');
    
    const configPath = 'docs/.vitepress/config.mts';
    
    try {
        if (!fs.existsSync(configPath)) {
            addTest(
                'VitePress 配置文件',
                'failed',
                'VitePress 配置文件不存在'
            );
            return;
        }
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        // 检查 SSR 配置
        if (configContent.includes("noExternal: ['element-plus'")) {
            addTest(
                'SSR 配置',
                'passed',
                'Element Plus SSR 配置正确'
            );
        } else {
            addTest(
                'SSR 配置',
                'warnings',
                'Element Plus SSR 配置可能缺失'
            );
        }
        
        // 检查优化配置
        if (configContent.includes("include: ['element-plus'")) {
            addTest(
                '依赖优化配置',
                'passed',
                'Element Plus 依赖优化配置正确'
            );
        } else {
            addTest(
                '依赖优化配置',
                'warnings',
                'Element Plus 依赖优化配置可能缺失'
            );
        }
        
    } catch (error) {
        addTest(
            'VitePress 配置检查',
            'failed',
            '无法读取 VitePress 配置文件',
            error.message
        );
    }
}

// 4. 检查自定义组件
function testCustomComponents() {
    console.log('\n🎨 测试 4: 检查自定义组件...');
    
    const componentsDir = 'docs/.vitepress/theme/components';
    
    try {
        if (!fs.existsSync(componentsDir)) {
            addTest(
                '组件目录',
                'warnings',
                '自定义组件目录不存在'
            );
            return;
        }
        
        const components = fs.readdirSync(componentsDir);
        const vueComponents = components.filter(file => file.endsWith('.vue'));
        
        addTest(
            '自定义组件数量',
            vueComponents.length > 0 ? 'passed' : 'warnings',
            `找到 ${vueComponents.length} 个 Vue 组件`
        );
        
        // 检查关键组件
        const keyComponents = [
            'FuturisticHero.vue',
            'AIAgentCard.vue',
            'TechBackground.vue',
            'ErrorBoundary.vue'
        ];
        
        keyComponents.forEach(component => {
            if (components.includes(component)) {
                addTest(
                    `组件: ${component}`,
                    'passed',
                    '组件文件存在'
                );
                
                // 检查组件内容是否使用了 Element Plus
                const componentPath = path.join(componentsDir, component);
                const componentContent = fs.readFileSync(componentPath, 'utf8');
                
                if (componentContent.includes('el-') || componentContent.includes('ElButton') || componentContent.includes('ElIcon')) {
                    addTest(
                        `${component} Element Plus 集成`,
                        'passed',
                        '组件正确使用 Element Plus'
                    );
                } else {
                    addTest(
                        `${component} Element Plus 集成`,
                        'warnings',
                        '组件可能未使用 Element Plus'
                    );
                }
            } else {
                addTest(
                    `组件: ${component}`,
                    'warnings',
                    '组件文件不存在'
                );
            }
        });
        
    } catch (error) {
        addTest(
            '自定义组件检查',
            'failed',
            '无法检查自定义组件',
            error.message
        );
    }
}

// 5. 检查样式文件
function testStyleFiles() {
    console.log('\n🎨 测试 5: 检查样式文件...');
    
    const stylesDir = 'docs/.vitepress/theme/styles';
    
    try {
        if (!fs.existsSync(stylesDir)) {
            addTest(
                '样式目录',
                'warnings',
                '样式目录不存在'
            );
            return;
        }
        
        const styleFiles = fs.readdirSync(stylesDir);
        const scssFiles = styleFiles.filter(file => file.endsWith('.scss'));
        
        addTest(
            'SCSS 样式文件',
            scssFiles.length > 0 ? 'passed' : 'warnings',
            `找到 ${scssFiles.length} 个 SCSS 文件`
        );
        
        // 检查主样式文件
        if (styleFiles.includes('index.scss')) {
            const indexScssPath = path.join(stylesDir, 'index.scss');
            const indexScssContent = fs.readFileSync(indexScssPath, 'utf8');
            
            // 检查是否有 Element Plus 相关的样式覆盖
            if (indexScssContent.includes('--el-') || indexScssContent.includes('.el-')) {
                addTest(
                    'Element Plus 样式定制',
                    'passed',
                    '发现 Element Plus 样式定制'
                );
            } else {
                addTest(
                    'Element Plus 样式定制',
                    'warnings',
                    '未发现 Element Plus 样式定制'
                );
            }
        }
        
    } catch (error) {
        addTest(
            '样式文件检查',
            'failed',
            '无法检查样式文件',
            error.message
        );
    }
}

// 6. 生成测试报告
function generateReport() {
    console.log('\n📊 测试报告');
    console.log('='.repeat(50));
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`⚠️  警告: ${testResults.warnings}`);
    console.log(`📝 总计: ${testResults.tests.length}`);
    
    const successRate = ((testResults.passed / testResults.tests.length) * 100).toFixed(1);
    console.log(`📈 成功率: ${successRate}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ 失败的测试:');
        testResults.tests
            .filter(test => test.status === 'failed')
            .forEach(test => {
                console.log(`   • ${test.name}: ${test.message}`);
                if (test.details) {
                    console.log(`     详情: ${test.details}`);
                }
            });
    }
    
    if (testResults.warnings > 0) {
        console.log('\n⚠️ 警告的测试:');
        testResults.tests
            .filter(test => test.status === 'warnings')
            .forEach(test => {
                console.log(`   • ${test.name}: ${test.message}`);
            });
    }
    
    // 生成 JSON 报告
    const reportPath = 'element-plus-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
            passed: testResults.passed,
            failed: testResults.failed,
            warnings: testResults.warnings,
            total: testResults.tests.length,
            successRate: parseFloat(successRate)
        },
        tests: testResults.tests
    }, null, 2));
    
    console.log(`\n📄 详细报告已保存到: ${reportPath}`);
}

// 运行所有测试
async function runAllTests() {
    testPackageDependencies();
    testThemeConfiguration();
    testVitePressConfiguration();
    testCustomComponents();
    testStyleFiles();
    generateReport();
    
    // 根据测试结果设置退出码
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// 执行测试
runAllTests().catch(error => {
    console.error('❌ 测试执行失败:', error);
    process.exit(1);
});