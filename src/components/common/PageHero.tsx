import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha, keyframes, useTheme } from '@mui/material/styles'

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

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 200, sm: 260 },
        borderRadius: { xs: 0, sm: 3 },
        overflow: 'hidden',
        mb: { xs: 3, sm: 4 },
        mx: { xs: -2, sm: 0 },
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
          transform: 'scale(1)',
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
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: { xs: 200, sm: 260 },
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          variant="h4"
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
          sx={{ maxWidth: 560, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

export default PageHero
