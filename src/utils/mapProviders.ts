import {
  ArcGisMapServerImageryProvider,
  OpenStreetMapImageryProvider,
  UrlTemplateImageryProvider,
  type Viewer,
} from 'cesium'
import type { MapType } from '../types/globe'

export async function applyMapType(viewer: Viewer, mapType: MapType) {
  if (!viewer || viewer.isDestroyed()) return

  try {
    switch (mapType) {
      case 'dark': {
        // High-contrast ArcGIS World Dark Gray Canvas with countries, borders, and labels (no API key required)
        const baseProvider = await ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
          { enablePickFeatures: false },
        )
        if (viewer.isDestroyed()) return
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(baseProvider)

        const refProvider = await ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer',
          { enablePickFeatures: false },
        )
        if (viewer.isDestroyed()) return
        viewer.imageryLayers.addImageryProvider(refProvider)
        break
      }
      case 'satellite': {
        // High-resolution Earth satellite imagery without 403 / token restrictions
        const provider = new UrlTemplateImageryProvider({
          url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          subdomains: ['0', '1', '2', '3'],
          maximumLevel: 20,
          credit: 'Google Maps',
        })
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
  } catch (error) {
    console.error(`Failed to apply map style "${mapType}":`, error)
  }
}

