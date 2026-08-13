import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { CatalogImageType } from '../../types/common'

type ImagePlaceholderProps = {
  type: CatalogImageType
  name: string
  accentColor: string
  compact?: boolean
  sx?: SxProps<Theme>
}

const ICONS = {
  satellite: SatelliteAltIcon,
  launcher: RocketLaunchIcon,
  station: SettingsInputAntennaIcon,
} as const

function ImagePlaceholder({ type, name, accentColor, compact = false, sx }: ImagePlaceholderProps) {
  const theme = useTheme()
  const Icon = ICONS[type]

  return (
    <Box
      sx={[
        {
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(ellipse 80% 60% at 50% 110%, ${alpha(accentColor, 0.45)} 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 20% 10%, ${alpha(accentColor, 0.2)} 0%, transparent 60%),
            linear-gradient(160deg, ${alpha(accentColor, 0.12)} 0%, ${theme.palette.background.default} 55%, #080a0c 100%)
          `,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${alpha(accentColor, 0.18)} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: compact ? 0 : 72,
            height: compact ? 0 : 72,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: compact ? 'transparent' : alpha(theme.palette.background.paper, 0.55),
            border: compact ? 'none' : `1px solid ${alpha(accentColor, 0.35)}`,
            boxShadow: compact ? 'none' : `0 8px 32px ${alpha(accentColor, 0.25)}, inset 0 1px 0 ${alpha('#fff', 0.08)}`,
          }}
        >
          <Icon
            sx={{
              fontSize: compact ? 22 : 36,
              color: accentColor,
              filter: `drop-shadow(0 2px 8px ${alpha(accentColor, 0.5)})`,
            }}
          />
        </Box>

        {!compact && (
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: alpha(accentColor, 0.75),
              textAlign: 'center',
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ImagePlaceholder
