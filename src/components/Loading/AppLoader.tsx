import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import PublicIcon from '@mui/icons-material/Public'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import LayersIcon from '@mui/icons-material/Layers'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { alpha, keyframes } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import { useLoading, type LoadingKey } from '../../context/LoadingContext'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const shimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`

function stepIcon(key: LoadingKey) {
  switch (key) {
    case 'assets':
      return LayersIcon
    case 'interface':
      return DashboardIcon
    case 'map':
      return PublicIcon
    case 'satellites':
      return SatelliteAltIcon
  }
}

function AppLoader() {
  const { t } = useLanguage()
  const { steps, displayIndex, progress, isComplete } = useLoading()
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [messageVisible, setMessageVisible] = useState(true)
  const [shownIndex, setShownIndex] = useState(0)
  const prevIndexRef = useRef(displayIndex)

  useEffect(() => {
    if (prevIndexRef.current === displayIndex) return

    setMessageVisible(false)
    const timer = window.setTimeout(() => {
      setShownIndex(displayIndex)
      setMessageVisible(true)
      prevIndexRef.current = displayIndex
    }, 320)

    return () => window.clearTimeout(timer)
  }, [displayIndex])

  useEffect(() => {
    if (!isComplete || exiting) return
    setExiting(true)
  }, [isComplete, exiting])

  useEffect(() => {
    if (!exiting) return

    const timer = window.setTimeout(() => {
      setVisible(false)
    }, 650)

    return () => window.clearTimeout(timer)
  }, [exiting])

  if (!visible) return null

  const step = steps[shownIndex] ?? steps[0]
  const Icon = stepIcon(step.key)

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: '#06080a',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.65s ease',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 45% at 50% 0%, rgba(25,118,210,0.2), transparent 65%),
            radial-gradient(circle at 20% 80%, rgba(66,165,245,0.06), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(25,118,210,0.05), transparent 35%)
          `,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          width: 'min(92vw, 400px)',
          textAlign: 'center',
          animation: `${fadeUp} 0.5s ease`,
        }}
      >
        <Box sx={{ position: 'relative', width: 88, height: 88, mx: 'auto', mb: 3 }}>
          <Box
            sx={{
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              border: `1px solid ${alpha('#42a5f5', 0.25)}`,
              animation: `${orbit} 10s linear infinite`,
            }}
          />
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: 3,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#1976d2', 0.12),
              border: `1px solid ${alpha('#42a5f5', 0.35)}`,
              boxShadow: `0 12px 40px ${alpha('#1976d2', 0.25)}`,
              transition: 'all 0.35s ease',
            }}
          >
            <Icon sx={{ fontSize: 40, color: '#42a5f5' }} />
          </Box>
        </Box>

        <Box
          component="img"
          src="/favicon.svg"
          alt=""
          sx={{ width: 28, height: 28, mb: 1.5, opacity: 0.9 }}
        />

        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.03em', mb: 2 }}>
          {t('brand')}
        </Typography>

        <Box
          sx={{
            minHeight: 88,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            mb: 3,
          }}
        >
          <Typography
            key={`title-${shownIndex}`}
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              mb: 0.75,
              opacity: messageVisible ? 1 : 0,
              transform: messageVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.32s ease, transform 0.32s ease',
              background: 'linear-gradient(90deg, #fff, #90caf9, #fff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: messageVisible ? `${shimmer} 3s linear infinite` : 'none',
            }}
          >
            {t(step.labelKey)}
          </Typography>

          <Typography
            key={`desc-${shownIndex}`}
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 320,
              lineHeight: 1.55,
              opacity: messageVisible ? 1 : 0,
              transform: messageVisible ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.32s ease 0.06s, transform 0.32s ease 0.06s',
            }}
          >
            {t(step.descKey)}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {t('loadingStepLabel')} {displayIndex + 1} / {steps.length}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 5,
            borderRadius: 3,
            bgcolor: alpha('#fff', 0.08),
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
              transition: 'transform 0.45s ease',
            },
          }}
        />

        <Typography variant="caption" sx={{ mt: 1, color: alpha('#42a5f5', 0.85), fontWeight: 600 }}>
          {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  )
}

export default AppLoader
