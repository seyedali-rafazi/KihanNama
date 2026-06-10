import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { alpha, useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { getCameraHeadingDegrees, getCesiumViewer, resetCameraNorth } from './cesiumUtils'

type CompassControlProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function CompassDial({ heading }: { heading: number }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 40 40"
        sx={{
          position: 'absolute',
          width: 34,
          height: 34,
          display: 'block',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
        }}
      >
        <defs>
          <linearGradient id="compassBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a3f44" />
            <stop offset="100%" stopColor="#25282c" />
          </linearGradient>
          <linearGradient id="compassFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e3338" />
            <stop offset="100%" stopColor="#1a1d21" />
          </linearGradient>
        </defs>

        <circle cx="20" cy="20" r="18.5" fill="url(#compassBezel)" />
        <circle cx="20" cy="20" r="17" fill="url(#compassFace)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180
          const isCardinal = angle % 90 === 0
          const inner = isCardinal ? 13.5 : 14.5
          const outer = 16.5
          const x1 = 20 + inner * Math.sin(rad)
          const y1 = 20 - inner * Math.cos(rad)
          const x2 = 20 + outer * Math.sin(rad)
          const y2 = 20 - outer * Math.cos(rad)

          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isCardinal ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)'}
              strokeWidth={isCardinal ? 1.2 : 0.6}
              strokeLinecap="round"
            />
          )
        })}

        <polygon
          points="20,5 21.8,9.5 20,8.8 18.2,9.5"
          fill="#ef4444"
          stroke="#fff"
          strokeWidth="0.3"
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          width: 28,
          height: 28,
          transform: `rotate(${-heading}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 40 40"
          sx={{ width: 28, height: 28, display: 'block' }}
        >
          <path
            d="M20 8 L23.5 20 L20 17.5 L16.5 20 Z"
            fill="#ef4444"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
          <path
            d="M20 32 L23.5 20 L20 22.5 L16.5 20 Z"
            fill="rgba(255,255,255,0.35)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />

          <text x="20" y="13.5" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">N</text>
          <text x="20" y="30" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4.5" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">S</text>
          <text x="9" y="21.5" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4.5" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">W</text>
          <text x="31" y="21.5" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4.5" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">E</text>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          width: 5,
          height: 5,
          borderRadius: '50%',
          bgcolor: '#fff',
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          boxShadow: '0 0 4px rgba(0,0,0,0.5)',
          zIndex: 2,
        }}
      />
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
        size="medium"
        sx={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          color: 'text.secondary',
          backgroundColor: 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            transform: 'scale(1.08)',
            borderRadius: '24px',
          },
        }}
      >
        <CompassDial heading={heading} />
      </IconButton>
    </Tooltip>
  )
}

export default CompassControl
