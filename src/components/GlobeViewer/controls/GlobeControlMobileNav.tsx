import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import MapIcon from '@mui/icons-material/Map'
import TuneIcon from '@mui/icons-material/Tune'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../../context/LanguageContext'
import type { TranslationKey } from '../../../i18n/translations'
import type { MapType, OrbitSettings } from '../../../types/globe'
import { getGlassPanelSx } from './controlPanelStyles'
import SatellitesPanelContent from './SatellitesPanelContent'
import MapPanelContent from './MapPanelContent'
import SettingsPanelContent from './SettingsPanelContent'

export type PanelSection = 'satellites' | 'map' | 'settings'

export const PANEL_ITEMS: { id: PanelSection; icon: typeof SatelliteAltIcon; labelKey: 'panelSatellites' | 'panelMap' | 'panelOrbitSettings' }[] = [
  { id: 'satellites', icon: SatelliteAltIcon, labelKey: 'panelSatellites' },
  { id: 'map', icon: MapIcon, labelKey: 'panelMap' },
  { id: 'settings', icon: TuneIcon, labelKey: 'panelOrbitSettings' },
]

type GlobeControlMobileNavProps = {
  mobileOpen: PanelSection | false
  onMobileOpenChange: (section: PanelSection | false) => void
  visibility: Record<string, boolean>
  mapType: MapType
  settings: OrbitSettings
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  onMapTypeChange: (mapType: MapType) => void
  onSettingsChange: (settings: Partial<OrbitSettings>) => void
}

export function GlobeControlMobileNav({
  mobileOpen,
  onMobileOpenChange,
  visibility,
  mapType,
  settings,
  onToggleVisibility,
  onZoomToSatellite,
  onMapTypeChange,
  onSettingsChange,
}: GlobeControlMobileNavProps) {
  const { t } = useLanguage()
  const theme = useTheme()
  const glassPanel = getGlassPanelSx(theme)

  const handleMobileNavClick = (panel: PanelSection) => {
    onMobileOpenChange(mobileOpen === panel ? false : panel)
  }

  const getPanelIcon = (panel: PanelSection) => {
    switch (panel) {
      case 'satellites':
        return SatelliteAltIcon
      case 'map':
        return MapIcon
      case 'settings':
        return TuneIcon
    }
  }

  const getPanelLabel = (panel: PanelSection) => {
    switch (panel) {
      case 'satellites':
        return t('panelSatellites')
      case 'map':
        return t('panelMap')
      case 'settings':
        return t('panelOrbitSettings')
    }
  }

  const renderPanelContent = (panel: PanelSection) => {
    switch (panel) {
      case 'satellites':
        return (
          <SatellitesPanelContent
            visibility={visibility}
            onToggleVisibility={onToggleVisibility}
            onZoomToSatellite={onZoomToSatellite}
            zoomLabel={t('zoomToSatellite')}
            simple
          />
        )
      case 'map':
        return <MapPanelContent mapType={mapType} onMapTypeChange={onMapTypeChange} t={t} simple />
      case 'settings':
        return <SettingsPanelContent settings={settings} onSettingsChange={onSettingsChange} t={t} />
    }
  }

  const activePanel = mobileOpen
  const ActiveIcon = activePanel ? getPanelIcon(activePanel) : null

  return (
    <>
      <Box
        dir="ltr"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 12,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          px: 1,
          py: 0.75,
          pb: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          direction: 'ltr',
          ...glassPanel,
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      >
        {PANEL_ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const isActive = mobileOpen === id
          return (
            <Box
              key={id}
              onClick={() => handleMobileNavClick(id)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.25,
                py: 0.5,
                cursor: 'pointer',
                color: isActive ? 'primary.light' : 'text.secondary',
                transition: 'color 0.2s',
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 600 : 500,
                  lineHeight: 1.2,
                  textAlign: 'center',
                }}
              >
                {t(labelKey as TranslationKey)}
              </Typography>
            </Box>
          )
        })}
      </Box>

      <Drawer
        anchor="bottom"
        open={mobileOpen !== false}
        onClose={() => onMobileOpenChange(false)}
        slotProps={{
          paper: {
            sx: {
              ...glassPanel,
              borderRadius: '20px 20px 0 0',
              maxHeight: '70vh',
              pb: 'calc(72px + env(safe-area-inset-bottom, 0px))',
              direction: 'ltr',
            },
          },
        }}
        sx={{
          zIndex: 11,
          '& .MuiBackdrop-root': {
            bgcolor: alpha(theme.palette.common.black, 0.45),
          },
        }}
      >
        {activePanel && ActiveIcon && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <ActiveIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {getPanelLabel(activePanel)}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => onMobileOpenChange(false)} sx={{ color: 'text.secondary' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: activePanel === 'satellites' ? 0 : 2,
                py: activePanel === 'satellites' ? 0 : 2,
                display: 'flex',
                flexDirection: 'column',
                gap: activePanel === 'settings' ? 2.25 : 0,
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  borderRadius: 4,
                },
              }}
            >
              {renderPanelContent(activePanel)}
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  )
}

export default GlobeControlMobileNav
