import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLanguage } from '../context/LanguageContext'
import { STATION_CATALOG } from '../data/stationCatalog'
import CatalogCard from '../components/Catalog/CatalogCard'
import CatalogFilters from '../components/Catalog/CatalogFilters'
import CatalogDetailModal from '../components/Catalog/CatalogDetailModal'
import { sortCatalog, type CatalogEntry, type CatalogSortOption } from '../types/catalog'

const CATEGORY_OPTIONS = [
  { value: 'tracking', labelKey: 'catTracking' },
  { value: 'communications', labelKey: 'catCommunicationsStation' },
  { value: 'launch', labelKey: 'catLaunchSite' },
  { value: 'research', labelKey: 'catResearch' },
]

const REGION_OPTIONS = [
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
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [region, setRegion] = useState('all')
  const [sort, setSort] = useState<CatalogSortOption>('nameAsc')
  const [selected, setSelected] = useState<CatalogEntry | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    let result = STATION_CATALOG

    if (query) {
      result = result.filter((item) => {
        const text = `${item.name} ${item.descriptionEn} ${item.descriptionFa} ${item.operatorEn}`.toLowerCase()
        return text.includes(query)
      })
    }
    if (category !== 'all') result = result.filter((item) => item.category === category)
    if (region !== 'all') result = result.filter((item) => item.secondary === region)

    return sortCatalog(result, sort)
  }, [search, category, region, sort])

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{t('stationTitle')}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>{t('stationSubtitle')}</Typography>
        </Box>

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
          {filtered.length} {t('stationsFound')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {filtered.map((item) => (
            <CatalogCard key={item.id} item={item} placeholderType="station" onClick={() => setSelected(item)} />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noStationsFound')}</Typography>
          </Box>
        )}
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
