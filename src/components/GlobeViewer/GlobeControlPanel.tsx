import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import MapIcon from '@mui/icons-material/Map'
import TuneIcon from '@mui/icons-material/Tune'
import { useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { MapType, OrbitSettings } from '../../types/globe'
import { getGlassAccordionSx, getGlassSummarySx } from './controls/controlPanelStyles'
import SatellitesPanelContent from './controls/SatellitesPanelContent'
import MapPanelContent from './controls/MapPanelContent'
import SettingsPanelContent from './controls/SettingsPanelContent'
import GlobeControlMobileNav, { type PanelSection } from './controls/GlobeControlMobileNav'

type GlobeControlPanelProps = {
  visibility: Record<string, boolean>
  mapType: MapType
  settings: OrbitSettings
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  onMapTypeChange: (mapType: MapType) => void
  onSettingsChange: (settings: Partial<OrbitSettings>) => void
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

  const glassAccordion = getGlassAccordionSx(theme)
  const glassSummary = getGlassSummarySx(theme)

  const handleAccordionChange = (panel: PanelSection) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  if (isMobile) {
    return (
      <GlobeControlMobileNav
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        visibility={visibility}
        mapType={mapType}
        settings={settings}
        onToggleVisibility={onToggleVisibility}
        onZoomToSatellite={onZoomToSatellite}
        onMapTypeChange={onMapTypeChange}
        onSettingsChange={onSettingsChange}
      />
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
          <SatellitesPanelContent
            visibility={visibility}
            onToggleVisibility={onToggleVisibility}
            onZoomToSatellite={onZoomToSatellite}
            zoomLabel={t('zoomToSatellite')}
          />
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
          <MapPanelContent mapType={mapType} onMapTypeChange={onMapTypeChange} t={t} />
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
          <SettingsPanelContent settings={settings} onSettingsChange={onSettingsChange} t={t} />
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default GlobeControlPanel
