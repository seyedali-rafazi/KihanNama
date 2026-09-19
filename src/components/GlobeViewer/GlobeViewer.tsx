import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Viewer, Globe, CzmlDataSource } from 'resium'
import { Cartesian3 } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import type { Viewer as CesiumViewer, CzmlDataSource as CesiumCzmlDataSource } from 'cesium'
import { useSatellitesCzmlQuery, useSatellitesQuery } from '../../hooks/queries'
import { applyMapType } from '../../utils/mapProviders'
import { flyToSatelliteEntity } from '../../utils/satelliteTelemetry'
import { DEFAULT_ORBIT_SETTINGS, type MapType, type OrbitSettings } from '../../types/globe'
import { HOME_VIEW } from './globeConstants'
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
import { useLanguage } from '../../context/LanguageContext'

const MAX_VISIBLE_SATELLITES = 10

function GlobeViewer() {
  const theme = useTheme()
  const { t } = useLanguage()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null)
  const dataSourceRef = useRef<CesiumCzmlDataSource | null>(null)
  const { markReady } = useLoading()
  const [mapType, setMapType] = useState<MapType>('dark')
  const [settings, setSettings] = useState<OrbitSettings>(DEFAULT_ORBIT_SETTINGS)
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  const [satellitesReady, setSatellitesReady] = useState(false)
  const [limitWarningOpen, setLimitWarningOpen] = useState(false)
  const initializedRef = useRef(false)

  const { data: czmlData } = useSatellitesCzmlQuery({ limit: 100 })
  const { satellites: satelliteList, isLoading: isSatellitesLoading } = useSatellitesQuery({ limit: 100 })

  // Initialize only the first 10 satellites as active/visible on Earth
  useEffect(() => {
    if (!initializedRef.current && satelliteList.length > 0) {
      initializedRef.current = true
      const initialVis: Record<string, boolean> = {}
      satelliteList.forEach((sat, idx) => {
        initialVis[sat.id] = idx < MAX_VISIBLE_SATELLITES
      })
      setVisibility(initialVis)
    }
  }, [satelliteList])

  const activeCount = useMemo(() => {
    return Object.values(visibility).filter(Boolean).length
  }, [visibility])

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
    setVisibility((prev) => {
      const isCurrentlyVisible = Boolean(prev[id])
      if (isCurrentlyVisible) {
        return { ...prev, [id]: false }
      }
      const currentActiveCount = Object.values(prev).filter(Boolean).length
      if (currentActiveCount >= MAX_VISIBLE_SATELLITES) {
        setLimitWarningOpen(true)
        return prev
      }
      return { ...prev, [id]: true }
    })
  }, [])

  const handleZoomToSatellite = useCallback((id: string) => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    const dataSource = getDataSource(viewer, dataSourceRef.current)
    if (!dataSource) return

    const entity = dataSource.entities.getById(id)
    if (!entity?.position) return

    if (!visibility[id]) {
      const currentActiveCount = Object.values(visibility).filter(Boolean).length
      if (currentActiveCount >= MAX_VISIBLE_SATELLITES) {
        setLimitWarningOpen(true)
      } else {
        setVisibility((prev) => ({ ...prev, [id]: true }))
      }
    }

    const sat = satelliteList.find((s) => s.id === id)
    void flyToSatelliteEntity(viewer, entity, sat?.altitude || 500_000, isMobile ? 1.35 : 1)
  }, [visibility, isMobile, satelliteList])

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
        {czmlData && <CzmlDataSource data={czmlData} onLoad={handleCzmlLoad} />}
      </Viewer>

      <GlobeUiLayer>
        <SatelliteInfoBadge
          viewerRef={viewerRef}
          dataSourceRef={dataSourceRef}
          satelliteId={activeBadgeId}
          pinned={Boolean(pinnedSatelliteId && activeBadgeId === pinnedSatelliteId)}
        />

        <GlobeControlPanel
          satellites={satelliteList}
          isLoading={isSatellitesLoading}
          visibility={visibility}
          activeCount={activeCount}
          maxCount={MAX_VISIBLE_SATELLITES}
          mapType={mapType}
          settings={settings}
          onToggleVisibility={handleToggleVisibility}
          onZoomToSatellite={handleAccordionZoom}
          onMapTypeChange={setMapType}
          onSettingsChange={handleSettingsChange}
        />

        <GlobeMapControls viewerRef={viewerRef} />
      </GlobeUiLayer>

      <Snackbar
        open={limitWarningOpen}
        autoHideDuration={4500}
        onClose={() => setLimitWarningOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8, zIndex: 9999 }}
      >
        <Alert
          onClose={() => setLimitWarningOpen(false)}
          severity="warning"
          variant="filled"
          sx={{
            width: '100%',
            maxWidth: 480,
            bgcolor: 'rgba(230, 81, 0, 0.94)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.88rem',
            border: '1px solid rgba(255, 183, 77, 0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            borderRadius: 2.5,
            '& .MuiAlert-icon': {
              color: '#ffe0b2',
            },
          }}
        >
          {t('satelliteLimitWarning')}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default GlobeViewer
