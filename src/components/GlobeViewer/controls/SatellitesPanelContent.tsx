import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import type { SatelliteInfo } from '../../../types/globe'
import { useLanguage } from '../../../context/LanguageContext'
import SatelliteRow from './SatelliteRow'

type SatellitesPanelContentProps = {
  satellites?: SatelliteInfo[]
  isLoading?: boolean
  visibility: Record<string, boolean>
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  zoomLabel: string
  simple?: boolean
  height?: number | string
}

function SatelliteRowSkeleton({ simple }: { simple?: boolean }) {
  const theme = useTheme()
  return (
    <Box
      dir="ltr"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1.25,
        px: simple ? 2 : 1.25,
        py: 1,
        mx: simple ? 0 : 1,
        mb: simple ? 0 : 1,
        borderRadius: simple ? 0 : '10px',
        border: simple ? 'none' : `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        borderBottom: simple ? `1px solid ${theme.palette.divider}` : undefined,
        bgcolor: simple ? 'transparent' : alpha(theme.palette.common.white, 0.03),
      }}
    >
      <Skeleton
        variant="rounded"
        width={40}
        height={40}
        sx={{
          borderRadius: '8px',
          flexShrink: 0,
          bgcolor: alpha(theme.palette.common.white, 0.08),
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          sx={{ bgcolor: alpha(theme.palette.common.white, 0.08) }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={14}
          sx={{ bgcolor: alpha(theme.palette.common.white, 0.05), mt: 0.25 }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Skeleton
          variant="rounded"
          width={28}
          height={28}
          sx={{ borderRadius: 1, bgcolor: alpha(theme.palette.common.white, 0.06) }}
        />
        <Skeleton
          variant="rounded"
          width={28}
          height={28}
          sx={{ borderRadius: 1, bgcolor: alpha(theme.palette.common.white, 0.06) }}
        />
      </Box>
    </Box>
  )
}

export function SatellitesPanelContent({
  satellites = [],
  isLoading = false,
  visibility,
  onToggleVisibility,
  onZoomToSatellite,
  zoomLabel,
  simple = false,
  height = simple ? '55vh' : 380,
}: SatellitesPanelContentProps) {
  const { t } = useLanguage()
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: satellites.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (simple ? 54 : 58),
    overscan: 5,
  })

  if (isLoading) {
    return (
      <Box
        dir="ltr"
        sx={{
          height,
          overflowY: 'hidden',
          direction: 'ltr',
          pt: simple ? 0 : 0.5,
        }}
      >
        {Array.from({ length: simple ? 5 : 6 }).map((_, idx) => (
          <SatelliteRowSkeleton key={idx} simple={simple} />
        ))}
      </Box>
    )
  }

  if (satellites.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('noSatellitesFound')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      ref={parentRef}
      dir="ltr"
      sx={{
        height,
        overflowY: 'auto',
        position: 'relative',
        direction: 'ltr',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
        },
      }}
    >
      <Box
        sx={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const sat = satellites[virtualRow.index]
          if (!sat) return null

          return (
            <Box
              key={sat.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <SatelliteRow
                sat={sat}
                visible={Boolean(visibility[sat.id])}
                onToggleVisibility={onToggleVisibility}
                onZoomToSatellite={onZoomToSatellite}
                zoomLabel={zoomLabel}
                simple={simple}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default SatellitesPanelContent
