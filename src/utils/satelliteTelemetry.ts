import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  HeadingPitchRange,
  JulianDate,
  Math as CesiumMath,
} from 'cesium'
import type { Entity, Scene, Viewer as CesiumViewer } from 'cesium'

export type SatelliteTelemetry = {
  lat: number
  lon: number
  altitude: number
  speed: number
}

export function isSatelliteEntityId(id: string | undefined): id is string {
  return Boolean(id && !id.endsWith('-orbit'))
}

export function getSatelliteTelemetry(
  entity: Entity,
  time: JulianDate,
): SatelliteTelemetry | null {
  if (!entity.position) return null

  const position = entity.position.getValue(time, new Cartesian3())
  if (!position || Cartesian3.equals(position, Cartesian3.ZERO)) return null

  const cartographic = Cartographic.fromCartesian(position)
  const nextTime = JulianDate.addSeconds(time, 1, new JulianDate())
  const nextPosition = entity.position.getValue(nextTime, new Cartesian3())

  let speed = 0
  if (nextPosition && !Cartesian3.equals(nextPosition, Cartesian3.ZERO)) {
    speed = Cartesian3.distance(position, nextPosition)
  }

  return {
    lat: CesiumMath.toDegrees(cartographic.latitude),
    lon: CesiumMath.toDegrees(cartographic.longitude),
    altitude: cartographic.height,
    speed,
  }
}

export function getEntityScreenPosition(
  scene: Scene,
  entity: Entity,
  time: JulianDate,
): Cartesian2 | null {
  if (!entity.position) return null

  const position = entity.position.getValue(time, new Cartesian3())
  if (!position) return null

  const canvasPosition = scene.cartesianToCanvasCoordinates(position, new Cartesian2())
  if (!canvasPosition) return null

  return canvasPosition
}

export async function flyToSatelliteEntity(
  viewer: CesiumViewer,
  entity: Entity,
  satelliteAltitude = 500_000,
  rangeMultiplier = 1,
) {
  viewer.trackedEntity = undefined
  viewer.selectedEntity = entity

  const cameraRange = Math.max(satelliteAltitude * 3 * rangeMultiplier, 2_000_000 * rangeMultiplier)

  await viewer.flyTo(entity, {
    duration: 1.5,
    offset: new HeadingPitchRange(
      0,
      CesiumMath.toRadians(-40),
      cameraRange,
    ),
  })

  viewer.trackedEntity = entity
}

export function formatCoordinate(value: number) {
  return `${value.toFixed(2)}°`
}

export function formatAltitude(meters: number) {
  if (meters >= 1_000_000) return `${(meters / 1_000_000).toFixed(2)} Mm`
  if (meters >= 10_000) return `${(meters / 1_000).toFixed(0)} km`
  return `${(meters / 1_000).toFixed(1)} km`
}

export function formatSpeed(metersPerSecond: number) {
  return `${(metersPerSecond / 1_000).toFixed(2)} km/s`
}
