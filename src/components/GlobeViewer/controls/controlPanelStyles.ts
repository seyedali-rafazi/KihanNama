import { alpha, type Theme } from '@mui/material/styles'

export function getGlassPanelSx(theme: Theme) {
  return {
    background: alpha(theme.palette.background.paper, 0.72),
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
  }
}

export function getGlassAccordionSx(theme: Theme) {
  return {
    ...getGlassPanelSx(theme),
    borderRadius: '14px !important',
    overflow: 'hidden',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: '0 !important' },
    '& + &': { mt: 1.25 },
  }
}

export function getGlassSummarySx(theme: Theme) {
  return {
    minHeight: 56,
    px: 2,
    '& .MuiAccordionSummary-content': { my: 1.25, alignItems: 'center' },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.text.secondary,
    },
  }
}
