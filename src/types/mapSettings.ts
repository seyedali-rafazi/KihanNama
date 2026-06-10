export type MapType = 'dark' | 'satellite' | 'street'

export type OrbitSettings = {
  pathWidth: number
  pathOpacity: number
  showPaths: boolean
  showLabels: boolean
  showBillboards: boolean
  animationSpeed: number
}

export const DEFAULT_ORBIT_SETTINGS: OrbitSettings = {
  pathWidth: 3,
  pathOpacity: 0.85,
  showPaths: true,
  showLabels: true,
  showBillboards: true,
  animationSpeed: 120,
}

export type SatelliteVisibility = Record<string, boolean>

export function createDefaultVisibility(): SatelliteVisibility {
  return Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [`sat-${i}`, true]),
  )
}
