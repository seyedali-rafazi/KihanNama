import Box from '@mui/material/Box'
import { MAP_STYLE_OPTIONS } from '../../../data/mapStyles'
import type { MapType } from '../../../types/globe'
import type { TranslationKey } from '../../../i18n/translations'
import MapStyleCard from './MapStyleCard'

type MapPanelContentProps = {
  mapType: MapType
  onMapTypeChange: (mapType: MapType) => void
  t: (key: TranslationKey) => string
  simple?: boolean
}

export function MapPanelContent({
  mapType,
  onMapTypeChange,
  t,
  simple = false,
}: MapPanelContentProps) {
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

export default MapPanelContent
