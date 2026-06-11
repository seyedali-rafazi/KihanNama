import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import MapIcon from '@mui/icons-material/Map'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import FallbackImage from '../common/FallbackImage'
import type { TranslationKey } from '../../i18n/translations'
import { SATELLITES } from '../../data/satellites'
import { MAP_STYLE_OPTIONS } from '../../data/mapStyles'
import type { MapType, OrbitSettings, SatelliteInfo } from '../../types/globe'

type PanelSection = 'satellites' | 'map' | 'settings'

type GlobeControlPanelProps = {
  visibility: Record<string, boolean>
  mapType: MapType
  settings: OrbitSettings
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  onMapTypeChange: (mapType: MapType) => void
  onSettingsChange: (settings: Partial<OrbitSettings>) => void
}

const PANEL_ITEMS: { id: PanelSection; icon: typeof SatelliteAltIcon; labelKey: 'panelSatellites' | 'panelMap' | 'panelOrbitSettings' }[] = [
  { id: 'satellites', icon: SatelliteAltIcon, labelKey: 'panelSatellites' },
  { id: 'map', icon: MapIcon, labelKey: 'panelMap' },
  { id: 'settings', icon: TuneIcon, labelKey: 'panelOrbitSettings' },
]

function SatelliteRow({
  sat,
  visible,
  onToggleVisibility,
  onZoomToSatellite,
  zoomLabel,
  simple = false,
}: {
  sat: SatelliteInfo
  visible: boolean
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  zoomLabel: string
  simple?: boolean
}) {
  const theme = useTheme()
  const color = `rgb(${sat.color[0]}, ${sat.color[1]}, ${sat.color[2]})`

  return (
    <Box
      dir="ltr"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1.25,
        px: simple ? 2 : 1.25,
        py: 1,
        mx: simple ? 0 : 1,
        mb: simple ? 0 : 1,
        borderRadius: simple ? 0 : '10px',
        border: simple ? 'none' : `1px solid ${alpha(color, 0.35)}`,
        borderBottom: simple ? `1px solid ${theme.palette.divider}` : undefined,
        bgcolor: simple ? 'transparent' : alpha(color, 0.06),
        opacity: visible ? 1 : 0.5,
        transition: simple ? 'opacity 0.2s, background-color 0.2s' : 'opacity 0.2s, border-color 0.2s',
        '&:hover': simple
          ? { bgcolor: alpha(theme.palette.common.white, 0.04) }
          : {
              borderColor: alpha(color, 0.55),
              bgcolor: alpha(color, 0.1),
            },
        '&:last-child': { mb: simple ? 0 : 0.5, borderBottom: simple ? 'none' : undefined },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '8px',
          border: simple ? 'none' : `1.5px solid ${color}`,
          bgcolor: alpha(theme.palette.common.black, 0.35),
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <FallbackImage
          src={sat.image}
          placeholderType="satellite"
          accentColor={color}
          alt={sat.name}
          compact
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Avatar>

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: 600,
          fontSize: '0.82rem',
          color,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {sat.name}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
        <IconButton
          size="small"
          onClick={() => onZoomToSatellite(sat.id)}
          title={zoomLabel}
          sx={{
            width: 28,
            height: 28,
            p: 0.5,
            color,
            borderRadius: 1,
            '&:hover': { bgcolor: alpha(color, 0.15) },
          }}
        >
          <ZoomInIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onToggleVisibility(sat.id)}
          sx={{
            width: 28,
            height: 28,
            p: 0.5,
            color: visible ? color : 'text.disabled',
            borderRadius: 1,
            '&:hover': { bgcolor: alpha(color, 0.15) },
          }}
        >
          {visible ? (
            <VisibilityIcon sx={{ fontSize: 16 }} />
          ) : (
            <VisibilityOffIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>
    </Box>
  )
}

function MapStyleCard({
  preview,
  label,
  selected,
  onClick,
  simple = false,
}: {
  preview: string
  label: string
  selected: boolean
  onClick: () => void
  simple?: boolean
}) {
  const theme = useTheme()

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
      <Box
        component="img"
        src={preview}
        alt={label}
        sx={{
          width: '100%',
          height: 72,
          flexShrink: 0,
          objectFit: 'cover',
          display: 'block',
        }}
      />
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

function SatellitesContent({
  visibility,
  onToggleVisibility,
  onZoomToSatellite,
  zoomLabel,
  simple = false,
}: {
  visibility: Record<string, boolean>
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  zoomLabel: string
  simple?: boolean
}) {
  return (
    <>
      {SATELLITES.map((sat) => (
        <SatelliteRow
          key={sat.id}
          sat={sat}
          visible={visibility[sat.id] ?? true}
          onToggleVisibility={onToggleVisibility}
          onZoomToSatellite={onZoomToSatellite}
          zoomLabel={zoomLabel}
          simple={simple}
        />
      ))}
    </>
  )
}

function MapContent({
  mapType,
  onMapTypeChange,
  t,
  simple = false,
}: {
  mapType: MapType
  onMapTypeChange: (mapType: MapType) => void
  t: (key: TranslationKey) => string
  simple?: boolean
}) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, alignItems: 'stretch' }}>
      {MAP_STYLE_OPTIONS.map((option) => (
        <MapStyleCard
          key={option.type}
          preview={option.preview}
          label={t(option.labelKey)}
          selected={mapType === option.type}
          onClick={() => onMapTypeChange(option.type)}
          simple={simple}
        />
      ))}
    </Box>
  )
}

