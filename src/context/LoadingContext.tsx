import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

export type LoadingKey = 'assets' | 'interface' | 'map' | 'satellites'

export type LoadingStep = {
  key: LoadingKey
  labelKey: 'loadingStepAssets' | 'loadingStepInterface' | 'loadingStepMap' | 'loadingStepSatellites'
  descKey: 'loadingStepAssetsDesc' | 'loadingStepInterfaceDesc' | 'loadingStepMapDesc' | 'loadingStepSatellitesDesc'
}

const HOME_STEPS: LoadingStep[] = [
  { key: 'assets', labelKey: 'loadingStepAssets', descKey: 'loadingStepAssetsDesc' },
  { key: 'interface', labelKey: 'loadingStepInterface', descKey: 'loadingStepInterfaceDesc' },
  { key: 'map', labelKey: 'loadingStepMap', descKey: 'loadingStepMapDesc' },
  { key: 'satellites', labelKey: 'loadingStepSatellites', descKey: 'loadingStepSatellitesDesc' },
]

const PAGE_STEPS: LoadingStep[] = [
  { key: 'assets', labelKey: 'loadingStepAssets', descKey: 'loadingStepAssetsDesc' },
  { key: 'interface', labelKey: 'loadingStepInterface', descKey: 'loadingStepInterfaceDesc' },
]

type LoadingContextValue = {
  markReady: (key: LoadingKey) => void
  steps: LoadingStep[]
  displayIndex: number
  progress: number
  isComplete: boolean
}

const LoadingContext = createContext<LoadingContextValue | null>(null)

const MIN_STEP_MS = 900
const FINAL_PAUSE_MS = 500
const GLOBE_TIMEOUT_MS = 25_000

const initialReady: Record<LoadingKey, boolean> = {
  assets: false,
  interface: false,
  map: false,
  satellites: false,
}

function waitForCoreResources() {
  const fontsReady = document.fonts?.ready ?? Promise.resolve()
  const windowReady =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener('load', () => resolve(), { once: true })
        })

  return Promise.all([fontsReady, windowReady])
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const requiresGlobe = location.pathname === '/'
  const steps = requiresGlobe ? HOME_STEPS : PAGE_STEPS
  const [ready, setReady] = useState(initialReady)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const stepEnteredAtRef = useRef(Date.now())
  const advancingRef = useRef(false)

  const markReady = useCallback((key: LoadingKey) => {
    setReady((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  }, [])

  useEffect(() => {
    let cancelled = false

    waitForCoreResources().then(() => {
      if (!cancelled) markReady('assets')
    })

    const interfaceTimer = window.setTimeout(() => {
      if (!cancelled) markReady('interface')
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(interfaceTimer)
    }
  }, [markReady])

  useEffect(() => {
    if (!requiresGlobe) {
      markReady('map')
      markReady('satellites')
    }
  }, [requiresGlobe, markReady])

  useEffect(() => {
    if (!requiresGlobe) return

    const timeout = window.setTimeout(() => {
      markReady('map')
      markReady('satellites')
    }, GLOBE_TIMEOUT_MS)

    return () => window.clearTimeout(timeout)
  }, [requiresGlobe, markReady])

  useEffect(() => {
    if (isComplete || advancingRef.current) return

    const current = steps[displayIndex]
    if (!current) {
      setIsComplete(true)
      return
    }

    if (!ready[current.key]) return

    const elapsed = Date.now() - stepEnteredAtRef.current
    const wait = Math.max(0, MIN_STEP_MS - elapsed)

    advancingRef.current = true
    const timer = window.setTimeout(() => {
      advancingRef.current = false
      stepEnteredAtRef.current = Date.now()

      if (displayIndex >= steps.length - 1) {
        window.setTimeout(() => setIsComplete(true), FINAL_PAUSE_MS)
        return
      }

      setDisplayIndex((index) => index + 1)
    }, wait)

    return () => {
      window.clearTimeout(timer)
      advancingRef.current = false
    }
  }, [displayIndex, ready, steps, isComplete])

  const progress = useMemo(() => {
    const base = (displayIndex / steps.length) * 100
    const current = steps[displayIndex]
    const stepSlice = 100 / steps.length
    const partial = current && ready[current.key] ? stepSlice * 0.85 : stepSlice * 0.35
    return Math.min(100, base + (displayIndex < steps.length ? partial : 0))
  }, [displayIndex, ready, steps])

  const value = useMemo(
    () => ({
      markReady,
      steps,
      displayIndex,
      progress,
      isComplete,
    }),
    [markReady, steps, displayIndex, progress, isComplete],
  )

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
