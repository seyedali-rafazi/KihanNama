import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha, keyframes, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'

type PageHeroProps = {
  title: string
  subtitle: string
  imageUrl: string
}

const heroZoom = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
`

function PageHero({ title, subtitle, imageUrl }: PageHeroProps) {
  const theme = useTheme()
  const { dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const textAlign = isRtl ? 'right' : 'left'

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 200, sm: 260 },
        borderRadius: 3,
        overflow: 'hidden',
        mb: { xs: 3, sm: 4 },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt=""
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          transform: 'scale(1)',
          transformOrigin: 'center center',
          animation: `${heroZoom} 22s cubic-bezier(0.25, 0.1, 0.25, 1) infinite alternate`,
          willChange: 'transform',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.92)} 0%, ${alpha(theme.palette.background.default, 0.55)} 55%, ${alpha(theme.palette.primary.main, 0.25)} 100%)`,
        }}
      />
      <Box
        dir={dir}
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          minHeight: { xs: 200, sm: 260 },
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 4 },
          direction: dir,
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign, width: '100%' }}
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          style={{ textAlign, width: '100%', maxWidth: 560 }}
          sx={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

export default PageHero
