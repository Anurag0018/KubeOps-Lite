export const getPalette = (mode, accentColor = 'blue') => {
  const isDark = mode === 'dark';

  const accents = {
    blue: {
      main: '#3b82f6', // Electric Blue
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    purple: {
      main: '#8b5cf6', // Indigo-Purple
      light: '#a78bfa',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    emerald: {
      main: '#10b981', // Emerald Green
      light: '#34d399',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    orange: {
      main: '#f97316', // Vibrant Orange
      light: '#fb923c',
      dark: '#c2410c',
      contrastText: '#ffffff',
    }
  };

  const primary = accents[accentColor] || accents.blue;

  return {
    mode,
    primary,
    secondary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    background: {
      default: isDark ? '#080c15' : '#f8fafc', // Obsidian vs Slate 50
      paper: isDark ? '#0e1626' : '#ffffff',   // Card surface vs pure white
      sidebar: isDark ? '#0a0e1a' : '#f1f5f9', // Darker vs light grey sidebar
    },
    text: {
      primary: isDark ? '#f8fafc' : '#0f172a', // Off-white vs Slate 900
      secondary: isDark ? '#94a3b8' : '#475569', // Slate grey vs Slate 600
      disabled: isDark ? '#64748b' : '#94a3b8',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#047857',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#b45309',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#b91c1c',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0e7490',
    },
    divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  };
};
