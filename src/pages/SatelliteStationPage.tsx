import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Skeleton from '@mui/material/Skeleton'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CellTowerIcon from '@mui/icons-material/CellTower'
import { useLanguage } from '../context/LanguageContext'
import CatalogCard from '../components/Catalog/CatalogCard'
import CatalogFilters from '../components/Catalog/CatalogFilters'
import CatalogDetailModal from '../components/Catalog/CatalogDetailModal'
import PageHero from '../components/common/PageHero'
import BackendStatusBadge from '../components/common/BackendStatusBadge'
import AppPagination from '../components/common/AppPagination'
import { useSpaceStationsQuery, useGroundStationsQuery } from '../hooks/queries'
import { type CatalogEntry, type FilterOption } from '../types/catalog'

const STATION_HERO_IMAGE = '/space-station.webp'
const PAGE_SIZE = 12

type StationMode = 'space' | 'ground'

// Ground station filter options
const GROUND_CATEGORY_OPTIONS: FilterOption[] = [
  { value: 'tracking', labelKey: 'catTracking' },
  { value: 'communications', labelKey: 'catCommunicationsStation' },
  { value: 'launch', labelKey: 'catLaunchSite' },
  { value: 'research', labelKey: 'catResearch' },
]

const GROUND_REGION_OPTIONS: FilterOption[] = [
  { value: 'americas', labelKey: 'regionAmericas' },
  { value: 'europe', labelKey: 'regionEurope' },
  { value: 'asia', labelKey: 'regionAsia' },
  { value: 'middleEast', labelKey: 'regionMiddleEast' },
]

// Space station (station-ops) filter options
const SPACE_CATEGORY_OPTIONS: FilterOption[] = [
  { value: 'coreModule', labelKey: 'catCoreModule' },
  { value: 'labModule', labelKey: 'catLabModule' },
  { value: 'crewCraft', labelKey: 'catCrewCraft' },
  { value: 'cargoCraft', labelKey: 'catCargoCraft' },
]

const SPACE_GROUP_OPTIONS: FilterOption[] = [
  { value: 'iss', labelKey: 'groupIss' },
  { value: 'tiangong', labelKey: 'groupTiangong' },
]

function SatelliteStationPage() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<StationMode>('space')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [secondaryFilter, setSecondaryFilter] = useState('all')
  const [selected, setSelected] = useState<CatalogEntry | null>(null)

  // Fetch via React Query from backend with pagination
  const spaceQuery = useSpaceStationsQuery({
    group: secondaryFilter !== 'all' ? secondaryFilter : undefined,
    type: category !== 'all' ? category : undefined,
    search: search.trim() || undefined,
    page,
    limit: PAGE_SIZE,
  })

  const groundQuery = useGroundStationsQuery({
    category: category !== 'all' ? category : undefined,
    region: secondaryFilter !== 'all' ? secondaryFilter : undefined,
    search: search.trim() || undefined,
    page,
    limit: PAGE_SIZE,
  })

  const activeQuery = mode === 'space' ? spaceQuery : groundQuery
  const currentItems = activeQuery.items
  const total = activeQuery.total
  const isLoading = activeQuery.isLoading

  const categoryOptions = mode === 'space' ? SPACE_CATEGORY_OPTIONS : GROUND_CATEGORY_OPTIONS
  const secondaryOptions = mode === 'space' ? SPACE_GROUP_OPTIONS : GROUND_REGION_OPTIONS
  const secondaryLabelKey = mode === 'space' ? 'filterStatus' : 'filterRegion'

  const handleModeChange = (_: React.SyntheticEvent, val: StationMode) => {
    setMode(val)
    setPage(1)
    setCategory('all')
    setSecondaryFilter('all')
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    setPage(1)
  }

  const handleSecondaryChange = (val: string) => {
    setSecondaryFilter(val)
    setPage(1)
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHero
          title={t('stationTitle')}
          subtitle={t('stationSubtitle')}
          imageUrl={STATION_HERO_IMAGE}
        />

        {/* Mode Switcher Tabs */}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={mode}
            onChange={handleModeChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              value="space"
              icon={<RocketLaunchIcon fontSize="small" />}
              iconPosition="start"
              label={t('tabSpaceStations')}
              sx={{ fontWeight: 700, fontSize: '0.95rem' }}
            />
            <Tab
              value="ground"
              icon={<CellTowerIcon fontSize="small" />}
              iconPosition="start"
              label={t('tabGroundStations')}
              sx={{ fontWeight: 700, fontSize: '0.95rem' }}
            />
          </Tabs>
        </Box>

        <CatalogFilters
          search={search}
          searchPlaceholderKey="searchStations"
          category={category}
          secondaryFilter={secondaryFilter}
          categoryOptions={categoryOptions}
          secondaryOptions={secondaryOptions}
          secondaryLabelKey={secondaryLabelKey}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSecondaryChange={handleSecondaryChange}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {total} {t('stationsFound')}
          </Typography>
          <BackendStatusBadge />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', p: 2 }}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            {currentItems.map((item) => (
              <CatalogCard key={item.id} item={item} placeholderType="station" onClick={() => setSelected(item)} />
            ))}
          </Box>
        )}

        {!isLoading && total === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noStationsFound')}</Typography>
          </Box>
        )}

        <AppPagination
          page={page}
          total={total}
          limit={PAGE_SIZE}
          onPageChange={setPage}
          disabled={isLoading}
        />
      </Box>

      <CatalogDetailModal
        item={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        placeholderType="station"
        infographicTitleKey="stationInfographic"
        stepsLabelKey="opsSteps"
        getCategoryLabel={(item) => {
          const labels: Record<string, string> = {
            coreModule: t('catCoreModule'),
            labModule: t('catLabModule'),
            crewCraft: t('catCrewCraft'),
            cargoCraft: t('catCargoCraft'),
            tracking: t('catTracking'),
            communications: t('catCommunicationsStation'),
            launch: t('catLaunchSite'),
            research: t('catResearch'),
          }
          return labels[item.category] ?? item.category
        }}
      />
    </Box>
  )
}

export default SatelliteStationPage
