import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { Viewer, Globe, CzmlDataSource } from 'resium'
import {
  BoundingSphere,
  Cartesian3,
  HeadingPitchRange,
  Math as CesiumMath,
  NearFarScalar,
} from 'cesium'
import type { CesiumComponentRef } from 'resium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import { generateSatellitesCzml } from '../../data/generateSatellitesCzml'
import { SATELLITES } from '../../data/satellites'
import { applyMapType } from '../../utils/mapProviders'
import { createSatelliteBillboardCanvas, SATELLITE_BILLBOARD_DISPLAY_SIZE } from '../../utils/satelliteBillboard'
import { DEFAULT_ORBIT_SETTINGS, type MapType, type OrbitSettings } from '../../types/globe'
import GlobeControlPanel from './GlobeControlPanel'
import GlobeMapControls from './GlobeMapControls'
import { useLoading } from '../../context/LoadingContext'

const initialVisibility = Object.fromEntries(SATELLITES.map((s) => [s.id, true]))

function getDataSource(viewer: CesiumViewer, ref: CesiumCzmlDataSource | null) {
  if (ref) return ref
  for (let i = viewer.dataSources.length - 1; i >= 0; i--) {
    const source = viewer.dataSources.get(i)
    if (source instanceof Object && 'entities' in source) {
      return source as CesiumCzmlDataSource
    }
  }
  return null
}

function applyOrbitRendering(dataSource: CesiumCzmlDataSource, pathWidth: number) {
  for (const sat of SATELLITES) {
    const orbitEntity = dataSource.entities.getById(`${sat.id}-orbit`)
    if (!orbitEntity?.polyline) continue

    orbitEntity.polyline.width = pathWidth as unknown as typeof orbitEntity.polyline.width
  }
}

async function applySatelliteBillboards(dataSource: CesiumCzmlDataSource) {
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
      entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY as unknown as typeof entity.billboard.disableDepthTestDistance

      if (entity.label) {
        entity.label.scale = 0.9 as unknown as typeof entity.label.scale
        entity.label.scaleByDistance = new NearFarScalar(
          8e5,
          0.9,
          2.8e7,
          0.55,
        ) as unknown as typeof entity.label.scaleByDistance
        entity.label.disableDepthTestDistance = Number.POSITIVE_INFINITY as unknown as typeof entity.label.disableDepthTestDistance
      }
    }),
  )
}

function applyEntitySettings(
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
      if (satEntity.label) {
        satEntity.label.show = settings.showLabels as unknown as typeof satEntity.label.show
      }
    }
  }
}

function GlobeViewer() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null)
  const dataSourceRef = useRef<CesiumCzmlDataSource | null>(null)
  const { markReady } = useLoading()
  const [mapType, setMapType] = useState<MapType>('dark')
  const [settings, setSettings] = useState<OrbitSettings>(DEFAULT_ORBIT_SETTINGS)
  const [visibility, setVisibility] = useState<Record<string, boolean>>(initialVisibility)

  const czmlData = useMemo(() => generateSatellitesCzml(settings), [])

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 2)
    viewer.scene.globe.maximumScreenSpaceError = 1.5
    if (viewer.scene.postProcessStages.fxaa) {
      viewer.scene.postProcessStages.fxaa.enabled = true
    }

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(0, 20, 25_000_000),
    })
  }, [])

  useEffect(() => {
    let raf = 0
    let marked = false

    const waitForViewer = () => {
      const viewer = viewerRef.current?.cesiumElement
      if (viewer && !marked) {
        marked = true
        applyMapType(viewer, mapType)
        markReady('map')
        return
      }
      raf = requestAnimationFrame(waitForViewer)
    }

    waitForViewer()
    return () => cancelAnimationFrame(raf)
  }, [markReady])

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return
    applyMapType(viewer, mapType)
  }, [mapType])

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    const dataSource = dataSourceRef.current
    if (viewer) viewer.clock.multiplier = settings.animationSpeed
    if (dataSource) applyEntitySettings(dataSource, settings, visibility)
  }, [settings, visibility])

  const handleCzmlLoad = useCallback((dataSource: CesiumCzmlDataSource) => {
    dataSourceRef.current = dataSource
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    viewer.clock.shouldAnimate = true
    viewer.clock.multiplier = settings.animationSpeed
    applyEntitySettings(dataSource, settings, visibility)
    applyOrbitRendering(dataSource, settings.pathWidth)

    void applySatelliteBillboards(dataSource).then(() => {
      markReady('satellites')
    })
  }, [settings, visibility, markReady])

  const handleToggleVisibility = (id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleZoomToSatellite = (id: string) => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    const dataSource = getDataSource(viewer, dataSourceRef.current)
    if (!dataSource) return

    const entity = dataSource.entities.getById(id)
    if (!entity?.position) return

    const sat = SATELLITES.find((s) => s.id === id)
    const time = viewer.clock.currentTime
    const position = entity.position.getValue(time, new Cartesian3())
    if (!position || Cartesian3.equals(position, Cartesian3.ZERO)) return

    if (!visibility[id]) {
      setVisibility((prev) => ({ ...prev, [id]: true }))
    }

    const cameraRange = Math.max((sat?.altitude ?? 500_000) * 3, 2_000_000)

    viewer.camera.flyToBoundingSphere(new BoundingSphere(position, 1), {
      duration: 1.5,
      offset: new HeadingPitchRange(
        0,
        CesiumMath.toRadians(-40),
        cameraRange,
      ),
    })
  }

  const handleSettingsChange = (partial: Partial<OrbitSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', bgcolor: '#000' }}>
      <Viewer
        ref={viewerRef}
        style={{ width: '100%', height: '100%' }}
        full={false}
        animation={false}
        baseLayerPicker={false}
        fullscreenButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        timeline={false}
        navigationHelpButton={false}
        vrButton={false}
        scene3DOnly
      >
        <Globe enableLighting />
        <CzmlDataSource data={czmlData} onLoad={handleCzmlLoad} />
      </Viewer>

      <GlobeControlPanel
        visibility={visibility}
        mapType={mapType}
        settings={settings}
        onToggleVisibility={handleToggleVisibility}
        onZoomToSatellite={handleZoomToSatellite}
        onMapTypeChange={setMapType}
        onSettingsChange={handleSettingsChange}
      />

      <GlobeMapControls viewerRef={viewerRef} />
    </Box>
  )
}

export default GlobeViewer
