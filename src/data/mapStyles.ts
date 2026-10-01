import type { MapType } from '../types/globe'

export type MapStyleOption = {
  type: MapType
  labelKey: 'mapDark' | 'mapSatellite' | 'mapStreet'
  preview: string
}

export const MAP_STYLE_OPTIONS: MapStyleOption[] = [
  {
    type: 'satellite',
    labelKey: 'mapSatellite',
    preview: 'https://mt1.google.com/vt/lyrs=s&x=4&y=2&z=3',
  },
  {
    type: 'dark',
    labelKey: 'mapDark',
    preview: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/3/3/4',
  },
  {
    type: 'street',
    labelKey: 'mapStreet',
    preview: 'https://tile.openstreetmap.org/3/4/2.png',
  },
]

