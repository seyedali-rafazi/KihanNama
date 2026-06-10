import type { MapType } from '../types/globe'

export type MapStyleOption = {
  type: MapType
  labelKey: 'mapDark' | 'mapSatellite' | 'mapStreet'
  preview: string
}

export const MAP_STYLE_OPTIONS: MapStyleOption[] = [
  {
    type: 'dark',
    labelKey: 'mapDark',
    preview: 'https://basemaps.cartocdn.com/dark_all/3/4/2.png',
  },
  {
    type: 'satellite',
    labelKey: 'mapSatellite',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/3/3/4',
  },
  {
    type: 'street',
    labelKey: 'mapStreet',
    preview: 'https://tile.openstreetmap.org/3/4/2.png',
  },
]
