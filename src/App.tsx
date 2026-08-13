import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { LoadingProvider } from './context/LoadingContext'
import { AppThemeProvider } from './theme/ThemeProvider'
import AppLoader from './components/Loading/AppLoader'
import Layout from './components/Layout/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const SatellitesPage = lazy(() => import('./pages/SatellitesPage'))
const LaunchersPage = lazy(() => import('./pages/LaunchersPage'))
const SatelliteStationPage = lazy(() => import('./pages/SatelliteStationPage'))

function App() {
  return (
    <LanguageProvider>
      <AppThemeProvider>
        <BrowserRouter>
          <LoadingProvider>
            <AppLoader />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/satellites" element={<SatellitesPage />} />
                <Route path="/launchers" element={<LaunchersPage />} />
                <Route path="/satellite-station" element={<SatelliteStationPage />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </BrowserRouter>
      </AppThemeProvider>
    </LanguageProvider>
  )
}

export default App
