import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { InfographicSection, SatelliteCatalogEntry } from '../../types/satellite'
import FallbackImage from '../common/FallbackImage'

type SatelliteDetailModalProps = {
  satellite: SatelliteCatalogEntry | null
  open: boolean
  onClose: () => void
}

function InfoBlock({
  section,
  align,
  color,
}: {
  section: InfographicSection
  align: 'left' | 'right'
  color: string
}) {
  const { language } = useLanguage()
  const title = language === 'fa' ? section.titleFa : section.titleEn
  const description = language === 'fa' ? section.descriptionFa : section.descriptionEn

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: alpha(color, 0.06),
        border: `1px solid ${alpha(color, 0.15)}`,
        textAlign: align === 'left' ? 'left' : 'right',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          fontWeight: 700,
          color,
          fontSize: '0.72rem',
          mb: 0.4,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
        {description}
      </Typography>
    </Box>
  )
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            maxHeight: '92vh',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
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
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
          <Chip label={categoryLabels[satellite.category]} size="small" sx={{ bgcolor: alpha(color, 0.12), color, fontWeight: 600 }} />
          <Chip label={satellite.orbitClass.toUpperCase()} size="small" variant="outlined" sx={{ borderColor: alpha(color, 0.4), color }} />
          <Chip label={`${t('orbitSteps')}: ${satellite.orbitSteps}`} size="small" variant="outlined" />
          {abilities.map((ability) => (
            <Chip key={ability} label={ability} size="small" sx={{ bgcolor: 'grey.A100', fontSize: '0.72rem' }} />
          ))}
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
          {t('satelliteInfographic')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            gap: { xs: 2, md: 2.5 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, order: { xs: 2, md: 1 } }}>
            {satellite.infographicLeft.map((section) => (
              <InfoBlock key={section.titleEn} section={section} align="left" color={color} />
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              order: { xs: 1, md: 2 },
              py: { xs: 1, md: 0 },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: 200, sm: 240 },
                height: { xs: 200, sm: 240 },
                borderRadius: '50%',
                p: 0.5,
                background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.3)})`,
                boxShadow: `0 0 40px ${alpha(color, 0.25)}`,
              }}
            >
              <FallbackImage
                src={satellite.image}
                placeholderType="satellite"
                accentColor={color}
                alt={satellite.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  bgcolor: 'background.default',
                  border: `3px solid ${theme.palette.background.paper}`,
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }}>
              {Math.round(satellite.altitude / 1000).toLocaleString()} km · {satellite.inclination}°
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, order: { xs: 3, md: 3 } }}>
            {satellite.infographicRight.map((section) => (
              <InfoBlock key={section.titleEn} section={section} align="right" color={color} />
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SatelliteDetailModal
