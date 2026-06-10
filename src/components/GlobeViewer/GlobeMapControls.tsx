import Paper from '@mui/material/Paper'
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
  return (
    <Paper
      elevation={4}
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
        backdropFilter: 'blur(10px)',
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.6)',
        p: 0.5,
        gap: 0.5,
        width: 'fit-content',
      }}
    >
      <FlyHome viewerRef={viewerRef} />
      <ZoomControl viewerRef={viewerRef} />
      <LocateUser viewerRef={viewerRef} />
      <BoxZoomControl viewerRef={viewerRef} />
    </Paper>
  )
}

export default GlobeMapControls
