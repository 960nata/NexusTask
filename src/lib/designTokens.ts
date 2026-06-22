/**
 * Design System - Tokens
 * Core design tokens extracted from the dashboard design system
 */

export const designTokens = {
  // ===== COLORS =====
  colors: {
    // Primary
    primary: {
      lime: '#AAFF00',
      lime_hover: '#C8FF40',
      lime_dark: '#1A2E00',
    },
    
    // Background
    background: {
      base: '#0E0E0E',
      elevated: '#111111',
      card: '#191919',
      card_hover: '#1E1E1E',
    },
    
    // Surface & Borders
    surface: {
      50: '#1A1A1A',
      100: '#222222',
      150: '#242424',
      200: '#2A2A2A',
    },
    
    // Text/Foreground
    text: {
      primary: '#FFFFFF',
      secondary: '#999999',
      tertiary: '#666666',
      muted: '#444444',
    },
    
    // Accent Colors
    accent: {
      blue: '#4A90FF',
      blue_light: '#7AB8FF',
      blue_dark: '#0a1a3a',
      red: '#FF6B6B',
      red_dark: '#3a1a1a',
      orange: '#FFB84A',
      orange_dark: '#2e220a',
      purple: '#B44AFF',
      purple_dark: '#1a0a2e',
      green: '#56cc6a',
      green_dark: '#1a3a2a',
    },
    
    // Semantic
    semantic: {
      success: '#AAFF00',
      warning: '#FFB84A',
      error: '#FF6B6B',
      info: '#4A90FF',
    },
    
    // Status Badge Colors
    status: {
      design: { bg: '#0a1a3a', text: '#4A90FF' },
      dev: { bg: '#1A2E00', text: '#AAFF00' },
      research: { bg: '#1a0a2e', text: '#B44AFF' },
      content: { bg: '#1a0a2e', text: '#B44AFF' },
      qa: { bg: '#0a1a3a', text: '#4A90FF' },
    },
  },

  // ===== TYPOGRAPHY =====
  typography: {
    family: {
      primary: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    
    fontSize: {
      xs: '10px',
      sm: '11px',
      base: '12px',
      md: '12.5px',
      lg: '13px',
      xl: '14px',
      '2xl': '20px',
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.45,
    },
    
    letterSpacing: {
      wide: '0.06em',
    },
  },

  // ===== SPACING =====
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    '2xl': '12px',
    '3xl': '14px',
    '4xl': '16px',
    '5xl': '18px',
    '6xl': '20px',
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '14px',
    '3xl': '16px',
    full: '50%',
  },

  // ===== SHADOWS =====
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 4px rgba(0, 0, 0, 0.4)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },

  // ===== COMPONENT SIZES =====
  components: {
    icon: {
      xs: '10px',
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
    
    avatar: {
      sm: '22px',
      md: '28px',
      lg: '34px',
    },
    
    button: {
      height: '36px',
      padding: '8px 16px',
    },
    
    input: {
      height: '36px',
      padding: '8px 14px',
    },
    
    card: {
      padding: '14px',
      borderRadius: '16px',
    },
    
    column: {
      width: '272px',
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

// Type exports for TypeScript
export type ColorKey = keyof typeof designTokens.colors;
export type SpacingKey = keyof typeof designTokens.spacing;
export type FontSizeKey = keyof typeof designTokens.typography.fontSize;
export type BorderRadiusKey = keyof typeof designTokens.borderRadius;
