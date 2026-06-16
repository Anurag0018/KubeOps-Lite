import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6', // Electric Blue
        light: '#60a5fa',
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6366f1', // Indigo
        light: '#818cf8',
        dark: '#4338ca',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#080c15' : '#f8fafc', // Deep Obsidian vs Slate 50
        paper: isDark ? '#0e1626' : '#ffffff',   // Card Surface vs Pure White
        sidebar: isDark ? '#0a0e1a' : '#f1f5f9', // Darker vs Light grey sidebar
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a', // Off-white vs Slate 900
        secondary: isDark ? '#94a3b8' : '#475569', // Slate grey vs Slate 600
        disabled: isDark ? '#64748b' : '#94a3b8',
      },
      success: {
        main: '#10b981', // Emerald
        light: '#34d399',
        dark: '#047857',
      },
      warning: {
        main: '#f59e0b', // Amber
        light: '#fbbf24',
        dark: '#b45309',
      },
      error: {
        main: '#ef4444', // Red
        light: '#f87171',
        dark: '#b91c1c',
      },
      info: {
        main: '#06b6d4', // Cyan
        light: '#22d3ee',
        dark: '#0e7490',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontSize: '1.1rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.75rem',
        lineHeight: 1.43,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isDark ? '#080c15' : '#f8fafc',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDark ? '#1e293b' : '#cbd5e1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isDark ? '#334155' : '#94a3b8',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#0e1626' : '#ffffff',
            borderRadius: 12,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.05)',
            padding: '12px 16px',
            color: isDark ? '#f8fafc' : '#0f172a',
          },
          head: {
            fontWeight: 600,
            color: isDark ? '#94a3b8' : '#475569',
            backgroundColor: isDark ? '#0c1220' : '#f1f5f9',
          },
        },
      },
    },
  });
};

const defaultTheme = getTheme('dark');
export default defaultTheme;

