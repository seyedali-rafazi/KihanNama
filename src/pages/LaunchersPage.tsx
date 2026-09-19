import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useLanguage } from '../context/LanguageContext'
import CatalogCard from '../components/Catalog/CatalogCard'
import CatalogFilters from '../components/Catalog/CatalogFilters'
import CatalogDetailModal from '../components/Catalog/CatalogDetailModal'
import PageHero from '../components/common/PageHero'
import AppPagination from '../components/common/AppPagination'
import { useLaunchersQuery } from '../hooks/queries'
import { type CatalogEntry, type FilterOption } from '../types/catalog'

const LAUNCHER_HERO_IMAGE = '/launchers-page.webp'
const PAGE_SIZE = 12

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

function LaunchersPage() {
  const { t } = useLanguage()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<CatalogEntry | null>(null)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    setPage(1)
  }

  const handleStatusChange = (val: string) => {
    setStatus(val)
    setPage(1)
  }

  // Fetch paginated launchers with React Query from backend API
  const { items: launcherData, total, isLoading } = useLaunchersQuery({
    category: category !== 'all' ? category : undefined,
    status: status !== 'all' ? status : undefined,
    search: search.trim() || undefined,
    page,
    limit: PAGE_SIZE,
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
          categoryOptions={CATEGORY_OPTIONS}
          secondaryOptions={STATUS_OPTIONS}
          secondaryLabelKey="filterStatus"
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSecondaryChange={handleStatusChange}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {total} {t('launchersFound')}
          </Typography>
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
            {launcherData.map((item) => (
              <CatalogCard key={item.id} item={item} placeholderType="launcher" onClick={() => setSelected(item)} />
            ))}
          </Box>
        )}

        {!isLoading && total === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noLaunchersFound')}</Typography>
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
