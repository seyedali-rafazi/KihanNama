import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import MyLocation from '@mui/icons-material/MyLocation'
import { Cartesian3 } from 'cesium'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { getCesiumViewer } from './cesiumUtils'
import { getNavButtonSx } from './navButtonStyles'

type LocateUserProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function LocateUser({ viewerRef }: LocateUserProps) {
  const theme = useTheme()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleLocate = async () => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer) return

    setLoading(true)
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()

      if (data.latitude && data.longitude) {
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(data.longitude, data.latitude, 1_500_000),
          duration: 1.5,
        })
      }
    } catch {
      console.error(t('locateError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Tooltip title={t('locateMe')} placement="left" arrow>
        <IconButton
          onClick={handleLocate}
          disabled={loading}
          size="medium"
          sx={getNavButtonSx(theme)}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: 'text.secondary' }} />
          ) : (
            <MyLocation fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default LocateUser
