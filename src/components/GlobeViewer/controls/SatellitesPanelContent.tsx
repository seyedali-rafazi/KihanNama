import { SATELLITES } from '../../../data/satellites'
import SatelliteRow from './SatelliteRow'

type SatellitesPanelContentProps = {
  visibility: Record<string, boolean>
  onToggleVisibility: (id: string) => void
  onZoomToSatellite: (id: string) => void
  zoomLabel: string
  simple?: boolean
}

export function SatellitesPanelContent({
  visibility,
  onToggleVisibility,
  onZoomToSatellite,
  zoomLabel,
  simple = false,
}: SatellitesPanelContentProps) {
  return (
    <>
      {SATELLITES.map((sat) => (
        <SatelliteRow
          key={sat.id}
          sat={sat}
          visible={visibility[sat.id] ?? true}
          onToggleVisibility={onToggleVisibility}
          onZoomToSatellite={onZoomToSatellite}
          zoomLabel={zoomLabel}
          simple={simple}
        />
      ))}
    </>
  )
}

export default SatellitesPanelContent
