import { NearFarScalar } from 'cesium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import { SATELLITES } from '../../data/satellites'
import { createSatelliteBillboardCanvas, SATELLITE_BILLBOARD_DISPLAY_SIZE } from '../../utils/satelliteBillboard'
import type { OrbitSettings } from '../../types/globe'

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
  for (const sat of SATELLITES) {
    const orbitEntity = dataSource.entities.getById(`${sat.id}-orbit`)
    if (!orbitEntity?.polyline) continue

    orbitEntity.polyline.width = pathWidth as unknown as typeof orbitEntity.polyline.width
  }
}

export async function applySatelliteBillboards(dataSource: CesiumCzmlDataSource) {
  await Promise.all(
    SATELLITES.map(async (sat) => {
      const entity = dataSource.entities.getById(sat.id)
      if (!entity?.billboard) return

      const canvas = await createSatelliteBillboardCanvas(sat)
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
  for (const sat of SATELLITES) {
    const visible = visibility[sat.id] ?? true
    const orbitEntity = dataSource.entities.getById(`${sat.id}-orbit`)
    const satEntity = dataSource.entities.getById(sat.id)

    if (orbitEntity?.polyline) {
      orbitEntity.polyline.width = settings.pathWidth as unknown as typeof orbitEntity.polyline.width
      orbitEntity.show = visible && settings.showOrbits
    }

    if (satEntity) {
      satEntity.show = visible
      if (satEntity.billboard) {
        satEntity.billboard.disableDepthTestDistance = 0 as unknown as typeof satEntity.billboard.disableDepthTestDistance
      }
      if (satEntity.label) {
        satEntity.label.show = settings.showLabels as unknown as typeof satEntity.label.show
        satEntity.label.disableDepthTestDistance = 0 as unknown as typeof satEntity.label.disableDepthTestDistance
      }
    }
  }
}
