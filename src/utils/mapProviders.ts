import {
  ArcGisMapServerImageryProvider,
  OpenStreetMapImageryProvider,
  UrlTemplateImageryProvider,
  type Viewer,
} from 'cesium'
import type { MapType } from '../types/globe'

export async function applyMapType(viewer: Viewer, mapType: MapType) {
  if (!viewer || viewer.isDestroyed()) return

  switch (mapType) {
    case 'dark': {
      const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY

      if (cartoApiKey) {
        const provider = new UrlTemplateImageryProvider({
          url: `https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?api_key=${cartoApiKey}`,
          credit: 'CartoDB',
        })
        if (viewer.isDestroyed()) return
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(provider)
      } else {
        // High-quality ArcGIS Dark Gray Canvas (watermark-free, no API key required)
        const baseProvider = await ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
        )
        if (viewer.isDestroyed()) return
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(baseProvider)

        const refProvider = await ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer',
        )
        if (viewer.isDestroyed()) return
        viewer.imageryLayers.addImageryProvider(refProvider)
      }
      break
    }
    case 'satellite': {
      const provider = await ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      )
      if (viewer.isDestroyed()) return
      viewer.imageryLayers.removeAll()
      viewer.imageryLayers.addImageryProvider(provider)
      break
    }
    case 'street': {
      const provider = new OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
      })
      if (viewer.isDestroyed()) return
      viewer.imageryLayers.removeAll()
      viewer.imageryLayers.addImageryProvider(provider)
      break
    }
  }
}
