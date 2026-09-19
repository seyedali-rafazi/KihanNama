import { useQuery } from '@tanstack/react-query'
import {
  fetchHealth,
  fetchLaunchers,
  fetchSpaceStations,
  fetchGroundStations,
  fetchSatellites,
  fetchSatellitesCzml,
  launcherToCatalogEntry,
  groundStationToCatalogEntry,
  spaceStationToCatalogEntry,
  satelliteToCatalogEntry,
} from '../utils/api'
import type { CatalogEntry } from '../types/catalog'
import type { SatelliteCatalogEntry } from '../types/satellite'

// ----------------------------------------------------
// Health Query
// ----------------------------------------------------
export function useHealthQuery() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    staleTime: 10_000,
    refetchInterval: 30_000,
    retry: 1,
  })
}

// ----------------------------------------------------
// Launchers Query
// ----------------------------------------------------
export function useLaunchersQuery(params: {
  category?: string
  status?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = useQuery({
    queryKey: ['launchers', params],
    queryFn: async () => {
      const data = await fetchLaunchers(params)
      if (data && Array.isArray(data.launchers)) {
        const mapped = data.launchers.map(launcherToCatalogEntry)
        return {
          items: mapped,
          total: data.total ?? mapped.length,
          page: data.page ?? (params.page || 1),
          limit: data.limit ?? (params.limit || 12),
        }
      }
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 12,
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const items: CatalogEntry[] = query.data?.items || []
  const total = query.data?.total ?? 0
  const page = query.data?.page ?? (params.page || 1)
  const limit = query.data?.limit ?? (params.limit || 12)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const isBackend = Boolean(query.data && query.isSuccess && !query.isError)

  return {
    ...query,
    items,
    total,
    page,
    limit,
    totalPages,
    isBackend,
  }
}

// ----------------------------------------------------
// Space Stations Query
// ----------------------------------------------------
export function useSpaceStationsQuery(params: {
  group?: string
  type?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = useQuery({
    queryKey: ['space-stations', params],
    queryFn: async () => {
      const data = await fetchSpaceStations(params)
      if (data && Array.isArray(data.stations)) {
        const mapped = data.stations.map(spaceStationToCatalogEntry)
        return {
          items: mapped,
          total: data.total ?? mapped.length,
          page: data.page ?? (params.page || 1),
          limit: data.limit ?? (params.limit || 12),
        }
      }
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 12,
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const items: CatalogEntry[] = query.data?.items || []
  const total = query.data?.total ?? 0
  const page = query.data?.page ?? (params.page || 1)
  const limit = query.data?.limit ?? (params.limit || 12)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const isBackend = Boolean(query.data && query.isSuccess && !query.isError)

  return {
    ...query,
    items,
    total,
    page,
    limit,
    totalPages,
    isBackend,
  }
}

// ----------------------------------------------------
// Ground Stations Query
// ----------------------------------------------------
export function useGroundStationsQuery(params: {
  category?: string
  region?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = useQuery({
    queryKey: ['ground-stations', params],
    queryFn: async () => {
      const data = await fetchGroundStations(params)
      if (data && Array.isArray(data.stations)) {
        const mapped = data.stations.map(groundStationToCatalogEntry)
        return {
          items: mapped,
          total: data.total ?? mapped.length,
          page: data.page ?? (params.page || 1),
          limit: data.limit ?? (params.limit || 12),
        }
      }
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 12,
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const items: CatalogEntry[] = query.data?.items || []
  const total = query.data?.total ?? 0
  const page = query.data?.page ?? (params.page || 1)
  const limit = query.data?.limit ?? (params.limit || 12)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const isBackend = Boolean(query.data && query.isSuccess && !query.isError)

  return {
    ...query,
    items,
    total,
    page,
    limit,
    totalPages,
    isBackend,
  }
}

// ----------------------------------------------------
// Satellites Query
// ----------------------------------------------------
export function useSatellitesQuery(params: {
  search?: string
  orbit_class?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
} = {}) {
  const query = useQuery({
    queryKey: ['satellites', params],
    queryFn: async () => {
      const data = await fetchSatellites(params)
      if (data && Array.isArray(data.satellites)) {
        const mapped = data.satellites.map(satelliteToCatalogEntry)
        return {
          satellites: mapped,
          total: data.total ?? mapped.length,
          page: data.page ?? (params.page || 1),
          limit: data.limit ?? (params.limit || 12),
        }
      }
      return {
        satellites: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 12,
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const satellites: SatelliteCatalogEntry[] = query.data?.satellites || []
  const total = query.data?.total ?? 0
  const page = query.data?.page ?? (params.page || 1)
  const limit = query.data?.limit ?? (params.limit || 12)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const isBackend = Boolean(query.data && query.isSuccess && !query.isError)

  return {
    ...query,
    satellites,
    total,
    page,
    limit,
    totalPages,
    isBackend,
  }
}

// ----------------------------------------------------
// Satellites CZML Query (Cesium 3D stream)
// ----------------------------------------------------
export function useSatellitesCzmlQuery(params: {
  search?: string
  orbit_class?: string
  category?: string
  norad_ids?: string
  limit?: number
} = { limit: 100 }) {
  return useQuery({
    queryKey: ['satellites-czml', params],
    queryFn: () => fetchSatellitesCzml(params),
    staleTime: 10 * 60 * 1000,
  })
}
