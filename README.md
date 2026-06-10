# KihanNama (کیهان‌نما)

**KihanNama** is an interactive 3D web application for exploring Earth, tracking satellites in orbit, and browsing catalogs of launch vehicles and ground stations. Built with React and CesiumJS, it supports English and Persian (Farsi) with full RTL layout.

---

## Features

### Interactive 3D Globe
- Real-time satellite visualization on a Cesium-powered 3D globe
- Animated orbital paths generated from simplified Keplerian parameters
- Custom satellite billboards with images and color-coded orbit trails
- Toggle individual satellites, zoom to a selected satellite, and adjust orbit display settings

### Map Controls
- **Map styles:** Dark (CartoDB), satellite imagery (Esri World Imagery), and street map (OpenStreetMap)
- **Navigation:** Zoom in/out, compass with north reset, fly to Iran, IP-based geolocation, and rectangular box zoom
- **Orbit settings:** Orbit path thickness, animation speed, show/hide labels and orbit paths

### Satellite Catalog
- Browse 20 tracked satellites (ISS, Hubble, GPS, Starlink, GOES, and more)
- Search, filter by category and orbit class (LEO / MEO / GEO), and sort by name, altitude, or period
- Detail modals with bilingual descriptions, operator info, and infographic panels

### Launchers Catalog
- Explore 8 launch vehicles (Falcon 9, Falcon Heavy, Soyuz, Ariane 6, etc.)
- Filter by category, status, and region; sort by name, year, or payload capacity
- Infographic detail views with launch phase breakdowns

### Ground Stations Catalog
- Browse 8 satellite ground stations and launch sites (Goldstone DSN, Baikonur, Guiana Space Centre, etc.)
- Filter by category, region, and status; sort by name, year, or antenna size
- Bilingual station profiles with operational details

### Internationalization
- **English** and **Persian (Farsi)** with in-app language switcher
- RTL-aware Material UI theme (Vazirmatn font for Persian, Inter for English)
- All UI strings centralized in `src/i18n/translations.ts`

### Loading Experience
- Multi-step splash loader with progress tracking for assets, UI, map engine, and satellite data
- Route-aware loading (full globe pipeline on home, lighter load on catalog pages)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19, TypeScript |
| Build tool | Vite 8 |
| 3D Globe | CesiumJS, Resium |
| UI | Material UI (MUI) 9, Emotion |
| Routing | React Router 7 |
| i18n / RTL | Custom context + `@mui/stylis-plugin-rtl` |

---

## Prerequisites

- **Node.js** 20 or later (recommended for Vite 8)
- **npm** (or yarn / pnpm)

---

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd kn
npm install
```

### 2. Configure environment variables

Copy the example env file and add your Cesium Ion token (optional but recommended for some Cesium assets):

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Get a free token at https://ion.cesium.com/tokens
VITE_CESIUM_ION_TOKEN=your_cesium_ion_token_here
```

> **Note:** The app uses free public tile providers (CartoDB, Esri, OpenStreetMap) for basemaps, so it runs without a token. A Cesium Ion token may still be useful for default terrain or other Ion-hosted assets.

### 3. Start the development server

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
```

Output is written to the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check with `tsc`, then build for production |
| `npm run preview` | Serve the production build locally |

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Full-screen 3D globe with satellite tracking |
| `/satellites` | Satellites | Searchable satellite catalog with detail modals |
| `/launchers` | Launchers | Rocket launch vehicle catalog |
| `/satellite-station` | Satellite Station | Ground station and launch site catalog |

---

## Project Structure

```
kn/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── components/
│   │   ├── Catalog/         # Shared catalog cards, filters, detail modals
│   │   ├── common/          # FallbackImage, ImagePlaceholder
│   │   ├── GlobeViewer/     # Cesium globe, control panel, map controls
│   │   │   └── mapNavigator/  # Zoom, compass, fly-home, locate, box-zoom
│   │   ├── Layout/          # App shell with navbar
│   │   ├── Loading/         # AppLoader splash screen
│   │   ├── Navbar/          # Top navigation and language switcher
│   │   └── Satellites/      # Satellite-specific cards and filters
│   ├── constants/           # Default placeholder images
│   ├── context/             # LanguageContext, LoadingContext
│   ├── data/
│   │   ├── generateSatellitesCzml.ts  # CZML orbit generation
│   │   ├── launcherCatalog.ts
│   │   ├── mapStyles.ts
│   │   ├── satelliteCatalog.ts
│   │   ├── satellites.ts    # Globe satellite definitions
│   │   └── stationCatalog.ts
│   ├── i18n/
│   │   └── translations.ts  # EN / FA strings
│   ├── pages/               # Route-level page components
│   ├── theme/               # MUI theme and RTL provider
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Map providers, satellite billboards
│   ├── App.tsx              # Router and providers
│   ├── main.tsx             # Entry point, Cesium Ion token setup
│   └── index.css            # Global styles
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts           # Vite + React + Cesium plugins
```

---

## How Satellite Orbits Work

Satellite positions are **simulated**, not fetched from live TLE data. Each satellite in `src/data/satellites.ts` defines:

- Altitude, inclination, RAAN, orbital phase, and period
- A color and thumbnail image

`generateSatellitesCzml.ts` computes positions over a 24-hour window and exports [CZML](https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide) for Cesium. Orbits are circular approximations suitable for visualization and education, not precision tracking.

To add a satellite to the globe:

1. Add an entry to `src/data/satellites.ts`
2. Add matching catalog metadata in `src/data/satelliteCatalog.ts`

---

## External Services

| Service | Usage |
|---------|-------|
| [Cesium Ion](https://ion.cesium.com/) | Optional access token for Cesium assets |
| [CartoDB Dark Matter](https://carto.com/basemaps/) | Dark basemap tiles |
| [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df227e0e4e4144b8cb4879cf5d0ae2) | Satellite imagery basemap |
| [OpenStreetMap](https://www.openstreetmap.org/) | Street map basemap |
| [ipapi.co](https://ipapi.co/) | IP-based geolocation for "Locate me" |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Satellite and catalog thumbnail images |

---

## Adding Translations

All user-facing strings live in `src/i18n/translations.ts`. To add a new string:

1. Add the key and English value under `translations.en`
2. Add the Persian value under `translations.fa`
3. Use it in components via the `useLanguage()` hook:

```tsx
const { t } = useLanguage()
return <Typography>{t('yourNewKey')}</Typography>
```

The `TranslationKey` type is inferred automatically from the English keys.

---

## Browser Support

Modern evergreen browsers with WebGL 2 support (Chrome, Firefox, Edge, Safari). The 3D globe requires a GPU-capable device for smooth performance.

---

## License

This project is private (`"private": true` in `package.json`). Third-party libraries are subject to their respective licenses (see `node_modules/`).
