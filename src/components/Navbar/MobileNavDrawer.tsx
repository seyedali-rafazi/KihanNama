import { NavLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import { NAVBAR_HEIGHT } from '../../theme/theme'
import { DRAWER_BG, NAV_ITEMS } from './navConstants'
import LanguageSwitcher from './LanguageSwitcher'

type MobileNavDrawerProps = {
  open: boolean
  onClose: () => void
  currentPath: string
}

export function MobileNavDrawer({ open, onClose, currentPath }: MobileNavDrawerProps) {
  const { t, dir } = useLanguage()
  const theme = useTheme()

  const isActive = (path: string) =>
    path === '/' ? currentPath === '/' : currentPath.startsWith(path)

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
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
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={isActive(item.to)}
            onClick={onClose}
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
  )
}

export default MobileNavDrawer
