import { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLanguage } from '../context/LanguageContext'
import { STATION_CATALOG } from '../data/stationCatalog'
import CatalogCard from '../components/Catalog/CatalogCard'
import CatalogFilters from '../components/Catalog/CatalogFilters'
import CatalogDetailModal from '../components/Catalog/CatalogDetailModal'
import PageHero from '../components/common/PageHero'
import { useCatalogFilter } from '../hooks/useCatalogFilter'
import { sortCatalog, type CatalogEntry, type CatalogSortOption, type FilterOption } from '../types/catalog'

const STATION_HERO_IMAGE = '/space-station.webp'

const CATEGORY_OPTIONS: FilterOption[] = [
  { value: 'tracking', labelKey: 'catTracking' },
  { value: 'communications', labelKey: 'catCommunicationsStation' },
  { value: 'launch', labelKey: 'catLaunchSite' },
  { value: 'research', labelKey: 'catResearch' },
]

const REGION_OPTIONS: FilterOption[] = [
  { value: 'americas', labelKey: 'regionAmericas' },
  { value: 'europe', labelKey: 'regionEurope' },
  { value: 'asia', labelKey: 'regionAsia' },
  { value: 'middleEast', labelKey: 'regionMiddleEast' },
]

const SORT_OPTIONS: { value: CatalogSortOption; labelKey: 'sortNameAsc' | 'sortNameDesc' | 'sortYearAsc' | 'sortYearDesc' | 'sortAntennaAsc' | 'sortAntennaDesc' }[] = [
  { value: 'nameAsc', labelKey: 'sortNameAsc' },
  { value: 'nameDesc', labelKey: 'sortNameDesc' },
  { value: 'yearAsc', labelKey: 'sortYearAsc' },
  { value: 'yearDesc', labelKey: 'sortYearDesc' },
  { value: 'metricAsc', labelKey: 'sortAntennaAsc' },
  { value: 'metricDesc', labelKey: 'sortAntennaDesc' },
]

function SatelliteStationPage() {
  const { t } = useLanguage()

  const filterPredicate = useCallback(
    (item: CatalogEntry, query: string, category: string, region: string) => {
      if (query) {
        const text = `${item.name} ${item.descriptionEn} ${item.descriptionFa} ${item.operatorEn}`.toLowerCase()
        if (!text.includes(query)) return false
      }
      if (category !== 'all' && item.category !== category) return false
      if (region !== 'all' && item.secondary !== region) return false
      return true
    },
    [],
  )

  const {
    search,
    setSearch,
    category,
    setCategory,
    secondaryFilter: region,
    setSecondaryFilter: setRegion,
    sort,
    setSort,
    selected,
    setSelected,
    clearSelected,
    filteredItems,
    count,
  } = useCatalogFilter<CatalogEntry, CatalogSortOption>({
    items: STATION_CATALOG,
    initialSort: 'nameAsc',
    filterPredicate,
    sortComparator: sortCatalog,
  })

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHero
          title={t('stationTitle')}
          subtitle={t('stationSubtitle')}
          imageUrl={STATION_HERO_IMAGE}
        />

        <CatalogFilters
          search={search}
          searchPlaceholderKey="searchStations"
          category={category}
          secondaryFilter={region}
          sort={sort}
          categoryOptions={CATEGORY_OPTIONS}
          secondaryOptions={REGION_OPTIONS}
          secondaryLabelKey="filterRegion"
          sortOptions={SORT_OPTIONS}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSecondaryChange={setRegion}
          onSortChange={setSort}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {count} {t('stationsFound')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {filteredItems.map((item) => (
            <CatalogCard key={item.id} item={item} placeholderType="station" onClick={() => setSelected(item)} />
          ))}
        </Box>

        {count === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noStationsFound')}</Typography>
          </Box>
        )}
      </Box>

      <CatalogDetailModal
        item={selected}
        open={Boolean(selected)}
        onClose={clearSelected}
        placeholderType="station"
        infographicTitleKey="stationInfographic"
        stepsLabelKey="opsSteps"
        getCategoryLabel={(item) => {
          const labels: Record<string, string> = {
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
