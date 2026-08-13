import type { SatelliteInfo } from './globe'
import type { InfographicSection } from './common'

export type OrbitClass = 'leo' | 'meo' | 'geo'

export type SatelliteCategory =
  | 'earthObservation'
  | 'navigation'
  | 'weather'
  | 'communications'
  | 'science'
  | 'station'

export type { InfographicSection }

export type SatelliteCatalogEntry = SatelliteInfo & {
  category: SatelliteCategory
  orbitClass: OrbitClass
  operatorEn: string
  operatorFa: string
  launchYear: number
  descriptionEn: string
  descriptionFa: string
  abilitiesEn: string[]
  abilitiesFa: string[]
  orbitSteps: number
  infographicLeft: InfographicSection[]
  infographicRight: InfographicSection[]
}

export type SortOption =
  | 'nameAsc'
  | 'nameDesc'
  | 'altitudeAsc'
  | 'altitudeDesc'
  | 'periodAsc'
  | 'periodDesc'
