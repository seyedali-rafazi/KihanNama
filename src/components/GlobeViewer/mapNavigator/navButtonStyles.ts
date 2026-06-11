import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

export function getNavButtonSx(theme: Theme, active = false) {
  return {
    width: 36,
    height: 36,
    borderRadius: 1,
    color: active ? 'primary.light' : 'text.secondary',
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
    transition: 'background-color 0.2s, color 0.2s',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
      color: 'text.primary',
    },
  }
}
