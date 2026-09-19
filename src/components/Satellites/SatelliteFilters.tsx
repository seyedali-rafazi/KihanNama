import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { useLanguage } from '../../context/LanguageContext'
import type { OrbitClass, SatelliteCategory } from '../../types/satellite'

type SatelliteFiltersProps = {
  search: string
  category: SatelliteCategory | 'all'
  orbitClass: OrbitClass | 'all'
  onSearchChange: (value: string) => void
  onCategoryChange: (value: SatelliteCategory | 'all') => void
  onOrbitChange: (value: OrbitClass | 'all') => void
}

function SatelliteFilters({
  search,
  category,
  orbitClass,
  onSearchChange,
  onCategoryChange,
  onOrbitChange,
}: SatelliteFiltersProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    setSearchTerm(search)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        onSearchChange(searchTerm)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm, search, onSearchChange])

  const selectSx = { minWidth: { xs: '100%', sm: 160 } }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 3,
      }}
    >
      <TextField
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearchChange(searchTerm)
          }
        }}
        placeholder={t('searchSatellites')}
        sx={{ flex: { xs: '1 1 100%', sm: '1 1 240px' }, maxWidth: { sm: 320 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        size="small"
        label={t('filterCategory')}
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as SatelliteCategory | 'all')}
        sx={selectSx}
      >
        <MenuItem value="all">{t('filterAll')}</MenuItem>
        <MenuItem value="earthObservation">{t('catEarthObservation')}</MenuItem>
        <MenuItem value="navigation">{t('catNavigation')}</MenuItem>
        <MenuItem value="weather">{t('catWeather')}</MenuItem>
        <MenuItem value="communications">{t('catCommunications')}</MenuItem>
        <MenuItem value="science">{t('catScience')}</MenuItem>
        <MenuItem value="station">{t('catStation')}</MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        label={t('filterOrbit')}
        value={orbitClass}
        onChange={(e) => onOrbitChange(e.target.value as OrbitClass | 'all')}
        sx={selectSx}
      >
        <MenuItem value="all">{t('filterAll')}</MenuItem>
        <MenuItem value="leo">LEO</MenuItem>
        <MenuItem value="meo">MEO</MenuItem>
        <MenuItem value="geo">GEO</MenuItem>
      </TextField>
    </Box>
  )
}

export default SatelliteFilters
