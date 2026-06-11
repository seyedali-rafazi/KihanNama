import { alpha, type Theme } from '@mui/material/styles'

export const DETAIL_MODAL_BG = '#000000'

export function getDetailModalPaperSx(theme: Theme) {
  return {
    bgcolor: alpha(DETAIL_MODAL_BG, 0.92),
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
    maxHeight: '92vh',
    boxShadow: `0 24px 64px ${alpha('#000', 0.85)}`,
    backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.05)} 0%, transparent 42%)`,
  }
}

export function getDetailModalBackdropSx() {
  return {
    bgcolor: alpha('#000', 0.78),
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  }
}

export function getDetailInfoBlockSx(color: string) {
  return {
    p: 1.5,
    borderRadius: 1.5,
    bgcolor: alpha(color, 0.08),
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(color, 0.22)}`,
    textAlign: 'center' as const,
    width: '100%',
    maxWidth: 280,
  }
}
