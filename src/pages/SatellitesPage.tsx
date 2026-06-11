import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useLanguage } from '../context/LanguageContext'
import { SATELLITE_CATALOG } from '../data/satelliteCatalog'
import SatelliteCard from '../components/Satellites/SatelliteCard'
import SatelliteFilters from '../components/Satellites/SatelliteFilters'
import SatelliteDetailModal from '../components/Satellites/SatelliteDetailModal'
import PageHero from '../components/common/PageHero'
import type { OrbitClass, SatelliteCatalogEntry, SatelliteCategory, SortOption } from '../types/satellite'

const SATELLITE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1400&q=80'

function sortSatellites(items: SatelliteCatalogEntry[], sort: SortOption) {
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
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<SatelliteCategory | 'all'>('all')
  const [orbitClass, setOrbitClass] = useState<OrbitClass | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('nameAsc')
  const [selected, setSelected] = useState<SatelliteCatalogEntry | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    let result = SATELLITE_CATALOG

    if (query) {
      result = result.filter((sat) => {
        const desc = `${sat.descriptionEn} ${sat.descriptionFa}`.toLowerCase()
        return sat.name.toLowerCase().includes(query) || desc.includes(query)
      })
    }

    if (category !== 'all') {
      result = result.filter((sat) => sat.category === category)
    }

    if (orbitClass !== 'all') {
      result = result.filter((sat) => sat.orbitClass === orbitClass)
    }

    return sortSatellites(result, sort)
  }, [search, category, orbitClass, sort])

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
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onOrbitChange={setOrbitClass}
          onSortChange={setSort}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {filtered.length} {t('resultsCount')}
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
          {filtered.map((satellite) => (
            <SatelliteCard
              key={satellite.id}
              satellite={satellite}
              onClick={() => setSelected(satellite)}
            />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{t('noSatellitesFound')}</Typography>
          </Box>
        )}
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
