import { useCallback, useEffect, useState } from 'react'
import {
  Cartesian2,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { isSatelliteEntityId } from '../../utils/satelliteTelemetry'

type UseSatelliteInteractionsOptions = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
  dataSourceRef: React.RefObject<CesiumCzmlDataSource | null>
  onZoomToSatellite: (id: string) => void
  ready: boolean
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

      if (entity && typeof entity === 'object' && 'id' in entity && isSatelliteEntityId(entity.id as string)) {
        setHoveredSatelliteId(entity.id as string)
        return
      }

      setHoveredSatelliteId(null)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((click: { position: Cartesian2 }) => {
      const picked = viewer.scene.pick(click.position)
      const entity = picked?.id

      if (entity && typeof entity === 'object' && 'id' in entity && isSatelliteEntityId(entity.id as string)) {
        const id = entity.id as string
        setPinnedSatelliteId(id)
        onZoomToSatellite(id)
        return
      }

      clearPinnedSatellite()
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    handler.setInputAction((click: { position: Cartesian2 }) => {
      const picked = viewer.scene.pick(click.position)
      const entity = picked?.id

      if (!entity || typeof entity !== 'object' || !('id' in entity) || !isSatelliteEntityId(entity.id as string)) {
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
