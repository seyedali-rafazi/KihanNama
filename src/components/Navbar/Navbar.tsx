import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { alpha, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import { useLanguage } from '../../context/LanguageContext'
import type { Language } from '../../i18n/translations'
import { NAVBAR_HEIGHT } from '../../theme/theme'

const navItems = [
  { to: '/', key: 'home' as const },
  { to: '/satellites', key: 'satellites' as const },
  { to: '/launchers', key: 'launchers' as const },
  { to: '/satellite-station', key: 'satelliteStation' as const },
]

const DRAWER_BG = '#000000'

function getLanguageLabel(value: Language, t: (key: 'english' | 'persian') => string) {
  return value === 'en' ? t('english') : t('persian')
}

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t, dir } = useLanguage()
  const theme = useTheme()

  return (
    <Box
      dir={dir}
      className="language-select"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: compact ? 'stretch' : undefined,
        gap: 0.75,
        width: compact ? '100%' : 'auto',
        direction: dir,
      }}
    >
      {!compact && <LanguageIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />}
      <FormControl
        size="small"
        sx={{
          width: compact ? '100%' : 'auto',
          minWidth: compact ? 0 : 120,
          flex: compact ? 1 : undefined,
        }}
      >
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          dir={dir}
          MenuProps={{
            slotProps: {
              paper: {
                dir,
                sx: { direction: dir },
              },
            },
          }}
          renderValue={(value) => (
            <Box
              component="span"
              style={{
                display: 'block',
                width: '100%',
                textAlign: dir === 'rtl' ? 'right' : 'left',
              }}
            >
              {getLanguageLabel(value as Language, t)}
            </Box>
          )}
          sx={{
            width: '100%',
            fontSize: '0.85rem',
            color: 'text.primary',
            bgcolor: alpha(theme.palette.common.white, 0.04),
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            direction: dir,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.07) },
            '& .MuiSelect-select': {
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <MenuItem
            value="en"
            style={{ textAlign: dir === 'rtl' ? 'right' : 'left', direction: dir }}
          >
            {t('english')}
          </MenuItem>
          <MenuItem
            value="fa"
            style={{ textAlign: dir === 'rtl' ? 'right' : 'left', direction: dir }}
          >
            {t('persian')}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

function SiteLogo({ brand, onClick }: { brand: string; onClick?: () => void }) {
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
        src="/favicon-32.png?v=3"
        alt=""
        sx={{
          width: 36,
          height: 36,
          transition: 'transform 0.2s ease',
          flexShrink: 0,
          display: 'block',
          borderRadius: '8px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.35)',
          border: '1px solid rgba(142,180,220,0.25)',
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

function Navbar() {
  const { t, dir } = useLanguage()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = () => setDrawerOpen(false)

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
                onClick={() => setDrawerOpen(true)}
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

              <Box
                sx={{
                  gridColumn: 2,
                  gridRow: 1,
                  justifySelf: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <SiteLogo brand={t('brand')} onClick={closeDrawer} />
              </Box>

              <Box sx={{ gridColumn: 3, gridRow: 1, width: 40 }} />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                {navItems.map((item) => (
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

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '85vw', sm: 300 },
              top: NAVBAR_HEIGHT,
              height: `calc(100% - ${NAVBAR_HEIGHT}px)`,
              bgcolor: DRAWER_BG,
              borderRight: '1px solid',
              borderColor: 'divider',
              direction: theme.direction,
            },
          },
        }}
        ModalProps={{ sx: { top: NAVBAR_HEIGHT } }}
        sx={{
          direction: 'ltr',
          '& .MuiBackdrop-root': { top: NAVBAR_HEIGHT, bgcolor: alpha('#000', 0.75) },
        }}
      >
        <List sx={{ px: 1.5, py: 2 }}>
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
                py: 1.25,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                  color: 'primary.light',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.24) },
                },
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.05) },
              }}
            >
              <ListItemText
                primary={t(item.key)}
                slotProps={{ primary: { sx: { fontWeight: 500, fontSize: '0.95rem' } } }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.08) }} />

        <Box
          dir={dir}
          sx={{
            px: 2,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            direction: dir,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
            sx={{ mb: 1.25, display: 'block', fontWeight: 500, width: '100%' }}
          >
            {t('language')}
          </Typography>
          <LanguageSwitcher compact />
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar
