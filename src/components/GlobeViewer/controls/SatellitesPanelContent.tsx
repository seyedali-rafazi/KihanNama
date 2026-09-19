import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import Box from '@mui/material/Box'
import type { SatelliteInfo } from '../../../types/globe'
import SatelliteRow from './SatelliteRow'

type SatellitesPanelContentProps = {
  satellites?: SatelliteInfo[]
  visibility: Record<string, boolean>
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  zoomLabel: string
  simple?: boolean
  height?: number | string
}

export function SatellitesPanelContent({
  satellites = [],
  visibility,
  onToggleVisibility,
  onZoomToSatellite,
  zoomLabel,
  simple = false,
  height = simple ? '55vh' : 380,
}: SatellitesPanelContentProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: satellites.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (simple ? 54 : 58),
    overscan: 5,
  })

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
