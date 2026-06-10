import { createTheme } from '@mui/material/styles'

export const NAVBAR_HEIGHT = 64

export function createAppTheme(direction: 'ltr' | 'rtl') {
  return createTheme({
    direction,
    palette: {
      mode: 'dark',
      background: {
        default: '#0f1113',
        paper: '#1d1f20',
      },
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
      },
      divider: 'rgba(255, 255, 255, 0.08)',
      text: {
        primary: 'rgba(255, 255, 255, 0.92)',
        secondary: 'rgba(255, 255, 255, 0.55)',
      },
      grey: {
        A100: '#2a2d30',
      },
    },
    shape: {
      borderRadius: 10,
    },
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    typography: {
      fontFamily: direction === 'rtl'
        ? '"Vazirmatn", "Inter", system-ui, sans-serif'
        : '"Inter", "Vazirmatn", system-ui, sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1d1f20',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#1d1f20',
            borderInlineEnd: '1px solid rgba(255, 255, 255, 0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  })
}
