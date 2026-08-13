import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Ion } from 'cesium'
import '@fontsource/vazirmatn/400.css'
import '@fontsource/vazirmatn/500.css'
import '@fontsource/vazirmatn/600.css'
import '@fontsource/vazirmatn/700.css'
import '@fontsource-variable/vazirmatn'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import App from './App'
import './index.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN
if (ionToken) {
  Ion.defaultAccessToken = ionToken
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
