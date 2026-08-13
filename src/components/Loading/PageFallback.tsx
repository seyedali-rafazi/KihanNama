import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { alpha, useTheme } from '@mui/material/styles'

function PageFallback() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
        }}
      >
        <CircularProgress size={36} thickness={4} color="primary" />
      </Box>
    </Box>
  )
}

export default PageFallback
