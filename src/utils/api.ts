import type { CatalogEntry } from '../types/catalog'
import type { SatelliteCatalogEntry, OrbitClass, SatelliteCategory } from '../types/satellite'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('Backend API offline or unreachable:', err)
    return null
  }
}

// ----------------------------------------------------
// Launchers API
// ----------------------------------------------------

export async function fetchLaunchers(params: {
  category?: string
  status?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = new URLSearchParams()
  if (params.category && params.category !== 'all') query.set('category', params.category)
  if (params.status && params.status !== 'all') query.set('status', params.status)
  if (params.search) query.set('search', params.search)
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const url = `${API_BASE_URL}/launchers${query.toString() ? `?${query.toString()}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch launchers: ${res.statusText}`)
  return await res.json()
}

export async function fetchLauncherDetail(id: string) {
  const res = await fetch(`${API_BASE_URL}/launchers/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`Failed to fetch launcher: ${res.statusText}`)
  return await res.json()
}

// ----------------------------------------------------
// Space Stations API
// ----------------------------------------------------

export async function fetchSpaceStations(params: {
  group?: string
  type?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = new URLSearchParams()
  if (params.group && params.group !== 'all') query.set('group', params.group)
  if (params.type && params.type !== 'all') query.set('type', params.type)
  if (params.search) query.set('search', params.search)
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const url = `${API_BASE_URL}/stations/space${query.toString() ? `?${query.toString()}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch space stations: ${res.statusText}`)
  return await res.json()
}

export async function fetchSpaceStationDetail(identifier: string) {
  const res = await fetch(`${API_BASE_URL}/stations/space/${encodeURIComponent(identifier)}`)
  if (!res.ok) throw new Error(`Failed to fetch space station: ${res.statusText}`)
  return await res.json()
}

// ----------------------------------------------------
// Ground Stations API
// ----------------------------------------------------

export async function fetchGroundStations(params: {
  category?: string
  region?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = new URLSearchParams()
  if (params.category && params.category !== 'all') query.set('category', params.category)
  if (params.region && params.region !== 'all') query.set('region', params.region)
  if (params.search) query.set('search', params.search)
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const url = `${API_BASE_URL}/stations/ground${query.toString() ? `?${query.toString()}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ground stations: ${res.statusText}`)
  return await res.json()
}

export async function fetchGroundStationDetail(identifier: string) {
  const res = await fetch(`${API_BASE_URL}/stations/ground/${encodeURIComponent(identifier)}`)
  if (!res.ok) throw new Error(`Failed to fetch ground station: ${res.statusText}`)
  return await res.json()
}

// ----------------------------------------------------
// Satellites API
// ----------------------------------------------------

export async function fetchSatellites(params: {
  search?: string
  orbit_class?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.orbit_class && params.orbit_class !== 'all') query.set('orbit_class', params.orbit_class)
  if (params.category && params.category !== 'all') query.set('category', params.category)
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const res = await fetch(`${API_BASE_URL}/satellites?${query.toString()}`)
  if (!res.ok) throw new Error(`Failed to fetch satellites: ${res.statusText}`)
  return await res.json()
}

export async function fetchSatellitesCzml(params: {
  search?: string
  orbit_class?: string
  category?: string
  norad_ids?: string
  limit?: number
} = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.orbit_class) query.set('orbit_class', params.orbit_class)
  if (params.category) query.set('category', params.category)
  if (params.norad_ids) query.set('norad_ids', params.norad_ids)
  if (params.limit) query.set('limit', String(params.limit))

  const res = await fetch(`${API_BASE_URL}/satellites/czml?${query.toString()}`)
  if (!res.ok) throw new Error(`Failed to fetch CZML: ${res.statusText}`)
  return await res.json()
}

// ----------------------------------------------------
// Data Adapters to Catalog Types
// ----------------------------------------------------

export function launcherToCatalogEntry(item: any): CatalogEntry {
  return {
    id: item.id,
    name: item.name,
    image: item.image || '/launchers-page.webp',
    color: item.color || [25, 118, 210, 255],
    badgeEn: item.badge_en || 'Launcher',
    badgeFa: item.badge_fa || 'پرتابگر',
    operatorEn: item.operator_en || '',
    operatorFa: item.operator_fa || '',
    year: item.year || 2024,
    category: item.category || 'mediumLift',
    secondary: item.secondary || 'active',
    sortMetric: item.sort_metric ?? 0,
    steps: item.steps || 4,
    descriptionEn: item.description_en || '',
    descriptionFa: item.description_fa || '',
    abilitiesEn: item.abilities_en || [],
    abilitiesFa: item.abilities_fa || [],
    centerCaptionEn: item.center_caption_en || '',
    centerCaptionFa: item.center_caption_fa || '',
    infographicLeft: item.infographic_left || [],
    infographicRight: item.infographic_right || [],
  }
}

export function groundStationToCatalogEntry(item: any): CatalogEntry {
  return {
    id: item.id,
    name: item.name,
    image: item.image || '/space-station.webp',
    color: item.color || [25, 118, 210, 255],
    badgeEn: item.badge_en || 'Ground Station',
    badgeFa: item.badge_fa || 'ایستگاه زمینی',
    operatorEn: item.operator_en || '',
    operatorFa: item.operator_fa || '',
    year: item.year || 2020,
    category: item.category || 'tracking',
    secondary: item.secondary || 'americas',
    sortMetric: item.sort_metric ?? 0,
    steps: item.steps || 4,
    descriptionEn: item.description_en || '',
    descriptionFa: item.description_fa || '',
    abilitiesEn: item.abilities_en || [],
    abilitiesFa: item.abilities_fa || [],
    centerCaptionEn: item.center_caption_en || '',
    centerCaptionFa: item.center_caption_fa || '',
    infographicLeft: item.infographic_left || [],
    infographicRight: item.infographic_right || [],
  }
}

