import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../context/LanguageContext'
import { SATELLITES } from '../../data/satellites'
import {
  formatAltitude,
  formatCoordinate,
  formatSpeed,
  getEntityScreenPosition,
  getSatelliteTelemetry,
  type SatelliteTelemetry,
} from '../../utils/satelliteTelemetry'

type SatelliteInfoBadgeProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
  dataSourceRef: React.RefObject<CesiumCzmlDataSource | null>
  satelliteId: string | null
  pinned: boolean
}

function SatelliteInfoBadge({
  viewerRef,
  dataSourceRef,
  satelliteId,
  pinned,
}: SatelliteInfoBadgeProps) {
  const theme = useTheme()
  const { t } = useLanguage()
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null)
  const [telemetry, setTelemetry] = useState<SatelliteTelemetry | null>(null)

  const satellite = satelliteId ? SATELLITES.find((sat) => sat.id === satelliteId) : undefined
  const accentColor = satellite
    ? `rgb(${satellite.color[0]}, ${satellite.color[1]}, ${satellite.color[2]})`
    : undefined

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer || !satelliteId) {
      setScreenPos(null)
      setTelemetry(null)
      return
    }

    const update = () => {
      const entity = dataSourceRef.current?.entities.getById(satelliteId)
      if (!entity) {
        setScreenPos(null)
        setTelemetry(null)
        return
      }

      const time = viewer.clock.currentTime
      const nextTelemetry = getSatelliteTelemetry(entity, time)
      const canvasPosition = getEntityScreenPosition(viewer.scene, entity, time)

      if (!nextTelemetry || !canvasPosition) {
        setScreenPos(null)
        setTelemetry(null)
        return
      }

      setTelemetry(nextTelemetry)
      setScreenPos({ x: canvasPosition.x, y: canvasPosition.y })
    }

    update()
    viewer.scene.postRender.addEventListener(update)
    return () => {
      viewer.scene.postRender.removeEventListener(update)
    }
  }, [viewerRef, dataSourceRef, satelliteId])

  if (!satelliteId || !satellite || !accentColor || !screenPos || !telemetry) return null

  return (
    <Box
      dir="ltr"
      sx={{
        position: 'absolute',
        left: screenPos.x,
        top: screenPos.y,
        transform: 'translate(-50%, -100%) translateY(-10px)',
        pointerEvents: 'none',
        zIndex: 15,
        minWidth: 148,
        maxWidth: 190,
        px: 1,
        py: 0.75,
        borderRadius: 1.25,
        bgcolor: alpha('#0a0c0e', pinned ? 0.92 : 0.84),
        border: `1px solid ${alpha(accentColor, 0.55)}`,
        boxShadow: pinned
          ? `0 6px 20px ${alpha('#000', 0.45)}`
          : `0 4px 14px ${alpha('#000', 0.35)}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          fontWeight: 700,
          fontSize: '0.72rem',
          lineHeight: 1.2,
          mb: 0.4,
          color: accentColor,
        }}
      >
        {satellite.name}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px 8px',
          color: theme.palette.text.secondary,
          fontSize: '0.64rem',
          lineHeight: 1.35,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
          {t('badgeLat')}: {formatCoordinate(telemetry.lat)}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
          {t('badgeLon')}: {formatCoordinate(telemetry.lon)}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
          {t('badgeAlt')}: {formatAltitude(telemetry.altitude)}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
          {t('badgeSpeed')}: {formatSpeed(telemetry.speed)}
        </Typography>
      </Box>
    </Box>
  )
}

export default SatelliteInfoBadge
