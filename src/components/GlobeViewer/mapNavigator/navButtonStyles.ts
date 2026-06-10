import type { Theme } from '@mui/material/styles'

export function getNavButtonSx(theme: Theme, active = false) {
  return {
    width: 36,
    height: 36,
    borderRadius: '8px',
    color: active ? 'primary.main' : 'text.secondary',
    backgroundColor: active ? theme.palette.action.selected : 'transparent',
    boxShadow: active ? 1 : 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: 'white',
      transform: 'scale(1.1)',
      borderRadius: '24px',
    },
  }
}
