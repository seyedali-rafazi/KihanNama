import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import type { OrbitSettings } from '../../../types/globe'
import type { TranslationKey } from '../../../i18n/translations'

type SettingsPanelContentProps = {
  settings: OrbitSettings
  onSettingsChange: (settings: Partial<OrbitSettings>) => void
  t: (key: TranslationKey) => string
}

export function SettingsPanelContent({
  settings,
  onSettingsChange,
  t,
}: SettingsPanelContentProps) {
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

export default SettingsPanelContent
