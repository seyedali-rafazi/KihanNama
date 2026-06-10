import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import {
  Cartesian2,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium'
import { useTheme } from '@mui/material/styles'
import type { Viewer as CesiumViewer } from 'cesium'
import type { CesiumComponentRef } from 'resium'
import { useLanguage } from '../../../context/LanguageContext'
import { flyToRectangle, getCesiumViewer, pickGlobePosition } from './cesiumUtils'
import { getNavButtonSx } from './navButtonStyles'

type BoxZoomControlProps = {
  viewerRef: React.RefObject<CesiumComponentRef<CesiumViewer> | null>
}

function BoxZoomControl({ viewerRef }: BoxZoomControlProps) {
  const theme = useTheme()
  const { t } = useLanguage()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const viewer = getCesiumViewer(viewerRef)
    if (!viewer || !isActive) return

    const controller = viewer.scene.screenSpaceCameraController
    controller.enableInputs = false

    const canvas = viewer.canvas
    canvas.style.cursor = 'crosshair'

    const container = viewer.cesiumWidget.container
    let isDragging = false
    let startPoint: Cartesian2 | null = null
    let boxElement: HTMLDivElement | null = null

    const handler = new ScreenSpaceEventHandler(canvas)

    const removeBox = () => {
      if (boxElement?.parentNode) {
        boxElement.parentNode.removeChild(boxElement)
        boxElement = null
      }
    }

    const updateBox = (current: Cartesian2) => {
      if (!startPoint || !boxElement) return

      const minX = Math.min(startPoint.x, current.x)
      const maxX = Math.max(startPoint.x, current.x)
      const minY = Math.min(startPoint.y, current.y)
      const maxY = Math.max(startPoint.y, current.y)

      boxElement.style.left = `${minX}px`
      boxElement.style.top = `${minY}px`
      boxElement.style.width = `${maxX - minX}px`
      boxElement.style.height = `${maxY - minY}px`
    }

    const finishDrag = (current: Cartesian2) => {
      if (!isDragging || !startPoint) return
      isDragging = false

      const distance = Cartesian2.distance(startPoint, current)
      removeBox()

      if (distance > 5) {
        const startWorld = pickGlobePosition(viewer, startPoint)
        const endWorld = pickGlobePosition(viewer, current)

        if (startWorld && endWorld) {
          flyToRectangle(viewer, startWorld, endWorld)
        }
      }

      setIsActive(false)
    }

    handler.setInputAction((movement: { position: Cartesian2 }) => {
      isDragging = true
      startPoint = Cartesian2.clone(movement.position)

      boxElement = document.createElement('div')
      Object.assign(boxElement.style, {
        position: 'absolute',
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: `${theme.palette.primary.main}4D`,
        zIndex: '9999',
        pointerEvents: 'none',
      })

      container.appendChild(boxElement)
      updateBox(startPoint)
    }, ScreenSpaceEventType.LEFT_DOWN)

    handler.setInputAction((movement: { endPosition: Cartesian2 }) => {
      if (!isDragging || !startPoint) return
      updateBox(movement.endPosition)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((movement: { position: Cartesian2 }) => {
      finishDrag(movement.position)
    }, ScreenSpaceEventType.LEFT_UP)

    return () => {
      handler.destroy()
      controller.enableInputs = true
      canvas.style.cursor = ''
      removeBox()
    }
  }, [isActive, viewerRef, theme.palette.primary.main])

  return (
    <Box>
      <Tooltip
        title={isActive ? t('cancelZoomBox') : t('zoomBoxTool')}
        placement="left"
        arrow
      >
        <IconButton
          onClick={() => setIsActive((prev) => !prev)}
          size="medium"
          sx={getNavButtonSx(theme, isActive)}
        >
          <HighlightAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default BoxZoomControl
