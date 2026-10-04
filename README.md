# KihanNama (کیهان‌نما)

**KihanNama** is an interactive, full-stack 3D aerospace and space exploration platform for tracking satellites in orbit, visualizing orbital mechanics, and exploring comprehensive catalogs of launch vehicles, orbital space stations, and terrestrial ground stations. Built with **React 19**, **CesiumJS**, and **FastAPI**, it features full bilingual localization for English and Persian (Farsi) with complete RTL layout support.

---

🌐 **Live Website:** [kihannama.ir](https://www.kihannama.ir/)  
📡 **Interactive API Docs:** [kihannama-backend.vercel.app/docs](https://kihannama-backend.vercel.app/docs)

---

## Key Features

### 🌍 Interactive 3D Globe & Satellite Tracking
- **Real-Time 3D Visualization:** High-performance globe powered by [CesiumJS](https://cesium.com/) and [Resium](https://resium.daruma.earth/).
- **Dynamic CZML Streaming:** Orbital paths, velocity vectors, and coordinate frames dynamically propagated and rendered via Cesium Language (CZML) with Lagrange 5th-degree interpolation.
- **Custom Satellite Markers:** Distinct billboards with category icons, labels, and customizable orbit trail paths.
- **Selective Tracking:** Toggle individual satellites on/off with an active-satellite guardrail (up to 10 concurrent satellites) to maintain smooth 60 FPS performance on all hardware.
- **Camera Navigation Controls:**
  - Smooth fly-to camera targeting when selecting any satellite.
  - Quick-action buttons: Zoom In/Out, 3D compass with north reset, Fly to Iran, Geolocation ("Locate Me" via IP lookup), and 2D box zoom.
- **Multiple Basemap Providers:**
  - **Satellite Imagery:** High-resolution Earth imagery (Google Satellite).
  - **Dark Canvas:** ArcGIS World Dark Gray Canvas with international borders and labels.
  - **Street Map:** OpenStreetMap for terrestrial context.
- **Visual Customization:** Real-time controls for orbit line thickness, animation speed multiplier, and label visibility.

### 🛰️ Satellites Catalog
- **Live Server Integration:** Filter and search thousands of active satellites ingested from NORAD TLE datasets.
- **Multi-Dimensional Filters:** Filter by orbit regime (**LEO**, **MEO**, **GEO**) and operational category (**Weather**, **Navigation / GPS**, **Earth Observation**, **Science & Space Telescopes**, **Communications**, **Space Stations**).
- **Keplerian Telemetry:** Detail modal highlighting altitude, orbital period, inclination, RAAN, international designation, and bilingual infographic breakdowns.
- **Server-Side Pagination:** Seamless paginated browsing powered by [TanStack React Query](https://tanstack.com/query/latest) with smart caching and background prefetching.

### 🚀 Launchers Catalog
- **Orbital Rocket Fleet:** Explore historical and modern launch vehicles (Falcon 9, Falcon Heavy, Starship, Electron, Soyuz-2, Ariane 6, Long March 5, and more).
- **Stage & Payload Metrics:** Detailed specifications including payload capacity to Low Earth Orbit (LEO) and Geostationary Transfer Orbit (GTO), launch mass, and operational history.
- **Interactive Infographics:** Bilingual diagrams displaying rocket booster stages, engine configurations, and mission profiles.

### 🏢 Space & Ground Stations Catalog
A unified dual-mode catalog for orbital habitats and terrestrial support networks:
1. **Space Stations (`space` mode):**
   - Active modular stations in orbit: **International Space Station (ISS)** and **Tiangong Space Station**.
   - Module breakdown: Core pressurized modules (Zarya, Tianhe), science labs (Destiny, Columbus, Kibo, Wentian, Mengtian), and airlocks.
   - Visiting and docked spacecraft: Crew Dragon, Soyuz-MS, Shenzhou, Cygnus, and Progress-MS.
2. **Ground Stations (`ground` mode):**
   - Deep space tracking stations (NASA Deep Space Network Goldstone, Madrid, Canberra).
   - Major spaceports and launch complexes (Kennedy Space Center, Baikonur Cosmodrome, Guiana Space Centre, Guiana, Tanegashima).
   - Regional filters: Americas, Europe, Asia, and Middle East.

### 🌐 Internationalization (i18n) & Accessibility
- **Bilingual Interface:** Seamless instant toggle between **English** and **Persian (Farsi)** without page reload.
- **Native RTL / LTR:** Bi-directional layout engine driven by `@mui/stylis-plugin-rtl` with tailored typography (**Vazirmatn** for Persian, **Inter** for English).
- **Centralized Dictionary:** All localization strings strictly typed and organized in `src/i18n/translations.ts`.

### ⚡ Performance & Polish
- **Multi-Phase Splash Loader:** Animated splash screen that synchronizes progress across asset caching, UI readiness, map imagery, and orbital calculations.
- **Code Splitting & Lazy Routing:** Route-based lazy loading (`React.lazy` + `Suspense`) and vendor chunk separation for Cesium and Material UI.
- **Automated SEO Engine:** Build-time Vite plugin generating canonical URLs, Open Graph tags, dynamic `sitemap.xml`, and `robots.txt`.

---

## Tech Stack

### Frontend

| Layer | Technology | Description |
|-------|------------|-------------|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Modern component architecture with strict typing |
| **Bundler** | [Vite 8](https://vite.dev/) | Next-generation frontend tooling and HMR |
| **3D Engine** | [CesiumJS 1.142](https://cesium.com/) + [Resium 1.23](https://resium.daruma.earth/) | Geospatial 3D globe and CZML orbital animation |
| **UI Components** | [Material UI (MUI) 9](https://mui.com/) + [Emotion](https://emotion.sh/) | Responsive design system with dark palette |
| **State & Cache** | [TanStack Query v5](https://tanstack.com/query/latest) | Server state management, caching, and pagination |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side routing with layout and fallback handling |
| **Typography** | `@fontsource/inter`, `@fontsource-variable/vazirmatn` | Optimized web font distribution |

### Backend

| Layer | Technology | Description |
|-------|------------|-------------|
| **API Framework** | [FastAPI](https://fastapi.tiangolo.com/) | Async high-performance Python web framework |
| **Server** | [Uvicorn](https://www.uvicorn.org/) | Lightning-fast ASGI web server implementation |
| **Primary Database** | [PostgreSQL (Neon Serverless)](https://neon.tech/) | Relational storage for catalog telemetry via SQLAlchemy + `asyncpg` |
| **Document Store** | [MongoDB](https://www.mongodb.com/) | Flexible JSON document store with async `motor` driver |
| **Orbit Mechanics** | [SGP4](https://pypi.org/project/sgp4/) & CZML Generator | TLE orbit propagation and dynamic CZML packet generation |

---

## Project Structure

```text
kn/
├── backend/                         # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                     # REST API route handlers
│   │   │   ├── czml.py              # Dynamic CZML orbit streaming
│   │   │   ├── health.py            # Healthcheck & DB status
│   │   │   ├── launchers.py         # Rocket launchers catalog
│   │   │   ├── satellites.py        # Satellite query & TLE endpoints
│   │   │   └── stations.py          # Space & Ground stations
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   ├── services/                # TLE parser, CZML generator, seeders
│   │   ├── config.py                # App configuration & settings
│   │   ├── database.py              # Postgres & MongoDB connection pools
│   │   └── main.py                  # FastAPI application entrypoint
│   ├── data/                        # Active TLE feeds & station CSV datasets
│   ├── requirements.txt             # Backend dependencies
│   └── README.md                    # Backend documentation
│
├── public/                          # Static assets (favicons, icons, sitemap, robots)
├── src/                             # React Frontend
│   ├── components/
│   │   ├── Catalog/                 # Catalog cards, filters, and detail modals
│   │   ├── common/                  # Reusable components (Hero, Pagination, FallbackImage)
│   │   ├── GlobeViewer/             # Cesium globe, controls, and satellite billboard manager
│   │   │   ├── controls/            # Basemap card, desktop/mobile control docks
│   │   │   └── mapNavigator/        # Compass, zoom buttons, locate, Iran fly-to
│   │   ├── Layout/                  # App shell with responsive Navbar
│   │   ├── Loading/                 # Multi-step splash loader & route fallbacks
│   │   ├── Navbar/                  # Top header, drawer navigation, language switcher
│   │   └── Satellites/              # Satellite catalog card & filter controls
│   ├── context/                     # LanguageContext (EN/FA) & LoadingContext
│   ├── data/                        # Basemap configs & fallback catalog datasets
│   ├── hooks/                       # React Query hooks (`useSatellitesQuery`, etc.)
│   ├── i18n/                        # Bilingual translation strings (`translations.ts`)
│   ├── pages/                       # Route pages (Home, Satellites, Launchers, Stations)
│   ├── theme/                       # MUI dark theme and RTL configuration
│   ├── types/                       # Shared TypeScript interfaces
│   ├── utils/                       # API clients, map providers, CZML builders
│   ├── App.tsx                      # App router and query client setup
│   ├── index.css                    # Global base styles
│   └── main.tsx                     # React root bootstrap
├── .env.example                     # Environment template
├── package.json                     # Frontend scripts and dependencies
├── tsconfig.json                    # TypeScript compiler options
├── vercel.json                      # Vercel SPA routing & backend API rewrites
└── vite.config.ts                   # Vite configuration with Cesium & SEO plugins
```

---

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Interactive 3D globe with live satellite tracking and telemetry overlays |
| `/satellites` | **Satellites** | Searchable catalog of active satellites with orbit class and mission filters |
| `/launchers` | **Launchers** | Catalog of orbital rocket launch vehicles with infographic stages |
| `/satellite-station` | **Stations** | Dual-tab catalog of orbital space stations (ISS, Tiangong) and ground stations |

---

## Backend API Overview

The backend provides asynchronous RESTful endpoints with automatic interactive OpenAPI documentation:

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | System health, database connectivity status, and entity counts |
| `/api/satellites` | `GET` | Paginated satellite catalog with search, `orbit_class`, and `category` filters |
| `/api/satellites/{norad_id}` | `GET` | Detailed satellite record by NORAD ID with Keplerian orbital parameters |
| `/api/satellites/czml` | `GET` | Dynamic Cesium CZML packet stream with limit and filter parameters |
| `/api/satellites/{norad_id}/czml` | `GET` | Individual satellite CZML trajectory packet |
| `/api/stations/space` | `GET` | Space station modules and visiting docked spacecraft |
| `/api/stations/space/{id}` | `GET` | Detailed space station telemetry and module info |
| `/api/stations/space/{id}/czml`| `GET` | CZML orbital stream for space stations |
| `/api/stations/ground` | `GET` | Terrestrial tracking ground stations and launch sites |
| `/api/stations/ground/{id}` | `GET` | Ground station profile and coordinates |
| `/api/launchers` | `GET` | Launch vehicles catalog with category and status filters |
| `/api/launchers/{id}` | `GET` | Launcher specifications, engine data, and stage breakdowns |
| `/api/czml/from-tle` | `POST` | Custom 2-line / 3-line TLE to CZML converter |

When running the backend, visit `http://localhost:8000/docs` for the interactive Swagger UI.

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **npm**, **yarn**, or **pnpm**
- **Python** 3.11+ (only required if running the backend locally)

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kn
```

### 2. Configure Environment Variables

Copy the sample environment file for the frontend:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# URL for the backend API (defaults to /api which is proxied by Vite or Vercel)
VITE_API_URL=/api

# Optional: Cesium Ion Access Token (get one free at https://ion.cesium.com/tokens)
VITE_CESIUM_ION_TOKEN=your_cesium_ion_token_here

# Public site domain for canonical links and Open Graph metadata
VITE_SITE_URL=https://www.kihannama.ir
```

---

### 3. Frontend Setup & Run

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.  
*(Vite automatically proxies `/api` requests to the remote backend or local backend according to your configuration).*

---

### 4. (Optional) Run the Backend Locally

If you want to run the FastAPI backend locally alongside the frontend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server (from project root or backend folder):
   ```bash
   # From root:
   npm run dev:backend

   # Or directly inside backend/:
   uvicorn app.main:app --reload --port 8000
   ```
5. Set `VITE_BACKEND_URL=http://localhost:8000` in your root `.env` to proxy local frontend calls to your local backend.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start the frontend development server with HMR |
| `npm run dev:backend` | `cd backend && python -m uvicorn ...` | Start the local FastAPI backend on port 8000 |
| `npm run build` | `tsc && vite build` | Run TypeScript type checks and generate production bundle |
| `npm run preview` | `vite preview` | Locally preview the generated production build |

---

## How Orbital Propagation & CZML Work

KihanNama bridges real-world astrophysics with CesiumJS visualization:

1. **Active Ephemeris Ingestion:** The backend ingests over 16,000 active satellite Two-Line Element (TLE) sets published by space observation networks.
2. **Trajectory Calculation:** Using SGP4 / Keplerian propagation models, position vectors $(X, Y, Z)$ are computed across time intervals.
3. **CZML Generation:** The calculated trajectories are structured into [CZML](https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide) packets utilizing Lagrange 5th-degree interpolation.
4. **Client-Side Rendering:** The frontend consumes the CZML feed through `resium`'s `CzmlDataSource`. Cesium's internal clock animates satellite positions in sync with real Earth rotation, allowing users to inspect exact orbital passes and positions.

---

## Adding New Translations

All user-facing strings are managed in `src/i18n/translations.ts`.

To register a new localized string:
1. Add the key and English text to `translations.en`:
   ```ts
   myNewFeature: 'Orbital Maneuver',
   ```
2. Add the corresponding Persian translation to `translations.fa`:
   ```ts
   myNewFeature: 'مانور مداری',
   ```
3. Use it in any component via the `useLanguage` hook:
   ```tsx
   import { useLanguage } from '../context/LanguageContext'

   function MyComponent() {
     const { t } = useLanguage()
     return <span>{t('myNewFeature')}</span>
   }
   ```

TypeScript ensures full compile-time validation for all translation keys.

---

## Deployment & Production

- **Vercel:** Configured via `vercel.json` for single-page application routing, static caching, and seamless serverless proxy rewrites to the production backend (`https://kihannama-backend.vercel.app/api/:path*`).
- **SEO Automation:** Built-in Vite plugin transforms meta tags and automatically outputs an up-to-date `sitemap.xml` and `robots.txt` matching `VITE_SITE_URL`.

---

## Browser Support

- Chrome, Chromium, and Edge (recommended)
- Firefox
- Safari (macOS & iOS with WebGL 2 enabled)

*Note: For the 3D globe visualization, hardware acceleration with WebGL 2 capability is recommended.*

---

## License

This project is private (`"private": true` in `package.json`). Third-party libraries, datasets, and imagery are subject to their respective licenses.
