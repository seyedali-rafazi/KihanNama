import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useLanguage } from '../context/LanguageContext'
import SatelliteCard from '../components/Satellites/SatelliteCard'
import SatelliteFilters from '../components/Satellites/SatelliteFilters'
import SatelliteDetailModal from '../components/Satellites/SatelliteDetailModal'
import PageHero from '../components/common/PageHero'
import BackendStatusBadge from '../components/common/BackendStatusBadge'
import AppPagination from '../components/common/AppPagination'
import { useSatellitesQuery } from '../hooks/queries'
import type { OrbitClass, SatelliteCatalogEntry, SatelliteCategory } from '../types/satellite'

const SATELLITE_HERO_IMAGE = '/satellite-page.webp'
const PAGE_SIZE = 12

function SatellitesPage() {
  const { t } = useLanguage()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<SatelliteCategory | 'all'>('all')
  const [orbitClass, setOrbitClass] = useState<OrbitClass | 'all'>('all')
  const [selected, setSelected] = useState<SatelliteCatalogEntry | null>(null)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleCategoryChange = (val: SatelliteCategory | 'all') => {
    setCategory(val)
    setPage(1)
  }

  const handleOrbitChange = (val: OrbitClass | 'all') => {
    setOrbitClass(val)
    setPage(1)
  }

  // Fetch paginated satellites with React Query from backend API
  const { satellites, total, isLoading } = useSatellitesQuery({
    search: search.trim() || undefined,
    category: category !== 'all' ? category : undefined,
    orbit_class: orbitClass !== 'all' ? orbitClass : undefined,
    page,
    limit: PAGE_SIZE,
  })

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHero
          title={t('satellitesTitle')}
          subtitle={t('satellitesSubtitle')}
          imageUrl={SATELLITE_HERO_IMAGE}
        />

        <SatelliteFilters
          search={search}
          category={category}
          orbitClass={orbitClass}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onOrbitChange={handleOrbitChange}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {total} {t('resultsCount')}
          </Typography>
          <BackendStatusBadge />
        </Box>

        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2.5,
            }}
          >
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2.5,
            }}
          >
            {satellites.map((satellite) => (
              <SatelliteCard
                key={satellite.id}
                satellite={satellite}
                onClick={() => setSelected(satellite)}
              />
            ))}
          </Box>
        )}

        {!isLoading && total === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noSatellitesFound')}</Typography>
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

      <SatelliteDetailModal
        satellite={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </Box>
  )
}

export default SatellitesPage
