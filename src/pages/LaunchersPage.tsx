import { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLanguage } from '../context/LanguageContext'
import { LAUNCHER_CATALOG } from '../data/launcherCatalog'
import CatalogCard from '../components/Catalog/CatalogCard'
import CatalogFilters from '../components/Catalog/CatalogFilters'
import CatalogDetailModal from '../components/Catalog/CatalogDetailModal'
import PageHero from '../components/common/PageHero'
import { useCatalogFilter } from '../hooks/useCatalogFilter'
import { sortCatalog, type CatalogEntry, type CatalogSortOption, type FilterOption } from '../types/catalog'

const LAUNCHER_HERO_IMAGE = '/launchers-page.webp'

const CATEGORY_OPTIONS: FilterOption[] = [
  { value: 'heavyLift', labelKey: 'catHeavyLift' },
  { value: 'mediumLift', labelKey: 'catMediumLift' },
  { value: 'smallLift', labelKey: 'catSmallLift' },
  { value: 'reusable', labelKey: 'catReusable' },
]

const STATUS_OPTIONS: FilterOption[] = [
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

  const filterPredicate = useCallback(
    (item: CatalogEntry, query: string, category: string, status: string) => {
      if (query) {
        const text = `${item.name} ${item.descriptionEn} ${item.descriptionFa} ${item.operatorEn}`.toLowerCase()
        if (!text.includes(query)) return false
      }
      if (category !== 'all' && item.category !== category) return false
      if (status !== 'all' && item.secondary !== status) return false
      return true
    },
    [],
  )

  const {
    search,
    setSearch,
    category,
    setCategory,
    secondaryFilter: status,
    setSecondaryFilter: setStatus,
    sort,
    setSort,
    selected,
    setSelected,
    clearSelected,
    filteredItems,
    count,
  } = useCatalogFilter<CatalogEntry, CatalogSortOption>({
    items: LAUNCHER_CATALOG,
    initialSort: 'nameAsc',
    filterPredicate,
    sortComparator: sortCatalog,
  })

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHero
          title={t('launchersTitle')}
          subtitle={t('launchersSubtitle')}
          imageUrl={LAUNCHER_HERO_IMAGE}
        />

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
          {count} {t('launchersFound')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {filteredItems.map((item) => (
            <CatalogCard key={item.id} item={item} placeholderType="launcher" onClick={() => setSelected(item)} />
          ))}
        </Box>

        {count === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noLaunchersFound')}</Typography>
          </Box>
        )}
      </Box>

      <CatalogDetailModal
        item={selected}
        open={Boolean(selected)}
        onClose={clearSelected}
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
