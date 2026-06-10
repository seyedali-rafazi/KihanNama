import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import HomeFilled from '@mui/icons-material/HomeFilled'
import { Cartesian3 } from 'cesium'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { getCesiumViewer } from './cesiumUtils'
import { getNavButtonSx } from './navButtonStyles'

type FlyHomeProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function FlyHome({ viewerRef }: FlyHomeProps) {
  const theme = useTheme()
  const { t } = useLanguage()

  const handleFlyHome = () => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(53, 35, 4_500_000),
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
