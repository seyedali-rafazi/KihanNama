import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './context/LanguageContext'
import { LoadingProvider } from './context/LoadingContext'
import { AppThemeProvider } from './theme/ThemeProvider'
import AppLoader from './components/Loading/AppLoader'
import Layout from './components/Layout/Layout'
import PageFallback from './components/Loading/PageFallback'

const HomePage = lazy(() => import('./pages/HomePage'))
const SatellitesPage = lazy(() => import('./pages/SatellitesPage'))
const LaunchersPage = lazy(() => import('./pages/LaunchersPage'))
const SatelliteStationPage = lazy(() => import('./pages/SatelliteStationPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppThemeProvider>
          <BrowserRouter>
            <LoadingProvider>
              <AppLoader />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/satellites" element={<SatellitesPage />} />
                    <Route path="/launchers" element={<LaunchersPage />} />
                    <Route path="/satellite-station" element={<SatelliteStationPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </LoadingProvider>
          </BrowserRouter>
        </AppThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App

