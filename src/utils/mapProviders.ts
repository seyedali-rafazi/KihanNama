import {
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
        const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY
        const url = cartoApiKey
          ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?api_key=${cartoApiKey}`
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

        const provider = new UrlTemplateImageryProvider({
          url,
          subdomains: ['a', 'b', 'c', 'd'],
          maximumLevel: 19,
          credit: '© OpenStreetMap contributors, © CARTO',
        })
        if (viewer.isDestroyed()) return
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(provider)
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

