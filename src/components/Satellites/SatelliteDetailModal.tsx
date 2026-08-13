import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { SatelliteCatalogEntry } from '../../types/satellite'
import { InfographicLayout } from '../common/InfographicLayout'
import {
  getDetailModalBackdropSx,
  getDetailModalPaperSx,
} from '../common/detailModalStyles'

type SatelliteDetailModalProps = {
  satellite: SatelliteCatalogEntry | null
  open: boolean
  onClose: () => void
}

function SatelliteDetailModal({ satellite, open, onClose }: SatelliteDetailModalProps) {
  const { language, t } = useLanguage()
  const theme = useTheme()

  if (!satellite) return null

  const color = `rgb(${satellite.color[0]}, ${satellite.color[1]}, ${satellite.color[2]})`
  const description = language === 'fa' ? satellite.descriptionFa : satellite.descriptionEn
  const abilities = language === 'fa' ? satellite.abilitiesFa : satellite.abilitiesEn
  const operator = language === 'fa' ? satellite.operatorFa : satellite.operatorEn

  const categoryLabels: Record<SatelliteCatalogEntry['category'], string> = {
    earthObservation: t('catEarthObservation'),
    navigation: t('catNavigation'),
    weather: t('catWeather'),
    communications: t('catCommunications'),
    science: t('catScience'),
    station: t('catStation'),
  }

  const centerCaption = `${Math.round(satellite.altitude / 1000).toLocaleString()} km · ${satellite.inclination}°`

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: { sx: getDetailModalBackdropSx() },
        paper: { sx: getDetailModalPaperSx(theme) },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color }}>
            {satellite.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {operator} · {satellite.launchYear}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
          <Chip
            label={categoryLabels[satellite.category]}
            size="small"
            sx={{ bgcolor: alpha(color, 0.12), color, fontWeight: 600 }}
          />
          <Chip
            label={satellite.orbitClass.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{ borderColor: alpha(color, 0.4), color }}
          />
          <Chip
            label={`${t('orbitSteps')}: ${satellite.orbitSteps}`}
            size="small"
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.common.white, 0.15) }}
          />
          {abilities.map((ability) => (
            <Chip
              key={ability}
              label={ability}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.common.white, 0.08), fontSize: '0.72rem' }}
            />
          ))}
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
          {t('satelliteInfographic')}
        </Typography>

        <InfographicLayout
          leftSections={satellite.infographicLeft}
          rightSections={satellite.infographicRight}
          imageSrc={satellite.image}
          imageAlt={satellite.name}
          placeholderType="satellite"
          color={color}
          centerCaption={centerCaption}
        />
      </DialogContent>
    </Dialog>
  )
}

export default SatelliteDetailModal
