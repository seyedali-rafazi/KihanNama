import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { CatalogImageType } from '../../types/common'
import ImagePlaceholder from './ImagePlaceholder'

type FallbackImageProps = {
  src?: string | null
  alt: string
  placeholderType: CatalogImageType
  accentColor: string
  compact?: boolean
  sx?: SxProps<Theme>
}

function FallbackImage({ src, alt, placeholderType, accentColor, compact, sx }: FallbackImageProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(() => !src?.trim())

  useEffect(() => {
    setShowPlaceholder(!src?.trim())
  }, [src])

  if (showPlaceholder) {
    return (
      <ImagePlaceholder
        type={placeholderType}
        name={alt}
        accentColor={accentColor}
        compact={compact}
        sx={sx}
      />
    )
  }

  return (
    <Box
      component="img"
      src={src!}
      alt={alt}
      onError={() => setShowPlaceholder(true)}
      sx={sx}
    />
  )
}

export default FallbackImage
