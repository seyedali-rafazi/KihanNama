import {
  ArcGisMapServerImageryProvider,
  OpenStreetMapImageryProvider,
  UrlTemplateImageryProvider,
  type Viewer,
} from 'cesium'
import type { MapType } from '../types/globe'

export async function applyMapType(viewer: Viewer, mapType: MapType) {
  viewer.imageryLayers.removeAll()

  switch (mapType) {
    case 'dark':
      viewer.imageryLayers.addImageryProvider(
        new UrlTemplateImageryProvider({
          url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          credit: 'CartoDB',
        }),
      )
      break
    case 'satellite':
      viewer.imageryLayers.addImageryProvider(
        await ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        ),
      )
      break
    case 'street':
      viewer.imageryLayers.addImageryProvider(
        new OpenStreetMapImageryProvider({
          url: 'https://tile.openstreetmap.org/',
        }),
      )
      break
  }
}
