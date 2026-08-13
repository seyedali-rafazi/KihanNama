import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Viewer, Globe, CzmlDataSource } from 'resium'
import { Cartesian3 } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import { generateSatellitesCzml } from '../../data/generateSatellitesCzml'
import { SATELLITES } from '../../data/satellites'
import { applyMapType } from '../../utils/mapProviders'
import { flyToSatelliteEntity } from '../../utils/satelliteTelemetry'
import { DEFAULT_ORBIT_SETTINGS, type MapType, type OrbitSettings } from '../../types/globe'
import { HOME_VIEW, INITIAL_SATELLITE_VISIBILITY } from './globeConstants'
import {
  applyEntitySettings,
  applyOrbitRendering,
  applySatelliteBillboards,
  getDataSource,
} from './globeEntityHelpers'
import GlobeControlPanel from './GlobeControlPanel'
import GlobeMapControls from './GlobeMapControls'
import GlobeUiLayer from './GlobeUiLayer'
import SatelliteInfoBadge from './SatelliteInfoBadge'
import { useSatelliteInteractions } from './useSatelliteInteractions'
import { useLoading } from '../../context/LoadingContext'

function GlobeViewer() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null)
  const dataSourceRef = useRef<CesiumCzmlDataSource | null>(null)
  const { markReady } = useLoading()
  const [mapType, setMapType] = useState<MapType>('dark')
  const [settings, setSettings] = useState<OrbitSettings>(DEFAULT_ORBIT_SETTINGS)
  const [visibility, setVisibility] = useState<Record<string, boolean>>(INITIAL_SATELLITE_VISIBILITY)
  const [satellitesReady, setSatellitesReady] = useState(false)

  const czmlData = useMemo(() => generateSatellitesCzml(settings), [])

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 2)
    viewer.scene.globe.maximumScreenSpaceError = 1.5
    viewer.scene.globe.depthTestAgainstTerrain = true
    if (viewer.scene.postProcessStages.fxaa) {
      viewer.scene.postProcessStages.fxaa.enabled = true
    }
  }, [])

  useEffect(() => {
    let raf = 0

    const applyHomeView = () => {
      const viewer = viewerRef.current?.cesiumElement
      if (!viewer) {
        raf = requestAnimationFrame(applyHomeView)
        return
      }

      const altitude = isMobile ? HOME_VIEW.altitudeMobile : HOME_VIEW.altitudeDesktop
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(HOME_VIEW.lon, HOME_VIEW.lat, altitude),
      })
    }

    applyHomeView()
    return () => cancelAnimationFrame(raf)
  }, [isMobile])

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
  }, [markReady, mapType])

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
      setSatellitesReady(true)
      markReady('satellites')
    })
  }, [settings, visibility, markReady])

  const handleToggleVisibility = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleZoomToSatellite = useCallback((id: string) => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    const dataSource = getDataSource(viewer, dataSourceRef.current)
    if (!dataSource) return

    const entity = dataSource.entities.getById(id)
    if (!entity?.position) return

    if (!visibility[id]) {
      setVisibility((prev) => ({ ...prev, [id]: true }))
    }

    const sat = SATELLITES.find((s) => s.id === id)
    void flyToSatelliteEntity(viewer, entity, sat?.altitude, isMobile ? 1.35 : 1)
  }, [visibility, isMobile])

  const { activeBadgeId, pinnedSatelliteId, pinSatellite } = useSatelliteInteractions({
    viewerRef,
    dataSourceRef,
    onZoomToSatellite: handleZoomToSatellite,
    ready: satellitesReady,
  })

  const handleAccordionZoom = useCallback((id: string) => {
    pinSatellite(id)
    handleZoomToSatellite(id)
  }, [handleZoomToSatellite, pinSatellite])

  const handleSettingsChange = useCallback((partial: Partial<OrbitSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }, [])

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
        <Globe enableLighting depthTestAgainstTerrain />
        <CzmlDataSource data={czmlData} onLoad={handleCzmlLoad} />
      </Viewer>

      <GlobeUiLayer>
        <SatelliteInfoBadge
          viewerRef={viewerRef}
          dataSourceRef={dataSourceRef}
          satelliteId={activeBadgeId}
          pinned={Boolean(pinnedSatelliteId && activeBadgeId === pinnedSatelliteId)}
        />

        <GlobeControlPanel
          visibility={visibility}
          mapType={mapType}
          settings={settings}
          onToggleVisibility={handleToggleVisibility}
          onZoomToSatellite={handleAccordionZoom}
          onMapTypeChange={setMapType}
          onSettingsChange={handleSettingsChange}
        />

        <GlobeMapControls viewerRef={viewerRef} />
      </GlobeUiLayer>
    </Box>
  )
}

export default GlobeViewer
