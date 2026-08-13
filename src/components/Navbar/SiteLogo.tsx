import { NavLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type SiteLogoProps = {
  brand: string
  onClick?: () => void
}

export function SiteLogo({ brand, onClick }: SiteLogoProps) {
  return (
    <Box
      component={NavLink}
      to="/"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        textDecoration: 'none',
        color: 'text.primary',
        '&:hover .logo-mark': { transform: 'scale(1.05)' },
      }}
    >
      <Box
        className="logo-mark"
        component="img"
        src="/favicon.svg"
        alt=""
        sx={{
          width: 36,
          height: 36,
          transition: 'transform 0.2s ease',
          flexShrink: 0,
          display: 'block',
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.05rem', sm: '1.2rem' },
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #fff 30%, #42a5f5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {brand}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.62rem',
            color: 'text.secondary',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Space Tracker
        </Typography>
      </Box>
    </Box>
  )
}

export default SiteLogo
