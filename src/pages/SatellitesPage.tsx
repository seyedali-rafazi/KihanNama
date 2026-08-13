import { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLanguage } from '../context/LanguageContext'
import { SATELLITE_CATALOG } from '../data/satelliteCatalog'
import SatelliteCard from '../components/Satellites/SatelliteCard'
import SatelliteFilters from '../components/Satellites/SatelliteFilters'
import SatelliteDetailModal from '../components/Satellites/SatelliteDetailModal'
import PageHero from '../components/common/PageHero'
import { useCatalogFilter } from '../hooks/useCatalogFilter'
import type { OrbitClass, SatelliteCatalogEntry, SatelliteCategory, SortOption } from '../types/satellite'

const SATELLITE_HERO_IMAGE = '/satellite-page.webp'

function sortSatellites(items: SatelliteCatalogEntry[], sort: SortOption): SatelliteCatalogEntry[] {
  const sorted = [...items]
  switch (sort) {
    case 'nameAsc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'nameDesc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'altitudeAsc':
      return sorted.sort((a, b) => a.altitude - b.altitude)
    case 'altitudeDesc':
      return sorted.sort((a, b) => b.altitude - a.altitude)
    case 'periodAsc':
      return sorted.sort((a, b) => a.period - b.period)
    case 'periodDesc':
      return sorted.sort((a, b) => b.period - a.period)
    default:
      return sorted
  }
}

function SatellitesPage() {
  const { t } = useLanguage()

  const filterPredicate = useCallback(
    (sat: SatelliteCatalogEntry, query: string, category: string, orbitClass: string) => {
      if (query) {
        const desc = `${sat.descriptionEn} ${sat.descriptionFa}`.toLowerCase()
        if (!sat.name.toLowerCase().includes(query) && !desc.includes(query)) {
          return false
        }
      }
      if (category !== 'all' && sat.category !== category) return false
      if (orbitClass !== 'all' && sat.orbitClass !== orbitClass) return false
      return true
    },
    [],
  )

  const {
    search,
    setSearch,
    category,
    setCategory,
    secondaryFilter: orbitClass,
    setSecondaryFilter: setOrbitClass,
    sort,
    setSort,
    selected,
    setSelected,
    clearSelected,
    filteredItems,
    count,
  } = useCatalogFilter<SatelliteCatalogEntry, SortOption>({
    items: SATELLITE_CATALOG,
    initialSort: 'nameAsc',
    filterPredicate,
    sortComparator: sortSatellites,
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
          category={category as SatelliteCategory | 'all'}
          orbitClass={orbitClass as OrbitClass | 'all'}
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onOrbitChange={setOrbitClass}
          onSortChange={setSort}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {count} {t('resultsCount')}
        </Typography>

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
          {filteredItems.map((satellite) => (
            <SatelliteCard
              key={satellite.id}
              satellite={satellite}
              onClick={() => setSelected(satellite)}
            />
          ))}
        </Box>

        {count === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noSatellitesFound')}</Typography>
          </Box>
        )}
      </Box>

      <SatelliteDetailModal
        satellite={selected}
        open={Boolean(selected)}
        onClose={clearSelected}
      />
    </Box>
  )
}

export default SatellitesPage
