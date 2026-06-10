export type SatelliteMeta = {
  id: string
  name: string
  altitude: number
  inclination: number
  phase: number
  period: number
  color: [number, number, number]
  image: string
  type: string
}

const SATELLITE_IMAGE = '/satellites/satellite.png'

export const SATELLITES: SatelliteMeta[] = [
  { id: 'iss', name: 'ISS', altitude: 420_000, inclination: 51.6, phase: 0, period: 5550, color: [255, 99, 132], image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/International_Space_Station_after_undocking_of_STS-132.jpg/320px-International_Space_Station_after_undocking_of_STS-132.jpg', type: 'Space Station' },
  { id: 'hubble', name: 'Hubble', altitude: 540_000, inclination: 28.5, phase: 30, period: 5700, color: [54, 162, 235], image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/320px-HST-SM4.jpeg', type: 'Space Telescope' },
  { id: 'terra', name: 'Terra', altitude: 705_000, inclination: 98.2, phase: 60, period: 5930, color: [75, 192, 192], image: SATELLITE_IMAGE, type: 'Earth Observation' },
  { id: 'aqua', name: 'Aqua', altitude: 705_000, inclination: 98.2, phase: 90, period: 5930, color: [255, 206, 86], image: SATELLITE_IMAGE, type: 'Earth Observation' },
  { id: 'landsat8', name: 'Landsat 8', altitude: 705_000, inclination: 98.2, phase: 120, period: 5930, color: [153, 102, 255], image: SATELLITE_IMAGE, type: 'Earth Observation' },
  { id: 'sentinel1a', name: 'Sentinel-1A', altitude: 693_000, inclination: 98.2, phase: 150, period: 5920, color: [255, 159, 64], image: SATELLITE_IMAGE, type: 'Radar' },
  { id: 'sentinel2a', name: 'Sentinel-2A', altitude: 786_000, inclination: 98.5, phase: 180, period: 6000, color: [199, 199, 199], image: SATELLITE_IMAGE, type: 'Earth Observation' },
  { id: 'noaa20', name: 'NOAA-20', altitude: 824_000, inclination: 98.7, phase: 210, period: 6060, color: [83, 102, 255], image: SATELLITE_IMAGE, type: 'Weather' },
  { id: 'suomi-npp', name: 'Suomi NPP', altitude: 824_000, inclination: 98.7, phase: 240, period: 6060, color: [255, 99, 255], image: SATELLITE_IMAGE, type: 'Weather' },
  { id: 'worldview3', name: 'WorldView-3', altitude: 617_000, inclination: 97.9, phase: 270, period: 5800, color: [99, 255, 132], image: SATELLITE_IMAGE, type: 'Imaging' },
  { id: 'jason3', name: 'Jason-3', altitude: 1_336_000, inclination: 66.0, phase: 300, period: 6750, color: [255, 132, 99], image: SATELLITE_IMAGE, type: 'Altimetry' },
  { id: 'metop-b', name: 'MetOp-B', altitude: 817_000, inclination: 98.7, phase: 330, period: 6050, color: [132, 99, 255], image: SATELLITE_IMAGE, type: 'Weather' },
  { id: 'gps-iii-1', name: 'GPS III SV01', altitude: 20_200_000, inclination: 55.0, phase: 0, period: 43_200, color: [99, 255, 255], image: SATELLITE_IMAGE, type: 'Navigation' },
  { id: 'gps-iii-2', name: 'GPS III SV02', altitude: 20_200_000, inclination: 55.0, phase: 120, period: 43_200, color: [255, 205, 99], image: SATELLITE_IMAGE, type: 'Navigation' },
  { id: 'galileo-1', name: 'Galileo FOC-1', altitude: 23_222_000, inclination: 56.0, phase: 60, period: 50_400, color: [99, 132, 255], image: SATELLITE_IMAGE, type: 'Navigation' },
  { id: 'goes16', name: 'GOES-16', altitude: 35_786_000, inclination: 0.1, phase: 75, period: 86_400, color: [255, 99, 99], image: SATELLITE_IMAGE, type: 'Weather (GEO)' },
  { id: 'goes17', name: 'GOES-17', altitude: 35_786_000, inclination: 0.1, phase: 135, period: 86_400, color: [99, 255, 99], image: SATELLITE_IMAGE, type: 'Weather (GEO)' },
  { id: 'starlink-1', name: 'Starlink-1007', altitude: 550_000, inclination: 53.0, phase: 15, period: 5700, color: [255, 180, 99], image: SATELLITE_IMAGE, type: 'Communications' },
  { id: 'starlink-2', name: 'Starlink-2040', altitude: 550_000, inclination: 53.0, phase: 195, period: 5700, color: [180, 99, 255], image: SATELLITE_IMAGE, type: 'Communications' },
  { id: 'iridium-1', name: 'Iridium NEXT-1', altitude: 780_000, inclination: 86.4, phase: 45, period: 6020, color: [99, 180, 255], image: SATELLITE_IMAGE, type: 'Communications' },
]
