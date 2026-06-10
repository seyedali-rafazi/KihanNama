import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLanguage } from '../context/LanguageContext'
import { LAUNCHER_CATALOG } from '../data/launcherCatalog'
import CatalogCard from '../components/Catalog/CatalogCard'
import CatalogFilters from '../components/Catalog/CatalogFilters'
import CatalogDetailModal from '../components/Catalog/CatalogDetailModal'
import { sortCatalog, type CatalogEntry, type CatalogSortOption } from '../types/catalog'

const CATEGORY_OPTIONS = [
  { value: 'heavyLift', labelKey: 'catHeavyLift' },
  { value: 'mediumLift', labelKey: 'catMediumLift' },
  { value: 'smallLift', labelKey: 'catSmallLift' },
  { value: 'reusable', labelKey: 'catReusable' },
]

const STATUS_OPTIONS = [
  { value: 'active', labelKey: 'statusActive' },
  { value: 'legacy', labelKey: 'statusLegacy' },
  { value: 'developmental', labelKey: 'statusDevelopmental' },
]

const SORT_OPTIONS: { value: CatalogSortOption; labelKey: 'sortNameAsc' | 'sortNameDesc' | 'sortYearAsc' | 'sortYearDesc' | 'sortPayloadAsc' | 'sortPayloadDesc' }[] = [
  { value: 'nameAsc', labelKey: 'sortNameAsc' },
  { value: 'nameDesc', labelKey: 'sortNameDesc' },
  { value: 'yearAsc', labelKey: 'sortYearAsc' },
  { value: 'yearDesc', labelKey: 'sortYearDesc' },
  { value: 'metricAsc', labelKey: 'sortPayloadAsc' },
  { value: 'metricDesc', labelKey: 'sortPayloadDesc' },
]

function LaunchersPage() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<CatalogSortOption>('nameAsc')
  const [selected, setSelected] = useState<CatalogEntry | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    let result = LAUNCHER_CATALOG

    if (query) {
      result = result.filter((item) => {
        const text = `${item.name} ${item.descriptionEn} ${item.descriptionFa} ${item.operatorEn}`.toLowerCase()
        return text.includes(query)
      })
    }
    if (category !== 'all') result = result.filter((item) => item.category === category)
    if (status !== 'all') result = result.filter((item) => item.secondary === status)

    return sortCatalog(result, sort)
  }, [search, category, status, sort])

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{t('launchersTitle')}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>{t('launchersSubtitle')}</Typography>
        </Box>

        <CatalogFilters
          search={search}
          searchPlaceholderKey="searchLaunchers"
          category={category}
          secondaryFilter={status}
          sort={sort}
          categoryOptions={CATEGORY_OPTIONS}
          secondaryOptions={STATUS_OPTIONS}
          secondaryLabelKey="filterStatus"
          sortOptions={SORT_OPTIONS}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSecondaryChange={setStatus}
          onSortChange={setSort}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {filtered.length} {t('launchersFound')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {filtered.map((item) => (
            <CatalogCard key={item.id} item={item} placeholderType="launcher" onClick={() => setSelected(item)} />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noLaunchersFound')}</Typography>
          </Box>
        )}
      </Box>

      <CatalogDetailModal
        item={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        placeholderType="launcher"
        infographicTitleKey="launcherInfographic"
        stepsLabelKey="launchSteps"
        getCategoryLabel={(item) => {
          const labels: Record<string, string> = {
            heavyLift: t('catHeavyLift'),
            mediumLift: t('catMediumLift'),
            smallLift: t('catSmallLift'),
            reusable: t('catReusable'),
          }
          return labels[item.category] ?? item.category
        }}
      />
    </Box>
  )
}

export default LaunchersPage
