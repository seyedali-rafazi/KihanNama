import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { getCesiumViewer } from './cesiumUtils'
import { getNavButtonSx } from './navButtonStyles'
import CompassControl from './CompassControl'

type ZoomControlProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function ZoomControl({ viewerRef }: ZoomControlProps) {
  const theme = useTheme()
  const { t } = useLanguage()

  const handleZoomIn = () => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return
    const height = viewer.camera.positionCartographic.height
    viewer.camera.zoomIn(height * 0.35)
  }

  const handleZoomOut = () => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return
    const height = viewer.camera.positionCartographic.height
    viewer.camera.zoomOut(height * 0.35)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#353535',
        borderRadius: '24px',
      }}
    >
      <Tooltip title={t('zoomIn')} placement="left" arrow>
        <IconButton onClick={handleZoomIn} size="medium" sx={getNavButtonSx(theme)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <CompassControl viewerRef={viewerRef} />

      <Tooltip title={t('zoomOut')} placement="left" arrow>
        <IconButton onClick={handleZoomOut} size="medium" sx={getNavButtonSx(theme)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ZoomControl
