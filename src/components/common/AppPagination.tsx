import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'

type AppPaginationProps = {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function AppPagination({
  page,
  total,
  limit,
  onPageChange,
  disabled = false,
}: AppPaginationProps) {
  const { t, language } = useLanguage()
  const theme = useTheme()
  const isRtl = language === 'fa'

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const summaryText = t('paginationShowing')
    .replace('{from}', String(from))
    .replace('{to}', String(to))
    .replace('{total}', String(total))

  if (total === 0) {
    return null
  }

  return (
    <Box
      sx={{
        mt: 4,
        mb: 2,
        px: { xs: 2, sm: 3 },
        py: 1.75,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
        alignItems: 'center',
        gap: 2,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.45),
        backdropFilter: 'blur(16px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.25)}`,
      }}
    >
      <Box sx={{ justifySelf: { xs: 'center', md: 'start' }, textAlign: { xs: 'center', md: 'start' } }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.85rem',
          }}
        >
          {summaryText}
        </Typography>
      </Box>

      <Box sx={{ justifySelf: 'center', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => onPageChange(newPage)}
          disabled={disabled || totalPages <= 1}
          color="primary"
          shape="rounded"
          size="medium"
          dir={isRtl ? 'rtl' : 'ltr'}
          sx={{
            '& .MuiPagination-ul': {
              justifyContent: 'center',
              flexWrap: 'nowrap',
            },
            '& .MuiPaginationItem-root': {
              color: 'text.primary',
              fontWeight: 600,
              borderRadius: 1.5,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: alpha(theme.palette.common.white, 0.03),
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                borderColor: alpha(theme.palette.primary.main, 0.35),
              },
              '&.Mui-selected': {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText || '#fff',
                borderColor: theme.palette.primary.light,
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.5)}`,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              },
              '&.Mui-disabled': {
                opacity: 0.35,
                borderColor: 'transparent',
              },
            },
          }}
        />
      </Box>

      {/* Spacer to mathematically balance the pagination in the exact center on desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }} />
    </Box>
  )
}

export default AppPagination
