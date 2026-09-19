import Box from '@mui/material/Box'
import PaginationItem from '@mui/material/PaginationItem'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useLanguage } from '../../context/LanguageContext'
import { formatLocalizedNumber } from '../../utils/numberFormat'

type AppPaginationProps = {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

type PaginationItemData = {
  type: 'page' | 'previous' | 'next' | 'start-ellipsis' | 'end-ellipsis'
  page?: number
  selected?: boolean
  disabled?: boolean
}

/**
 * Generates pagination items for mobile and desktop viewports.
 * On mobile, produces a compact layout (e.g. 1 2 ... 84) to prevent full-width stretching and overflow.
 */
function getPaginationItems(
  page: number,
  totalPages: number,
  isMobile: boolean
): PaginationItemData[] {
  const items: PaginationItemData[] = []

  // Previous arrow button
  items.push({
    type: 'previous',
    page: Math.max(1, page - 1),
    disabled: page <= 1,
  })

  if (isMobile) {
    // Mobile: compact representation (max 5 page items: e.g. 1 2 ... 84)
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({
          type: 'page',
          page: i,
          selected: i === page,
        })
      }
    } else if (page === 1 || page === 2) {
      // Specifically formatted: 1 2 ... totalPages
      items.push({ type: 'page', page: 1, selected: page === 1 })
      items.push({ type: 'page', page: 2, selected: page === 2 })
      items.push({ type: 'end-ellipsis' })
      items.push({ type: 'page', page: totalPages, selected: false })
    } else if (page === 3) {
      items.push({ type: 'page', page: 1, selected: false })
      items.push({ type: 'page', page: 2, selected: false })
      items.push({ type: 'page', page: 3, selected: true })
      items.push({ type: 'end-ellipsis' })
      items.push({ type: 'page', page: totalPages, selected: false })
    } else if (page === totalPages - 2) {
      items.push({ type: 'page', page: 1, selected: false })
      items.push({ type: 'start-ellipsis' })
      items.push({ type: 'page', page: totalPages - 2, selected: true })
      items.push({ type: 'page', page: totalPages - 1, selected: false })
      items.push({ type: 'page', page: totalPages, selected: false })
    } else if (page >= totalPages - 1) {
      items.push({ type: 'page', page: 1, selected: false })
      items.push({ type: 'start-ellipsis' })
      items.push({ type: 'page', page: totalPages - 1, selected: page === totalPages - 1 })
      items.push({ type: 'page', page: totalPages, selected: page === totalPages })
    } else {
      // Middle pages: 1 ... [page] ... totalPages
      items.push({ type: 'page', page: 1, selected: false })
      items.push({ type: 'start-ellipsis' })
      items.push({ type: 'page', page, selected: true })
      items.push({ type: 'end-ellipsis' })
      items.push({ type: 'page', page: totalPages, selected: false })
    }
  } else {
    // Desktop: full comfortable pagination
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({
          type: 'page',
          page: i,
          selected: i === page,
        })
      }
    } else {
      const showLeftEllipsis = page > 4
      const showRightEllipsis = page < totalPages - 3

      if (!showLeftEllipsis && showRightEllipsis) {
        for (let i = 1; i <= 5; i++) {
          items.push({ type: 'page', page: i, selected: i === page })
        }
        items.push({ type: 'end-ellipsis' })
        items.push({ type: 'page', page: totalPages, selected: false })
      } else if (showLeftEllipsis && !showRightEllipsis) {
        items.push({ type: 'page', page: 1, selected: false })
        items.push({ type: 'start-ellipsis' })
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push({ type: 'page', page: i, selected: i === page })
        }
      } else {
        items.push({ type: 'page', page: 1, selected: false })
        items.push({ type: 'start-ellipsis' })
        items.push({ type: 'page', page: page - 1, selected: false })
        items.push({ type: 'page', page, selected: true })
        items.push({ type: 'page', page: page + 1, selected: false })
        items.push({ type: 'end-ellipsis' })
        items.push({ type: 'page', page: totalPages, selected: false })
      }
    }
  }

  // Next arrow button
  items.push({
    type: 'next',
    page: Math.min(totalPages, page + 1),
    disabled: page >= totalPages,
  })

  return items
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isRtl = language === 'fa'

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const summaryText = t('paginationShowing')
    .replace('{from}', formatLocalizedNumber(from, language))
    .replace('{to}', formatLocalizedNumber(to, language))
    .replace('{total}', formatLocalizedNumber(total, language))

  if (total === 0) {
    return null
  }

  const paginationItems = getPaginationItems(page, totalPages, isMobile)
  const activeFontFamily = isRtl
    ? '"Vazirmatn", "Inter", system-ui, sans-serif'
    : '"Inter", "Vazirmatn", system-ui, sans-serif'

  return (
    <Box
      sx={{
        mt: 4,
        mb: 2,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 1.75 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.45),
        backdropFilter: 'blur(16px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.25)}`,
        width: { xs: 'fit-content', md: '100%' },
        minWidth: { xs: 'min(100%, 280px)', md: 'unset' },
        maxWidth: '100%',
        mx: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ justifySelf: { xs: 'center', md: 'start' }, textAlign: { xs: 'center', md: 'start' } }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.85rem',
            fontFamily: activeFontFamily,
          }}
        >
          {summaryText}
        </Typography>
      </Box>

      <Box
        component="nav"
        aria-label="pagination navigation"
        dir={isRtl ? 'rtl' : 'ltr'}
        sx={{
          justifySelf: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
        }}
      >
        <Box
          component="ul"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            padding: 0,
            margin: 0,
            listStyle: 'none',
            gap: { xs: 0.5, sm: 0.75 },
          }}
        >
          {paginationItems.map((item, index) => {
            const isEllipsis = item.type === 'start-ellipsis' || item.type === 'end-ellipsis'
            const itemPageNumber = item.page !== undefined ? formatLocalizedNumber(item.page, language) : undefined

            return (
              <Box component="li" key={`${item.type}-${item.page ?? index}`} sx={{ display: 'inline-flex' }}>
                <PaginationItem
                  type={item.type}
                  page={item.type === 'page' ? itemPageNumber : undefined}
                  selected={Boolean(item.selected)}
                  disabled={Boolean(disabled || item.disabled || totalPages <= 1)}
                  onClick={() => {
                    if (
                      !disabled &&
                      !item.disabled &&
                      item.page !== undefined &&
                      item.type !== 'start-ellipsis' &&
                      item.type !== 'end-ellipsis'
                    ) {
                      onPageChange(item.page)
                    }
                  }}
                  color="primary"
                  shape="rounded"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    fontFamily: activeFontFamily,
                    minWidth: isMobile ? 30 : 36,
                    height: isMobile ? 30 : 36,
                    fontSize: isMobile ? '0.825rem' : '0.875rem',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    border: isEllipsis ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    bgcolor: isEllipsis ? 'transparent' : alpha(theme.palette.common.white, 0.03),
                    color: isEllipsis ? 'text.secondary' : 'text.primary',
                    transition: 'all 0.2s ease-in-out',
                    ...(isEllipsis && {
                      minWidth: isMobile ? 18 : 24,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }),
                    '&:hover': {
                      bgcolor: isEllipsis ? 'transparent' : alpha(theme.palette.primary.main, 0.15),
                      borderColor: isEllipsis ? 'transparent' : alpha(theme.palette.primary.main, 0.35),
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
                      opacity: isEllipsis ? 0.7 : 0.35,
                      borderColor: isEllipsis ? 'transparent' : alpha(theme.palette.divider, 0.2),
                    },
                  }}
                />
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Spacer to mathematically balance the pagination in the exact center on desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }} />
    </Box>
  )
}

export default AppPagination
