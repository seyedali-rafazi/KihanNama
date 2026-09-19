import { NearFarScalar } from 'cesium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import { createSatelliteBillboardCanvas, SATELLITE_BILLBOARD_DISPLAY_SIZE } from '../../utils/satelliteBillboard'
import type { OrbitSettings, SatelliteInfo } from '../../types/globe'

const billboardCanvasCache = new Map<string, HTMLCanvasElement>()

export function getDataSource(viewer: CesiumViewer, ref: CesiumCzmlDataSource | null): CesiumCzmlDataSource | null {
  if (ref) return ref
  for (let i = viewer.dataSources.length - 1; i >= 0; i--) {
    const source = viewer.dataSources.get(i)
    if (source instanceof Object && 'entities' in source) {
      return source as CesiumCzmlDataSource
    }
  }
  return null
}

export function applyOrbitRendering(dataSource: CesiumCzmlDataSource, pathWidth: number) {
  const entities = dataSource.entities.values
  for (const entity of entities) {
    if (entity.polyline) {
      entity.polyline.width = pathWidth as unknown as typeof entity.polyline.width
    }
  }
}

export async function applySatelliteBillboards(dataSource: CesiumCzmlDataSource) {
  const entities = dataSource.entities.values
  await Promise.all(
    entities.map(async (entity) => {
      if (!entity?.billboard || entity.id.endsWith('-orbit')) return

      const entityId = entity.id
      const entityName = entity.name || entityId
      const cacheKey = entityId

      let canvas = billboardCanvasCache.get(cacheKey)
      if (!canvas) {
        const satPlaceholder: SatelliteInfo = {
          id: entityId,
          name: entityName,
          altitude: 500_000,
          inclination: 51.6,
          raan: 0,
          phase: 0,
          period: 5500,
          color: [0, 229, 255, 255],
          image: '',
        }
        canvas = await createSatelliteBillboardCanvas(satPlaceholder)
        billboardCanvasCache.set(cacheKey, canvas)
      }

      entity.billboard.image = canvas as unknown as typeof entity.billboard.image
      entity.billboard.width = SATELLITE_BILLBOARD_DISPLAY_SIZE as unknown as typeof entity.billboard.width
      entity.billboard.height = SATELLITE_BILLBOARD_DISPLAY_SIZE as unknown as typeof entity.billboard.height
      entity.billboard.scale = 1 as unknown as typeof entity.billboard.scale
      entity.billboard.scaleByDistance = new NearFarScalar(
        8e5,
        1.0,
        2.8e7,
        0.5,
      ) as unknown as typeof entity.billboard.scaleByDistance
      entity.billboard.disableDepthTestDistance = 0 as unknown as typeof entity.billboard.disableDepthTestDistance

      if (entity.label) {
        entity.label.scale = 0.9 as unknown as typeof entity.label.scale
        entity.label.scaleByDistance = new NearFarScalar(
          8e5,
          0.9,
          2.8e7,
          0.55,
        ) as unknown as typeof entity.label.scaleByDistance
        entity.label.disableDepthTestDistance = 0 as unknown as typeof entity.label.disableDepthTestDistance
      }
    }),
  )
}

export function applyEntitySettings(
  dataSource: CesiumCzmlDataSource,
  settings: OrbitSettings,
  visibility: Record<string, boolean>,
) {
  const entities = dataSource.entities.values
  for (const entity of entities) {
    if (entity.polyline) {
      const parentId = entity.id.replace(/-orbit$/, '')
      const visible = Boolean(visibility[parentId] ?? visibility[entity.id])
      entity.polyline.width = settings.pathWidth as unknown as typeof entity.polyline.width
      entity.show = visible && settings.showOrbits
    }

    if (entity.billboard || (entity.position && !entity.id.endsWith('-orbit'))) {
      const visible = Boolean(visibility[entity.id])
      entity.show = visible
      if (entity.billboard) {
        entity.billboard.disableDepthTestDistance = 0 as unknown as typeof entity.billboard.disableDepthTestDistance
      }
      if (entity.label) {
        entity.label.show = settings.showLabels as unknown as typeof entity.label.show
        entity.label.disableDepthTestDistance = 0 as unknown as typeof entity.label.disableDepthTestDistance
      }
    }
  }
}
