import { SATELLITES } from '../../data/satellites'

export const INITIAL_SATELLITE_VISIBILITY: Record<string, boolean> = Object.fromEntries(
  SATELLITES.map((s) => [s.id, true]),
)

export const HOME_VIEW = {
  lon: 0,
  lat: 20,
  altitudeDesktop: 25_000_000,
  altitudeMobile: 27_000_000,
} as const
