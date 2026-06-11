import type { RefObject } from 'react'
import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  EasingFunction,
  Math as CesiumMath,
  Rectangle,
} from 'cesium'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'

export function getCesiumViewer(
  viewerRef: RefObject<CesiumComponentRef<CesiumViewer> | null>,
): CesiumViewer | null {
  return viewerRef.current?.cesiumElement ?? null
}

export function pickGlobePosition(viewer: CesiumViewer, windowPosition: Cartesian2) {
  const ray = viewer.camera.getPickRay(windowPosition)
  if (!ray) return undefined
  return viewer.scene.globe.pick(ray, viewer.scene)
}

export function flyToRectangle(viewer: CesiumViewer, start: Cartesian3, end: Cartesian3) {
  const cart1 = Cartographic.fromCartesian(start)
  const cart2 = Cartographic.fromCartesian(end)

  const rectangle = Rectangle.fromRadians(
    Math.min(cart1.longitude, cart2.longitude),
    Math.min(cart1.latitude, cart2.latitude),
    Math.max(cart1.longitude, cart2.longitude),
    Math.max(cart1.latitude, cart2.latitude),
  )

  viewer.camera.flyTo({
    destination: rectangle,
    duration: 1,
  })
}

export function resetCameraNorth(viewer: CesiumViewer) {
  const center = viewer.camera.positionCartographic

  viewer.camera.flyTo({
    destination: Cartesian3.fromRadians(center.longitude, center.latitude, center.height),
    orientation: {
      heading: 0,
      pitch: viewer.camera.pitch,
      roll: 0,
    },
    duration: 0.5,
  })
}

export function getCameraHeadingDegrees(viewer: CesiumViewer) {
  return CesiumMath.toDegrees(viewer.camera.heading)
}

export function smoothCameraZoom(viewer: CesiumViewer, zoomIn: boolean) {
  const { camera } = viewer
  const center = camera.positionCartographic
  const height = center.height
  const factor = zoomIn ? 0.65 : 1 / 0.65
  const nextHeight = Math.max(height * factor, 100)

  camera.flyTo({
    destination: Cartesian3.fromRadians(center.longitude, center.latitude, nextHeight),
    orientation: {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    },
    duration: 0.45,
    easingFunction: EasingFunction.QUADRATIC_OUT,
  })
}
