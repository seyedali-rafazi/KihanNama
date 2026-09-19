import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import HomeFilled from '@mui/icons-material/HomeFilled'
import { Cartesian3 } from 'cesium'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { IRAN_VIEW } from '../globeConstants'
import { getCesiumViewer } from './cesiumUtils'
import { getNavButtonSx } from './navButtonStyles'

type FlyHomeProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
  onFlyHome?: () => void
}

function FlyHome({ viewerRef, onFlyHome }: FlyHomeProps) {
  const theme = useTheme()
  const { t } = useLanguage()

  const handleFlyHome = () => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return

    onFlyHome?.()

    viewer.trackedEntity = undefined
    viewer.selectedEntity = undefined

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(IRAN_VIEW.lon, IRAN_VIEW.lat, IRAN_VIEW.altitude),
      duration: 1.5,
    })
  }

  return (
    <Box>
      <Tooltip title={t('flyToIran')} placement="left" arrow>
        <IconButton onClick={handleFlyHome} size="medium" sx={getNavButtonSx(theme)}>
          <HomeFilled fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default FlyHome
