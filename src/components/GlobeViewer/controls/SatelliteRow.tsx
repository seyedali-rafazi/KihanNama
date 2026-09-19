import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { alpha, useTheme } from '@mui/material/styles'
import FallbackImage from '../../common/FallbackImage'
import { useLanguage } from '../../../context/LanguageContext'
import type { SatelliteInfo } from '../../../types/globe'

type SatelliteRowProps = {
  sat: SatelliteInfo
  visible: boolean
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  zoomLabel: string
  isZoomed?: boolean
  simple?: boolean
}

export function SatelliteRow({
  sat,
  visible,
  onToggleVisibility,
  onZoomToSatellite,
  zoomLabel,
  isZoomed = false,
  simple = false,
}: SatelliteRowProps) {
  const theme = useTheme()
  const { t } = useLanguage()
  const color = `rgb(${sat.color[0]}, ${sat.color[1]}, ${sat.color[2]})`
  const zoomButtonTitle = isZoomed ? t('backToPrevView') : zoomLabel

  return (
    <Box
      dir="ltr"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1.25,
        px: simple ? 2 : 1.25,
        py: 1,
        mx: simple ? 0 : 1,
        mb: simple ? 0 : 1,
        borderRadius: simple ? 0 : '10px',
        border: simple
          ? 'none'
          : `1px solid ${isZoomed ? color : alpha(color, 0.35)}`,
        borderBottom: simple ? `1px solid ${theme.palette.divider}` : undefined,
        bgcolor: simple
          ? (isZoomed ? alpha(color, 0.15) : 'transparent')
          : (isZoomed ? alpha(color, 0.16) : alpha(color, 0.06)),
        boxShadow: isZoomed && !simple ? `0 0 12px ${alpha(color, 0.25)}` : 'none',
        opacity: visible ? 1 : 0.5,
        transition: simple
          ? 'opacity 0.2s, background-color 0.2s'
          : 'opacity 0.2s, border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
        '&:hover': simple
          ? { bgcolor: alpha(theme.palette.common.white, 0.04) }
          : {
            borderColor: isZoomed ? color : alpha(color, 0.55),
            bgcolor: isZoomed ? alpha(color, 0.2) : alpha(color, 0.1),
          },
        '&:last-child': { mb: simple ? 0 : 0.5, borderBottom: simple ? 'none' : undefined },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '8px',
          border: simple ? 'none' : `1.5px solid ${color}`,
          bgcolor: alpha(theme.palette.common.black, 0.35),
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <FallbackImage
          src={sat.image}
          placeholderType="satellite"
          accentColor={color}
          alt={sat.name}
          compact
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Avatar>

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: 600,
          fontSize: '0.82rem',
          color,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {sat.name}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
        <IconButton
          size="small"
          onClick={() => onZoomToSatellite(sat.id)}
          title={zoomButtonTitle}
          aria-label={zoomButtonTitle}
          disabled={!visible}
          sx={{
            width: 28,
            height: 28,
            p: 0.5,
            color: isZoomed ? '#ffffff' : color,
            bgcolor: isZoomed ? alpha(color, 0.45) : 'transparent',
            border: isZoomed ? `1.5px solid ${color}` : '1px solid transparent',
            boxShadow: isZoomed
              ? `0 0 10px ${alpha(color, 0.6)}, inset 0 0 6px ${alpha(color, 0.35)}`
              : 'none',
            borderRadius: 1,
            transition: 'all 0.25s ease-in-out',
            '&:hover': {
              bgcolor: isZoomed ? alpha(color, 0.6) : alpha(color, 0.15),
              boxShadow: isZoomed
                ? `0 0 14px ${alpha(color, 0.8)}, inset 0 0 8px ${alpha(color, 0.45)}`
                : 'none',
            },
          }}
        >
          <ZoomInIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onToggleVisibility(sat.id)}
          sx={{
            width: 28,
            height: 28,
            p: 0.5,
            color: visible ? color : 'text.disabled',
            borderRadius: 1,
            '&:hover': { bgcolor: alpha(color, 0.15) },
          }}
        >
          {visible ? (
            <VisibilityIcon sx={{ fontSize: 16 }} />
          ) : (
            <VisibilityOffIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>
    </Box>
  )
}

export default SatelliteRow
