import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { InfographicSection, CatalogImageType } from '../../types/common'
import FallbackImage from './FallbackImage'
import { getDetailInfoBlockSx } from './detailModalStyles'

type InfoBlockProps = {
  section: InfographicSection
  color: string
}

export function InfoBlock({ section, color }: InfoBlockProps) {
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

type InfographicLayoutProps = {
  leftSections: InfographicSection[]
  rightSections: InfographicSection[]
  imageSrc?: string | null
  imageAlt: string
  placeholderType: CatalogImageType
  color: string
  centerCaption: string
}

export function InfographicLayout({
  leftSections,
  rightSections,
  imageSrc,
  imageAlt,
  placeholderType,
  color,
  centerCaption,
}: InfographicLayoutProps) {
  const theme = useTheme()

  return (
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
        {leftSections.map((section) => (
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
            src={imageSrc}
            placeholderType={placeholderType}
            accentColor={color}
            alt={imageAlt}
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
        {rightSections.map((section) => (
          <InfoBlock key={section.titleEn} section={section} color={color} />
        ))}
      </Box>
    </Box>
  )
}
