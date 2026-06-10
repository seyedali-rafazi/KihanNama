import { useMemo } from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { prefixer } from 'stylis'
import rtlPlugin from '@mui/stylis-plugin-rtl'
import { useLanguage } from '../context/LanguageContext'
import { createAppTheme } from './theme'

const cacheLtr = createCache({ key: 'muiltr' })
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage()
  const theme = useMemo(() => createAppTheme(dir), [dir])
  const cache = dir === 'rtl' ? cacheRtl : cacheLtr

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}