export function spaceStationToCatalogEntry(s: any): CatalogEntry {
  return {
    id: s.slug || String(s.id),
    name: s.object_name,
    image: s.image_url || '/space-station.webp',
    color: [0, 230, 118, 255],
    badgeEn: s.badge_en || 'Space Station',
    badgeFa: s.badge_fa || 'ایستگاه فضایی',
    operatorEn: s.operator_en || '',
    operatorFa: s.operator_fa || '',
    year: s.year || 2026,
    category: s.station_type || 'coreModule',
    secondary: (s.station_group || '').toLowerCase().includes('iss') ? 'iss' : 'tiangong',
    sortMetric: s.altitude || 400,
    steps: 4,
    descriptionEn: s.description_en || '',
    descriptionFa: s.description_fa || '',
    abilitiesEn: s.abilities_en || [],
    abilitiesFa: s.abilities_fa || [],
    centerCaptionEn: `${s.altitude} km altitude · ${s.velocity} km/s`,
    centerCaptionFa: `ارتفاع ${s.altitude} کیلومتر · سرعت ${s.velocity} کیلومتر بر ثانیه`,
    infographicLeft: s.infographic_left || [],
    infographicRight: s.infographic_right || [],
  }
}

export function satelliteToCatalogEntry(sat: any): SatelliteCatalogEntry {
  const orbitClassVal: OrbitClass = (sat.orbit_class || 'leo').toLowerCase() as OrbitClass
  let categoryVal: SatelliteCategory = 'communications'
  if (sat.category) {
    const c = sat.category.toLowerCase()
    if (c.includes('weather')) categoryVal = 'weather'
    else if (c.includes('nav') || c.includes('gps')) categoryVal = 'navigation'
    else if (c.includes('earth') || c.includes('obs')) categoryVal = 'earthObservation'
    else if (c.includes('science') || c.includes('telescope')) categoryVal = 'science'
    else if (c.includes('station')) categoryVal = 'station'
    else if (c.includes('comm')) categoryVal = 'communications'
  }

  const colorMap: Record<string, [number, number, number, number]> = {
    leo: [33, 150, 243, 255],
    meo: [255, 179, 0, 255],
    geo: [156, 39, 176, 255],
    weather: [0, 230, 118, 255],
    station: [239, 68, 68, 255],
    navigation: [250, 204, 21, 255],
    science: [249, 115, 22, 255],
    communications: [64, 196, 255, 255],
    earthObservation: [76, 175, 80, 255],
  }
  const color = colorMap[categoryVal] || colorMap[orbitClassVal] || [33, 150, 243, 255]

  const altKm = Math.round(sat.altitude || 500)
  const periodMin = Number(sat.period || 95).toFixed(1)
  const incDeg = Number(sat.inclination || 0).toFixed(1)

  return {
    id: String(sat.norad_id || sat.id),
    name: sat.name,
    altitude: sat.altitude ? sat.altitude * 1000 : 500_000,
    inclination: sat.inclination ?? 51.6,
    raan: sat.raan ?? 0,
    phase: sat.mean_anomaly ?? 0,
    period: sat.period ? Math.round(sat.period * 60) : 5700,
    color,
    image: '/satellite-page.webp',
    category: categoryVal,
    orbitClass: orbitClassVal,
    operatorEn: sat.intl_desig ? `International (${sat.intl_desig})` : 'Global Operator',
    operatorFa: sat.intl_desig ? `بین‌المللی (${sat.intl_desig})` : 'اپراتور جهانی',
    launchYear: sat.epoch ? new Date(sat.epoch).getFullYear() || 2024 : 2024,
    descriptionEn: `Operational ${orbitClassVal.toUpperCase()} satellite with NORAD catalog ID ${sat.norad_id}.`,
    descriptionFa: `ماهواره عملیاتی در مدار ${orbitClassVal.toUpperCase()} با شناسه کاتالوگ ${sat.norad_id}.`,
    abilitiesEn: ['Orbital telemetry', 'Downlink transmission', 'Earth coverage'],
    abilitiesFa: ['تله‌متری مداری', 'ارسال داده به زمین', 'پوشش جهانی'],
    orbitSteps: orbitClassVal === 'geo' ? 3 : orbitClassVal === 'meo' ? 2 : 1,
    infographicLeft: [
      { titleEn: 'Orbit Class', titleFa: 'کلاس مداری', descriptionEn: `${orbitClassVal.toUpperCase()} orbit.`, descriptionFa: `مدار ${orbitClassVal.toUpperCase()}.` },
      { titleEn: 'Altitude', titleFa: 'ارتفاع', descriptionEn: `${altKm} km above Earth.`, descriptionFa: `${altKm} کیلومتر از سطح زمین.` },
    ],
    infographicRight: [
      { titleEn: 'Orbital Period', titleFa: 'دوره مداری', descriptionEn: `${periodMin} minutes per orbit.`, descriptionFa: `${periodMin} دقیقه در هر گردش.` },
      { titleEn: 'Inclination', titleFa: 'زاویه انحراف', descriptionEn: `${incDeg}° orbital plane inclination.`, descriptionFa: `${incDeg} درجه زاویه شیب مداری.` },
    ],
  }
}
