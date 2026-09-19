import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { useLanguage } from '../../context/LanguageContext'
import type { FilterOption } from '../../types/catalog'
import type { TranslationKey } from '../../i18n/translations'

type CatalogFiltersProps = {
  search: string
  searchPlaceholderKey: TranslationKey
  category: string
  secondaryFilter: string
  categoryOptions: FilterOption[]
  secondaryOptions: FilterOption[]
  secondaryLabelKey: TranslationKey
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSecondaryChange: (value: string) => void
}

function CatalogFilters({
  search,
  searchPlaceholderKey,
  category,
  secondaryFilter,
  categoryOptions,
  secondaryOptions,
  secondaryLabelKey,
  onSearchChange,
  onCategoryChange,
  onSecondaryChange,
}: CatalogFiltersProps) {
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
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
      <TextField
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearchChange(searchTerm)
          }
        }}
        placeholder={t(searchPlaceholderKey)}
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
        onChange={(e) => onCategoryChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value="all">{t('filterAll')}</MenuItem>
        {categoryOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {t(opt.labelKey as TranslationKey)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label={t(secondaryLabelKey)}
        value={secondaryFilter}
        onChange={(e) => onSecondaryChange(e.target.value)}
        sx={selectSx}
      >
        <MenuItem value="all">{t('filterAll')}</MenuItem>
        {secondaryOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {t(opt.labelKey as TranslationKey)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

export default CatalogFilters
