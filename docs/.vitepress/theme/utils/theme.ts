/**
 * 科技感主题工具函数
 */

// 主题颜色配置
export const TECH_COLORS = {
    primary: '#00d4ff',
    primaryDark: '#0099cc',
    primaryLight: '#33ddff',
    primaryLighter: '#66e6ff',
    primaryDarker: '#006699',

    secondary: '#6c5ce7',
    secondaryDark: '#5a4fcf',
    secondaryLight: '#8b7ed8',
    secondaryLighter: '#a599e9',
    secondaryDarker: '#4834d4',

    accent: '#00ffcc',
    accentDark: '#00cc99',
    accentLight: '#33ffdd',

    success: '#00ff88',
    warning: '#ffaa00',
    danger: '#ff4444',
    info: '#cccccc',

    bgPrimary: '#0a0a0a',
    bgSecondary: '#1a1a1a',
    bgTertiary: '#2a2a2a',
    bgQuaternary: '#3a3a3a',

    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    textMuted: '#888888',
    textDisabled: '#555555',

    border: '#333333',
    borderLight: '#444444',
} as const

// 渐变配置
export const TECH_GRADIENTS = {
    primary: 'linear-gradient(135deg, #00d4ff, #6c5ce7)',
    secondary: 'linear-gradient(135deg, #6c5ce7, #00ffcc)',
    accent: 'linear-gradient(135deg, #00ffcc, #00d4ff)',
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    surface: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    text: 'linear-gradient(135deg, #00d4ff, #00ffcc)',
    neon: 'linear-gradient(90deg, #00d4ff, #00ffcc, #6c5ce7)',
    hologram: `linear-gradient(45deg, 
    transparent 25%, 
    rgba(0, 212, 255, 0.1) 25%, 
    rgba(0, 212, 255, 0.1) 50%, 
    transparent 50%, 
    transparent 75%, 
    rgba(0, 212, 255, 0.1) 75%
  )`,
} as const

// 阴影配置
export const TECH_SHADOWS = {
    light: '0 0 10px rgba(0, 212, 255, 0.1)',
    medium: '0 0 20px rgba(0, 212, 255, 0.2)',
    heavy: '0 0 30px rgba(0, 212, 255, 0.3)',
    glow: '0 0 20px #00d4ff',
    glowSoft: '0 0 10px rgba(0, 212, 255, 0.3)',
    glowMedium: '0 0 20px rgba(0, 212, 255, 0.5)',
    glowStrong: '0 0 30px rgba(0, 212, 255, 0.7)',
} as const

// 动画配置
export const TECH_ANIMATIONS = {
    duration: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.5s',
    },
    easing: {
        outCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
        inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
        outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
} as const

/**
 * 获取科技感颜色值
 */
export function getTechColor(colorName: keyof typeof TECH_COLORS): string {
    return TECH_COLORS[colorName]
}

/**
 * 获取科技感渐变
 */
export function getTechGradient(gradientName: keyof typeof TECH_GRADIENTS): string {
    return TECH_GRADIENTS[gradientName]
}

/**
 * 获取科技感阴影
 */
export function getTechShadow(shadowName: keyof typeof TECH_SHADOWS): string {
    return TECH_SHADOWS[shadowName]
}

/**
 * 创建带透明度的颜色
 */
export function withOpacity(color: string, opacity: number): string {
    // 如果是十六进制颜色
    if (color.startsWith('#')) {
        const hex = color.slice(1)
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    // 如果已经是 rgba 格式，替换透明度
    if (color.startsWith('rgba')) {
        return color.replace(/[\d.]+\)$/g, `${opacity})`)
    }

    // 如果是 rgb 格式，转换为 rgba
    if (color.startsWith('rgb')) {
        return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
    }

    return color
}

/**
 * 创建科技感发光效果
 */
export function createGlowEffect(color: string, intensity: 'soft' | 'medium' | 'strong' = 'medium'): string {
    const intensityMap = {
        soft: 0.3,
        medium: 0.5,
        strong: 0.7,
    }

    const opacity = intensityMap[intensity]
    const blur1 = intensity === 'soft' ? 10 : intensity === 'medium' ? 20 : 30
    const blur2 = blur1 * 1.5

    return `0 0 ${blur1}px ${withOpacity(color, opacity)}, 0 0 ${blur2}px ${withOpacity(color, opacity * 0.5)}`
}

/**
 * 创建科技感边框
 */
export function createTechBorder(color: string = TECH_COLORS.primary, width: number = 1): string {
    return `${width}px solid ${color}`
}

/**
 * 创建科技感背景
 */
export function createTechBackground(
    baseColor: string = TECH_COLORS.bgSecondary,
    accentColor: string = TECH_COLORS.primary,
    opacity: number = 0.05
): string {
    return `
    background: ${baseColor};
    background-image: 
      radial-gradient(circle at 25% 25%, ${withOpacity(accentColor, opacity)} 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${withOpacity(TECH_COLORS.secondary, opacity)} 0%, transparent 50%);
  `
}

/**
 * 检测用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 检测用户是否偏好高对比度
 */
export function prefersHighContrast(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * 应用科技感主题到元素
 */
export function applyTechTheme(element: HTMLElement, options: {
    glow?: boolean
    gradient?: keyof typeof TECH_GRADIENTS
    shadow?: keyof typeof TECH_SHADOWS
    border?: boolean
    animation?: boolean
} = {}): void {
    const { glow, gradient, shadow, border, animation } = options

    if (glow) {
        element.style.boxShadow = getTechShadow('glowMedium')
    }

    if (gradient) {
        element.style.background = getTechGradient(gradient)
    }

    if (shadow) {
        element.style.boxShadow = getTechShadow(shadow)
    }

    if (border) {
        element.style.border = createTechBorder()
    }

    if (animation && !prefersReducedMotion()) {
        element.style.transition = `all ${TECH_ANIMATIONS.duration.normal} ${TECH_ANIMATIONS.easing.outCubic}`
    }
}

/**
 * 创建科技感粒子背景配置
 */
export function createParticleConfig() {
    return {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800,
                },
            },
            color: {
                value: TECH_COLORS.primary,
            },
            shape: {
                type: 'circle',
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                },
            },
            size: {
                value: 2,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.5,
                    sync: false,
                },
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: TECH_COLORS.primary,
                opacity: 0.2,
                width: 1,
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
            },
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse',
                },
                onclick: {
                    enable: true,
                    mode: 'push',
                },
                resize: true,
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1,
                    },
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
                push: {
                    particles_nb: 4,
                },
                remove: {
                    particles_nb: 2,
                },
            },
        },
        retina_detect: true,
    }
}

/**
 * 导出所有主题相关的常量和函数
 */
export default {
    colors: TECH_COLORS,
    gradients: TECH_GRADIENTS,
    shadows: TECH_SHADOWS,
    animations: TECH_ANIMATIONS,
    getTechColor,
    getTechGradient,
    getTechShadow,
    withOpacity,
    createGlowEffect,
    createTechBorder,
    createTechBackground,
    prefersReducedMotion,
    prefersHighContrast,
    applyTechTheme,
    createParticleConfig,
}