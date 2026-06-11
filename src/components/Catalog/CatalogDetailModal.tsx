import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { CatalogEntry, InfographicSection } from '../../types/catalog'
import type { TranslationKey } from '../../i18n/translations'
import FallbackImage from '../common/FallbackImage'
import {
  getDetailInfoBlockSx,
  getDetailModalBackdropSx,
  getDetailModalPaperSx,
} from '../common/detailModalStyles'

type CatalogDetailModalProps = {
  item: CatalogEntry | null
  open: boolean
  onClose: () => void
  placeholderType: 'launcher' | 'station'
  infographicTitleKey: TranslationKey
  stepsLabelKey: TranslationKey
  getCategoryLabel?: (item: CatalogEntry) => string
}

function InfoBlock({
  section,
  color,
}: {
  section: InfographicSection
  color: string
}) {
  const { language } = useLanguage()
  const title = language === 'fa' ? section.titleFa : section.titleEn
  const description = language === 'fa' ? section.descriptionFa : section.descriptionEn

  return (
    <Box sx={getDetailInfoBlockSx(color)}>
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

function CatalogDetailModal({
  item,
  open,
  onClose,
  placeholderType,
  infographicTitleKey,
  stepsLabelKey,
  getCategoryLabel,
}: CatalogDetailModalProps) {
  const { language, t } = useLanguage()
  const theme = useTheme()

  if (!item) return null

  const color = `rgb(${item.color[0]}, ${item.color[1]}, ${item.color[2]})`
  const description = language === 'fa' ? item.descriptionFa : item.descriptionEn
  const abilities = language === 'fa' ? item.abilitiesFa : item.abilitiesEn
  const operator = language === 'fa' ? item.operatorFa : item.operatorEn
  const badge = language === 'fa' ? item.badgeFa : item.badgeEn
  const centerCaption = language === 'fa' ? item.centerCaptionFa : item.centerCaptionEn

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
            {item.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {operator} · {item.year}
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
          {getCategoryLabel && (
            <Chip
              label={getCategoryLabel(item)}
              size="small"
              sx={{ bgcolor: alpha(color, 0.12), color, fontWeight: 600 }}
            />
          )}
          <Chip label={badge} size="small" variant="outlined" sx={{ borderColor: alpha(color, 0.4), color }} />
          <Chip
            label={`${t(stepsLabelKey)}: ${item.steps}`}
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
          {t(infographicTitleKey)}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            gap: { xs: 2, md: 2.5 },
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.25,
              order: { xs: 2, md: 1 },
              width: '100%',
            }}
          >
            {item.infographicLeft.map((section) => (
              <InfoBlock key={section.titleEn} section={section} color={color} />
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
                src={item.image}
                placeholderType={placeholderType}
                accentColor={color}
                alt={item.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  bgcolor: '#000',
                  border: `3px solid ${alpha(theme.palette.common.white, 0.12)}`,
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }}>
              {centerCaption}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.25,
              order: { xs: 3, md: 3 },
              width: '100%',
            }}
          >
            {item.infographicRight.map((section) => (
              <InfoBlock key={section.titleEn} section={section} color={color} />
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CatalogDetailModal
