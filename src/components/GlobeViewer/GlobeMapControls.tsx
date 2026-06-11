import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import FlyHome from './mapNavigator/FlyHome'
import ZoomControl from './mapNavigator/ZoomControl'
import LocateUser from './mapNavigator/LocateUser'
import BoxZoomControl from './mapNavigator/BoxZoomControl'

type GlobeMapControlsProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function GlobeMapControls({ viewerRef }: GlobeMapControlsProps) {
  const theme = useTheme()

  return (
    <Box
      dir="ltr"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        direction: 'ltr',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '12px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: alpha('#0a0c0e', 0.82),
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        p: 0.5,
        gap: 0.25,
        width: 'fit-content',
      }}
    >
      <FlyHome viewerRef={viewerRef} />
      <ZoomControl viewerRef={viewerRef} />
      <LocateUser viewerRef={viewerRef} />
      <BoxZoomControl viewerRef={viewerRef} />
    </Box>
  )
}

export default GlobeMapControls
