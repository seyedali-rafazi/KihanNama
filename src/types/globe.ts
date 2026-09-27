export type MapType = 'dark' | 'satellite' | 'street'

export const DEFAULT_MAP_TYPE: MapType = 'satellite'

export type OrbitSettings = {
  pathWidth: number
  showLabels: boolean
  showOrbits: boolean
  animationSpeed: number
}

export type SatelliteInfo = {
  id: string
  name: string
  altitude: number
  inclination: number
  raan: number
  phase: number
  period: number
  color: [number, number, number, number]
  image: string
}

export const DEFAULT_ORBIT_SETTINGS: OrbitSettings = {
  pathWidth: 3.5,
  showLabels: true,
  showOrbits: true,
  animationSpeed: 120,
}
