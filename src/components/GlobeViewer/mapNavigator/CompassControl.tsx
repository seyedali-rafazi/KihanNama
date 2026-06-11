import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { getCameraHeadingDegrees, getCesiumViewer, resetCameraNorth } from './cesiumUtils'

type CompassControlProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function CompassDial({ heading }: { heading: number }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${-heading}deg)`,
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 24, height: 24, display: 'block' }}
      >
        <polygon points="12,3 14,11 12,9.5 10,11" fill="#ef4444" />
        <polygon points="12,21 14,13 12,14.5 10,13" fill="rgba(255,255,255,0.3)" />
        <text
          x="12"
          y="8"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="4.5"
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
        >
          N
        </text>
      </Box>
    </Box>
  )
}

function CompassControl({ viewerRef }: CompassControlProps) {
  const theme = useTheme()
  const { t } = useLanguage()
  const [heading, setHeading] = useState(0)

  useEffect(() => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return

    const updateHeading = () => {
      setHeading(getCameraHeadingDegrees(viewer))
    }

    updateHeading()
    viewer.camera.changed.addEventListener(updateHeading)
    return () => {
      viewer.camera.changed.removeEventListener(updateHeading)
    }
  }, [viewerRef])

  const handleResetNorth = () => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return
    resetCameraNorth(viewer)
  }

  return (
    <Tooltip title={t('resetNorth')} placement="left" arrow>
      <IconButton
        onClick={handleResetNorth}
        size="small"
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          color: 'text.secondary',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            color: 'text.primary',
            bgcolor: `${theme.palette.primary.main}22`,
          },
        }}
      >
        <CompassDial heading={heading} />
      </IconButton>
    </Tooltip>
  )
}

export default CompassControl
