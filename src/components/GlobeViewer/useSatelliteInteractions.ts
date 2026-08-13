import { useCallback, useEffect, useState } from 'react'
import {
  Cartesian2,
  Cartesian3,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { isPositionVisibleOnGlobe, isSatelliteEntityId } from '../../utils/satelliteTelemetry'

type UseSatelliteInteractionsOptions = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
  dataSourceRef: React.RefObject<CesiumCzmlDataSource | null>
  onZoomToSatellite: (id: string) => void
  ready: boolean
}

function isEntityVisible(viewer: CesiumViewer, entity: unknown): boolean {
  if (!entity || typeof entity !== 'object' || !('id' in entity)) return false
  const id = (entity as { id: unknown }).id
  if (typeof id !== 'string' || !isSatelliteEntityId(id)) return false

  const posProperty = (entity as { position?: { getValue: (time: unknown, result?: Cartesian3) => Cartesian3 | undefined } }).position
  if (posProperty && typeof posProperty.getValue === 'function') {
    const pos = posProperty.getValue(viewer.clock.currentTime, new Cartesian3())
    if (pos && !isPositionVisibleOnGlobe(viewer.scene, pos)) {
      return false
    }
  }
  return true
}

export function useSatelliteInteractions({
  viewerRef,
  dataSourceRef,
  onZoomToSatellite,
  ready,
}: UseSatelliteInteractionsOptions) {
  const [hoveredSatelliteId, setHoveredSatelliteId] = useState<string | null>(null)
  const [pinnedSatelliteId, setPinnedSatelliteId] = useState<string | null>(null)

  const pinSatellite = useCallback((id: string) => {
    setPinnedSatelliteId(id)
  }, [])

  const clearPinnedSatellite = useCallback(() => {
    setPinnedSatelliteId(null)
    const viewer = viewerRef.current?.cesiumElement
    if (viewer) {
      viewer.trackedEntity = undefined
      viewer.selectedEntity = undefined
    }
  }, [viewerRef])

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer || !ready) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    handler.setInputAction((movement: { endPosition: Cartesian2 }) => {
      const picked = viewer.scene.pick(movement.endPosition)
      const entity = picked?.id

      if (isEntityVisible(viewer, entity)) {
        setHoveredSatelliteId((entity as { id: string }).id)
        return
      }

      setHoveredSatelliteId(null)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((click: { position: Cartesian2 }) => {
      const picked = viewer.scene.pick(click.position)
      const entity = picked?.id

      if (isEntityVisible(viewer, entity)) {
        const id = (entity as { id: string }).id
        setPinnedSatelliteId(id)
        onZoomToSatellite(id)
        return
      }

      clearPinnedSatellite()
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    handler.setInputAction((click: { position: Cartesian2 }) => {
      const picked = viewer.scene.pick(click.position)
      const entity = picked?.id

      if (!isEntityVisible(viewer, entity)) {
        clearPinnedSatellite()
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    return () => {
      handler.destroy()
    }
  }, [viewerRef, dataSourceRef, onZoomToSatellite, clearPinnedSatellite, ready])

  const activeBadgeId = pinnedSatelliteId ?? hoveredSatelliteId

  return {
    hoveredSatelliteId,
    pinnedSatelliteId,
    activeBadgeId,
    pinSatellite,
    clearPinnedSatellite,
  }
}
