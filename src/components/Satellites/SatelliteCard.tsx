import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import type { SatelliteCatalogEntry } from '../../types/satellite'
import { useLanguage } from '../../context/LanguageContext'
import FallbackImage from '../common/FallbackImage'

type SatelliteCardProps = {
  satellite: SatelliteCatalogEntry
  onClick: () => void
}

function SatelliteCard({ satellite, onClick }: SatelliteCardProps) {
  const { language } = useLanguage()
  const theme = useTheme()
  const color = `rgb(${satellite.color[0]}, ${satellite.color[1]}, ${satellite.color[2]})`
  const description = language === 'fa' ? satellite.descriptionFa : satellite.descriptionEn

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(color, 0.6),
          boxShadow: `0 12px 32px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>
        <Box
          sx={{
            position: 'relative',
            height: 180,
            overflow: 'hidden',
            bgcolor: alpha(color, 0.08),
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
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              '.MuiCardActionArea-root:hover &': { transform: 'scale(1.05)' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to top, ${theme.palette.background.paper} 0%, transparent 60%)`,
            }}
          />
          <Chip
            label={
              language === 'fa'
                ? { leo: 'LEO', meo: 'MEO', geo: 'GEO' }[satellite.orbitClass]
                : satellite.orbitClass.toUpperCase()
            }
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: alpha(theme.palette.background.paper, 0.85),
              color,
              fontWeight: 700,
              fontSize: '0.7rem',
              border: `1px solid ${alpha(color, 0.4)}`,
            }}
          />
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              color,
              mb: 0.75,
            }}
          >
            {satellite.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              fontSize: '0.82rem',
              minHeight: '3.7em',
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default SatelliteCard
