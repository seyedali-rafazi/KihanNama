import { useMemo, type ReactNode } from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles'

const globeUiCache = createCache({ key: 'globeui' })

type GlobeUiLayerProps = {
  children: ReactNode
}

function GlobeUiLayer({ children }: GlobeUiLayerProps) {
  const theme = useTheme()
  const ltrTheme = useMemo(() => createTheme({ ...theme, direction: 'ltr' }), [theme])

  return (
    <CacheProvider value={globeUiCache}>
      <ThemeProvider theme={ltrTheme}>
        <span dir="ltr" style={{ display: 'contents' }}>
          {children}
        </span>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default GlobeUiLayer
