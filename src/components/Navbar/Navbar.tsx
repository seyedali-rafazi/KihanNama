import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { alpha, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { useLanguage } from '../../context/LanguageContext'
import { NAVBAR_HEIGHT } from '../../theme/theme'
import { NAV_ITEMS } from './navConstants'
import LanguageSwitcher from './LanguageSwitcher'
import SiteLogo from './SiteLogo'
import MobileNavDrawer from './MobileNavDrawer'

function Navbar() {
  const { t } = useLanguage()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = () => setDrawerOpen(false)
  const openDrawer = () => setDrawerOpen(true)

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const navLinkSx = (path: string) => ({
    px: 1.75,
    py: 0.75,
    borderRadius: 1.5,
    fontSize: '0.875rem',
    fontWeight: isActive(path) ? 600 : 500,
    color: isActive(path) ? 'primary.light' : 'text.secondary',
    textDecoration: 'none',
    position: 'relative' as const,
    transition: 'color 0.2s',
    '&:hover': { color: 'text.primary' },
    ...(isActive(path) && {
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 2,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: 2,
        borderRadius: 1,
        bgcolor: 'primary.main',
      },
    }),
  })

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: NAVBAR_HEIGHT,
          bgcolor: alpha('#0a0c0e', 0.92),
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Toolbar
          sx={{
            height: NAVBAR_HEIGHT,
            minHeight: `${NAVBAR_HEIGHT}px !important`,
            maxWidth: 1400,
            width: '100%',
            mx: 'auto',
            px: { xs: 1.5, sm: 2.5 },
            display: isMobile ? 'grid' : 'flex',
            gridTemplateColumns: isMobile ? '40px 1fr 40px' : undefined,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            direction: isMobile ? 'ltr' : undefined,
          }}
        >
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={openDrawer}
                sx={{
                  gridColumn: 1,
                  gridRow: 1,
                  justifySelf: 'start',
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.common.white, 0.06) },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ gridColumn: 2, gridRow: 1, justifySelf: 'center', display: 'flex', justifyContent: 'center' }}>
                <SiteLogo brand={t('brand')} onClick={closeDrawer} />
              </Box>

              <Box sx={{ gridColumn: 3, gridRow: 1, width: 40 }} />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                {NAV_ITEMS.map((item) => (
                  <Box key={item.to} component={NavLink} to={item.to} sx={navLinkSx(item.to)}>
                    {t(item.key)}
                  </Box>
                ))}
              </Box>

              <SiteLogo brand={t('brand')} onClick={closeDrawer} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                <LanguageSwitcher />
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <MobileNavDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        currentPath={location.pathname}
      />
    </>
  )
}

export default Navbar
