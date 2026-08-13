import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MapIcon from '@mui/icons-material/Map'
import { alpha, useTheme } from '@mui/material/styles'

type MapStyleCardProps = {
  preview: string
  label: string
  selected: boolean
  onClick: () => void
  simple?: boolean
}

export function MapStyleCard({
  preview,
  label,
  selected,
  onClick,
  simple = false,
}: MapStyleCardProps) {
  const theme = useTheme()
  const [imgError, setImgError] = useState(false)
  const handleImgError = useCallback(() => setImgError(true), [])

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: `${theme.shape.borderRadius}px`,
        border: simple
          ? 'none'
          : `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        overflow: 'hidden',
        bgcolor: simple
          ? selected
            ? alpha(theme.palette.primary.main, 0.14)
            : alpha(theme.palette.common.black, 0.15)
          : alpha(theme.palette.common.black, 0.2),
        transition: 'background-color 0.2s, border-color 0.2s',
        '&:hover': simple
          ? { bgcolor: alpha(theme.palette.primary.main, selected ? 0.18 : 0.08) }
          : {
              borderColor: selected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.5),
            },
      }}
    >
      {imgError ? (
        <Box
          sx={{
            width: '100%',
            height: 72,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.common.black, 0.3)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <MapIcon
            sx={{
              fontSize: 28,
              color: selected
                ? alpha(theme.palette.primary.main, 0.75)
                : alpha(theme.palette.text.secondary, 0.5),
            }}
          />
        </Box>
      ) : (
        <Box
          component="img"
          src={preview}
          alt={label}
          onError={handleImgError}
          sx={{
            width: '100%',
            height: 72,
            flexShrink: 0,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}
      <Typography
        variant="caption"
        align="center"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 44,
          py: 0.5,
          px: 0.5,
          fontSize: '0.7rem',
          fontWeight: selected ? 600 : 500,
          lineHeight: 1.25,
          color: selected ? 'primary.light' : 'text.secondary',
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

export default MapStyleCard
