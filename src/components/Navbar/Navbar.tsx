import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { alpha, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import PublicIcon from '@mui/icons-material/Public'
import { useLanguage } from '../../context/LanguageContext'
import type { Language } from '../../i18n/translations'
import { NAVBAR_HEIGHT } from '../../theme/theme'

const navItems = [
  { to: '/', key: 'home' as const },
  { to: '/satellites', key: 'satellites' as const },
  { to: '/launchers', key: 'launchers' as const },
  { to: '/satellite-station', key: 'satelliteStation' as const },
]

function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: Language | null) => {
    if (value) setLanguage(value)
  }

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={handleChange}
      size="small"
      aria-label={t('language')}
      sx={{
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        '& .MuiToggleButton-root': {
          border: 'none',
          px: 1.5,
          py: 0.5,
          fontSize: '0.85rem',
          color: 'text.secondary',
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'text.primary',
            '&:hover': { bgcolor: 'primary.main', filter: 'brightness(1.1)' },
          },
        },
      }}
    >
      <ToggleButton value="en">{t('english')}</ToggleButton>
      <ToggleButton value="fa">{t('persian')}</ToggleButton>
    </ToggleButtonGroup>
  )
}

function Navbar() {
  const { t } = useLanguage()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = () => setDrawerOpen(false)

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const navButtonSx = (path: string) => ({
    color: isActive(path) ? 'primary.main' : 'text.secondary',
    bgcolor: isActive(path) ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
    fontWeight: isActive(path) ? 600 : 500,
    '&:hover': {
      color: 'text.primary',
      bgcolor: alpha(theme.palette.primary.main, 0.1),
    },
  })

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ height: NAVBAR_HEIGHT }}>
        <Toolbar
          sx={{
            height: NAVBAR_HEIGHT,
            minHeight: `${NAVBAR_HEIGHT}px !important`,
            maxWidth: 1400,
            width: '100%',
            mx: 'auto',
            px: { xs: 1, sm: 2 },
            display: 'grid',
            gridTemplateColumns: isMobile ? 'auto 1fr' : '1fr auto 1fr',
            gap: 2,
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{
                gridColumn: 1,
                gridRow: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.default',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={navButtonSx(item.to)}
                >
                  {t(item.key)}
                </Button>
              ))}
            </Box>
          )}

          <Box
            component={NavLink}
            to="/"
            onClick={closeDrawer}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'text.primary',
              gridColumn: isMobile ? '1 / -1' : 2,
              gridRow: 1,
              justifySelf: 'center',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <PublicIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {t('brand')}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LanguageSwitcher />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '85vw', sm: 300 },
              top: NAVBAR_HEIGHT,
              height: `calc(100% - ${NAVBAR_HEIGHT}px)`,
            },
          },
        }}
        ModalProps={{ sx: { top: NAVBAR_HEIGHT } }}
        sx={{ '& .MuiBackdrop-root': { top: NAVBAR_HEIGHT } }}
      >
        <List sx={{ px: 1, py: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={isActive(item.to)}
              onClick={closeDrawer}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                },
              }}
            >
              <ListItemText
                primary={t(item.key)}
                slotProps={{ primary: { sx: { fontWeight: 500 } } }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('language')}
          </Typography>
          <LanguageSwitcher />
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar
