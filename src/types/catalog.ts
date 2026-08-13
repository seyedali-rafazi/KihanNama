import type { InfographicSection } from './common'

export type { InfographicSection }

export type CatalogEntry = {
  id: string
  name: string
  image: string
  color: [number, number, number, number]
  badgeEn: string
  badgeFa: string
  operatorEn: string
  operatorFa: string
  year: number
  descriptionEn: string
  descriptionFa: string
  abilitiesEn: string[]
  abilitiesFa: string[]
  steps: number
  category: string
  secondary: string
  sortMetric: number
  infographicLeft: InfographicSection[]
  infographicRight: InfographicSection[]
  centerCaptionEn: string
  centerCaptionFa: string
}

export type CatalogSortOption =
  | 'nameAsc'
  | 'nameDesc'
  | 'yearAsc'
  | 'yearDesc'
  | 'metricAsc'
  | 'metricDesc'

export type FilterOption = {
  value: string
  labelKey: string
}

export function sortCatalog<T extends CatalogEntry>(items: T[], sort: CatalogSortOption): T[] {
  const sorted = [...items]
  switch (sort) {
    case 'nameAsc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'nameDesc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'yearAsc':
      return sorted.sort((a, b) => a.year - b.year)
    case 'yearDesc':
      return sorted.sort((a, b) => b.year - a.year)
    case 'metricAsc':
      return sorted.sort((a, b) => a.sortMetric - b.sortMetric)
    case 'metricDesc':
      return sorted.sort((a, b) => b.sortMetric - a.sortMetric)
    default:
      return sorted
  }
}
