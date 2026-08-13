import { lazy, Suspense } from 'react'
import PageFallback from '../components/Loading/PageFallback'

const GlobeViewer = lazy(() => import('../components/GlobeViewer/GlobeViewer'))

function HomePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <GlobeViewer />
    </Suspense>
  )
}

export default HomePage
