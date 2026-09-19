import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useHealthQuery } from '../../hooks/queries'
import { useLanguage } from '../../context/LanguageContext'

export default function BackendStatusBadge() {
  const { data: health, isLoading, isError } = useHealthQuery()
  const { language } = useLanguage()

  const isConnected = Boolean(health && health.status === 'healthy' && health.databases?.postgresql === 'connected')

  const titleEn = isConnected
    ? `Backend Online · ${health?.counts?.satellites || 0} Satellites · ${health?.counts?.launchers || 0} Launchers`
    : isLoading
    ? 'Checking API...'
    : 'Offline Mode (Local Cache Active)'

  const titleFa = isConnected
    ? `سرور آنلاین · ${health?.counts?.satellites || 0} ماهواره · ${health?.counts?.launchers || 0} پرتاب‌گر`
    : isLoading
    ? 'بررسی ارتباط...'
    : 'حالت آفلاین (استفاده از کش محلی)'

  const tooltipText = language === 'fa' ? titleFa : titleEn

  return (
    <Tooltip title={tooltipText} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          bgcolor: isConnected
            ? 'rgba(0, 230, 118, 0.08)'
            : isError
            ? 'rgba(255, 171, 0, 0.08)'
            : 'rgba(255, 255, 255, 0.05)',
          border: '1px solid',
          borderColor: isConnected
            ? 'rgba(0, 230, 118, 0.25)'
            : isError
            ? 'rgba(255, 171, 0, 0.25)'
            : 'rgba(255, 255, 255, 0.1)',
          cursor: 'default',
          transition: 'all 0.2s ease',
        }}
      >
        {isLoading ? (
          <CircularProgress size={10} thickness={5} sx={{ color: 'text.secondary' }} />
        ) : (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? '#00e676' : isError ? '#ffab00' : '#90caf9',
              boxShadow: isConnected ? '0 0 8px rgba(0, 230, 118, 0.8)' : 'none',
            }}
          />
        )}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            color: isConnected ? '#00e676' : isError ? '#ffab00' : 'text.secondary',
            letterSpacing: '0.02em',
          }}
        >
          {isConnected ? 'API Live' : isLoading ? 'Connecting...' : 'Cached'}
        </Typography>
      </Box>
    </Tooltip>
  )
}
