import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { CatalogEntry } from '../../types/catalog'
import type { CatalogImageType } from '../../types/common'
import type { TranslationKey } from '../../i18n/translations'
import { InfographicLayout } from '../common/InfographicLayout'
import {
  getDetailModalBackdropSx,
  getDetailModalPaperSx,
} from '../common/detailModalStyles'

type CatalogDetailModalProps = {
  item: CatalogEntry | null
  open: boolean
  onClose: () => void
  placeholderType: CatalogImageType
  infographicTitleKey: TranslationKey
  stepsLabelKey: TranslationKey
  getCategoryLabel?: (item: CatalogEntry) => string
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

        <InfographicLayout
          leftSections={item.infographicLeft}
          rightSections={item.infographicRight}
          imageSrc={item.image}
          imageAlt={item.name}
          placeholderType={placeholderType}
          color={color}
          centerCaption={centerCaption}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CatalogDetailModal
