import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { getCesiumViewer, smoothCameraZoom } from './cesiumUtils'
import { getNavButtonSx } from './navButtonStyles'
import CompassControl from './CompassControl'

type ZoomControlProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function ZoomControl({ viewerRef }: ZoomControlProps) {
  const theme = useTheme()
  const { t } = useLanguage()

  const handleZoom = (zoomIn: boolean) => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return
    smoothCameraZoom(viewer, zoomIn)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Tooltip title={t('zoomIn')} placement="left" arrow>
        <IconButton onClick={() => handleZoom(true)} size="small" sx={getNavButtonSx(theme)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <CompassControl viewerRef={viewerRef} />

      <Tooltip title={t('zoomOut')} placement="left" arrow>
        <IconButton onClick={() => handleZoom(false)} size="small" sx={getNavButtonSx(theme)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ZoomControl
