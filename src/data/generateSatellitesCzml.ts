import { SATELLITES } from './satellites'
import { SATELLITE_BILLBOARD_DISPLAY_SIZE } from '../utils/satelliteBillboard'
import type { OrbitSettings, SatelliteInfo } from '../types/globe'

const EPOCH = '2026-06-10T00:00:00Z'
const END = '2026-06-11T00:00:00Z'
const CLOCK_DURATION_SEC = 86_400
const ORBIT_SAMPLES = 720

function computePosition(sat: SatelliteInfo, t: number): [number, number, number] {
  const r = 6_378_137 + sat.altitude
  const inc = (sat.inclination * Math.PI) / 180
  const raan = (sat.raan * Math.PI) / 180
  const phase = (sat.phase * Math.PI) / 180
  const nu = ((2 * Math.PI) / sat.period) * t + phase

  const xOrb = r * Math.cos(nu)
  const yOrb = r * Math.sin(nu)

  const x = xOrb * Math.cos(raan) - yOrb * Math.cos(inc) * Math.sin(raan)
  const y = xOrb * Math.sin(raan) + yOrb * Math.cos(inc) * Math.cos(raan)
  const z = yOrb * Math.sin(inc)

  const lon = (Math.atan2(y, x) * 180) / Math.PI
  const lat = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI

  return [lon, lat, sat.altitude]
}

function getPositionSampleStep(sat: SatelliteInfo) {
  const samplesPerOrbit = sat.altitude >= 2_000_000 ? 180 : 90
  return Math.max(15, sat.period / samplesPerOrbit)
}

function generatePositionSamples(sat: SatelliteInfo): number[] {
  const step = getPositionSampleStep(sat)
  const samples: number[] = []

  for (let t = 0; t <= CLOCK_DURATION_SEC; t += step) {
    const [lon, lat, alt] = computePosition(sat, t % sat.period)
    samples.push(Math.round(t * 10) / 10, lon, lat, alt)
  }

  return samples
}

function generateFullOrbitPositions(sat: SatelliteInfo): number[] {
  const positions: number[] = []
  for (let i = 0; i <= ORBIT_SAMPLES; i++) {
    const t = (sat.period / ORBIT_SAMPLES) * i
    const [lon, lat, alt] = computePosition(sat, t)
    positions.push(lon, lat, alt)
  }
  const [lon0, lat0, alt0] = computePosition(sat, 0)
  positions.push(lon0, lat0, alt0)
  return positions
}

function createSatelliteEntities(sat: SatelliteInfo, settings: OrbitSettings) {
  const pathColor: [number, number, number, number] = [
    sat.color[0],
    sat.color[1],
    sat.color[2],
    210,
  ]

  return [
    {
      id: `${sat.id}-orbit`,
      name: `${sat.name} Orbit`,
      availability: `${EPOCH}/${END}`,
      polyline: {
        show: settings.showOrbits,
        positions: {
          cartographicDegrees: generateFullOrbitPositions(sat),
        },
        width: settings.pathWidth,
        arcType: 'NONE',
        disableDepthTestDistance: 0,
        material: {
          solidColor: {
            color: { rgba: pathColor },
          },
        },
      },
    },
    {
      id: sat.id,
      name: sat.name,
      availability: `${EPOCH}/${END}`,
      position: {
        epoch: EPOCH,
        interpolationAlgorithm: 'LAGRANGE',
        interpolationDegree: 5,
        referenceFrame: 'FIXED',
        cartographicDegrees: generatePositionSamples(sat),
      },
      billboard: {
        show: true,
        width: SATELLITE_BILLBOARD_DISPLAY_SIZE,
        height: SATELLITE_BILLBOARD_DISPLAY_SIZE,
        scale: 1,
        verticalOrigin: 'CENTER',
        horizontalOrigin: 'CENTER',
        disableDepthTestDistance: 0,
      },
      label: {
        show: settings.showLabels,
        text: sat.name,
        font: '12pt Inter, Vazirmatn, sans-serif',
        fillColor: { rgba: [241, 245, 249, 255] },
        outlineColor: { rgba: [0, 0, 0, 255] },
        outlineWidth: 2,
        style: 'FILL_AND_OUTLINE',
        verticalOrigin: 'TOP',
        pixelOffset: { cartesian2: [0, 28] },
        scale: 0.9,
        disableDepthTestDistance: 0,
      },
    },
  ]
}

export function generateSatellitesCzml(settings: OrbitSettings) {
  return [
    {
      id: 'document',
      name: 'KihanNama Satellites',
      version: '1.0',
      clock: {
        interval: `${EPOCH}/${END}`,
        currentTime: EPOCH,
        multiplier: settings.animationSpeed,
        range: 'LOOP',
        step: 'SYSTEM_CLOCK_MULTIPLIER',
      },
    },
    ...SATELLITES.flatMap((sat) => createSatelliteEntities(sat, settings)),
  ]
}