function SettingsContent({
  settings,
  onSettingsChange,
  t,
}: {
  settings: OrbitSettings
  onSettingsChange: (settings: Partial<OrbitSettings>) => void
  t: (key: TranslationKey) => string
}) {
  return (
    <>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {t('orbitThickness')}: {settings.pathWidth.toFixed(1)}
        </Typography>
        <Slider
          value={settings.pathWidth}
          min={1}
          max={6}
          step={0.5}
          size="small"
          color="primary"
          onChange={(_, value) => onSettingsChange({ pathWidth: value as number })}
          sx={{ '& .MuiSlider-rail': { opacity: 0.2 } }}
        />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          {t('animationSpeed')}: {settings.animationSpeed}x
        </Typography>
        <Slider
          value={settings.animationSpeed}
          min={10}
          max={500}
          step={10}
          size="small"
          color="primary"
          onChange={(_, value) => onSettingsChange({ animationSpeed: value as number })}
          sx={{ '& .MuiSlider-rail': { opacity: 0.2 } }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.8rem' }}>
          {t('showOrbits')}
        </Typography>
        <Switch
          size="small"
          checked={settings.showOrbits}
          onChange={(e) => onSettingsChange({ showOrbits: e.target.checked })}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.8rem' }}>
          {t('showLabels')}
        </Typography>
        <Switch
          size="small"
          checked={settings.showLabels}
          onChange={(e) => onSettingsChange({ showLabels: e.target.checked })}
        />
      </Box>
    </>
  )
}

function GlobeControlPanel({
  visibility,
  mapType,
  settings,
  onToggleVisibility,
  onZoomToSatellite,
  onMapTypeChange,
  onSettingsChange,
}: GlobeControlPanelProps) {
  const { t } = useLanguage()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [expanded, setExpanded] = useState<PanelSection | false>('satellites')
  const [mobileOpen, setMobileOpen] = useState<PanelSection | false>(false)

  const glassPanel = {
    background: alpha(theme.palette.background.paper, 0.72),
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
  }

  const glassAccordion = {
    ...glassPanel,
    borderRadius: '14px !important',
    overflow: 'hidden',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: '0 !important' },
    '& + &': { mt: 1.25 },
  }

  const glassSummary = {
    minHeight: 56,
    px: 2,
    '& .MuiAccordionSummary-content': { my: 1.25, alignItems: 'center' },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.text.secondary,
    },
  }

  const handleAccordionChange = (panel: PanelSection) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleMobileNavClick = (panel: PanelSection) => {
    setMobileOpen((prev) => (prev === panel ? false : panel))
  }

  const renderPanelContent = (panel: PanelSection, simple = false) => {
    switch (panel) {
      case 'satellites':
        return (
          <SatellitesContent
            visibility={visibility}
            onToggleVisibility={onToggleVisibility}
            onZoomToSatellite={onZoomToSatellite}
            zoomLabel={t('zoomToSatellite')}
            simple={simple}
          />
        )
      case 'map':
        return <MapContent mapType={mapType} onMapTypeChange={onMapTypeChange} t={t} simple={simple} />
      case 'settings':
        return <SettingsContent settings={settings} onSettingsChange={onSettingsChange} t={t} />
    }
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

  if (isMobile) {
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
                  {t(labelKey)}
                </Typography>
              </Box>
            )
          })}
        </Box>

        <Drawer
          anchor="bottom"
          open={mobileOpen !== false}
          onClose={() => setMobileOpen(false)}
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
                <IconButton size="small" onClick={() => setMobileOpen(false)} sx={{ color: 'text.secondary' }}>
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
                {renderPanelContent(activePanel, true)}
              </Box>
            </Box>
          )}
        </Drawer>
      </>
    )
  }

  return (
    <Box
      dir="ltr"
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        width: 340,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100% - 32px)',
        overflowY: 'auto',
        direction: 'ltr',
        textAlign: 'left',
        p: 0.5,
        '&::-webkit-scrollbar': { width: 4 },
        
      }}
    >
      <Accordion
        expanded={expanded === 'satellites'}
        onChange={handleAccordionChange('satellites')}
        disableGutters
        elevation={0}
        sx={glassAccordion}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={glassSummary}>
          <SatelliteAltIcon sx={{ mr: 1.25, color: 'primary.light', fontSize: 22 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
            {t('panelSatellites')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, pb: 1, maxHeight: 380, overflowY: 'auto' }}>
          {renderPanelContent('satellites')}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'map'}
        onChange={handleAccordionChange('map')}
        disableGutters
        elevation={0}
        sx={glassAccordion}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={glassSummary}>
          <MapIcon sx={{ mr: 1.25, color: 'primary.light', fontSize: 22 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
            {t('panelMap')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0.5 }}>
          {renderPanelContent('map')}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'settings'}
        onChange={handleAccordionChange('settings')}
        disableGutters
        elevation={0}
        sx={glassAccordion}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={glassSummary}>
          <TuneIcon sx={{ mr: 1.25, color: 'primary.light', fontSize: 22 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
            {t('panelOrbitSettings')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0.5, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          {renderPanelContent('settings')}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default GlobeControlPanel
