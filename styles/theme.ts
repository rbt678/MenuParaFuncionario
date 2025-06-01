
export const theme = {
  colors: {
    primary: 'white', // Amber/Yellow - Main interactive elements
    primaryDark: 'gray', // Darker shade for hover/active
    primaryLight: '#ffcf40', // Lighter shade
    
    secondary: 'white', // Orange - Often used for section titles or secondary accents

    accentGreen: '#4caf50',   // Green - Prices, success indicators
    accentGreenDark: '#388e3c',
    
    accentBlue: '#2196f3',      // Blue - Informational elements, some buttons
    accentBlueDark: '#1976d2',

    background: '#1a1a1a',      // Dark main background
    surface: '#2c2c2c',         // Card backgrounds, modal backgrounds
    surfaceLight: '#3a3a3a',    // Slightly lighter surface for hover or secondary elements
    surfaceDark: '#222222',     // Darker surface for nested elements

    textPrimary: '#f0f0f0',     // Main text color on dark backgrounds
    textSecondary: '#cccccc',   // Subdued text color
    textDisabled: '#6f6f6f',    // Disabled text color
    textOnPrimary: '#1a1a1a',   // Text color for elements with primary background (e.g., yellow buttons)
    textOnAccent: '#ffffff',    // Generic text color for accent backgrounds

    error: '#ef4444',           // Red - Error messages, destructive actions (Tailwind red-500)
    errorDark: '#dc2626',       // Tailwind red-600
    errorText: '#ffffff',

    success: '#22c55e',         // Green - Success messages (Tailwind green-500)
    successText: '#ffffff',

    info: '#3b82f6',            // Blue - Info messages (Tailwind blue-500)
    infoText: '#ffffff',
    
    destructive: '#ef4444',     // For delete buttons etc. (Tailwind red-500)
    destructiveHover: '#dc2626',// Tailwind red-600

    borderLight: '#4a4a4a',     // Borders on dark surfaces
    borderDark: '#3a3a3a',      // Darker borders

    inputBackground: '#3f3f3f', 
    inputBorder: '#5a5a5a',
    inputFocusBorder: '#ffc107', // Primary color for focus
    focusRing: '#ffc107',       // Primary color for focus rings

    // Status Badges - using Tailwind friendly names for potential future config
    statusPendenteBg: '#f59e0b', // amber-500
    statusPendenteText: '#78350f', // amber-900
    statusEmPreparoBg: '#3b82f6', // blue-500
    statusEmPreparoText: '#dbeafe', // blue-100
    statusProntoBg: '#22c55e', // green-500
    statusProntoText: '#dcfce7', // green-100
    statusConcluidoBg: '#10b981', // emerald-600
    statusConcluidoText: '#d1fae5', // emerald-100
    statusCanceladoBg: '#ef4444', // red-500
    statusCanceladoText: '#fee2e2', // red-100
    statusDefaultBg: '#6b7280', // gray-500
    statusDefaultText: '#f3f4f6', // gray-100

    // Scrollbar
    scrollbarTrack: '#2c2c2c', // surface
    scrollbarThumb: '#ffc107', // primary
    scrollbarThumbHover: '#ffb300', // primaryDark
  },
  fonts: {
    heading: "'Lilita One', cursive",
    body: "'Inter', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem',   // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem',  // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',   // 48px
  },
  // CSS string for scrollbar styles to be injected or used if possible
  // For this exercise, index.html will be updated directly with these values
  // But ideally, this would be managed via JS or a separate CSS file.
  getScrollbarStylesCSS: function() {
    return `
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: ${this.colors.scrollbarTrack};
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: ${this.colors.scrollbarThumb};
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${this.colors.scrollbarThumbHover};
      }
      /* For Firefox */
      html {
        scrollbar-width: thin;
        scrollbar-color: ${this.colors.scrollbarThumb} ${this.colors.scrollbarTrack};
      }
    `;
  }
};
