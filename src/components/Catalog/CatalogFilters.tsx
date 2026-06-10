import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { useLanguage } from '../../context/LanguageContext'
import type { CatalogSortOption, FilterOption } from '../../types/catalog'
import type { TranslationKey } from '../../i18n/translations'

type CatalogFiltersProps = {
  search: string
  searchPlaceholderKey: TranslationKey
  category: string
  secondaryFilter: string
  sort: CatalogSortOption
  categoryOptions: FilterOption[]
  secondaryOptions: FilterOption[]
  secondaryLabelKey: TranslationKey
  sortOptions: { value: CatalogSortOption; labelKey: TranslationKey }[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSecondaryChange: (value: string) => void
  onSortChange: (value: CatalogSortOption) => void
}

function CatalogFilters({
  search,
  searchPlaceholderKey,
  category,
  secondaryFilter,
  sort,
  categoryOptions,
  secondaryOptions,
  secondaryLabelKey,
  sortOptions,
  onSearchChange,
  onCategoryChange,
  onSecondaryChange,
  onSortChange,
}: CatalogFiltersProps) {
  const { t } = useLanguage()
  const selectSx = { minWidth: { xs: '100%', sm: 160 } }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
      <TextField
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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

      <TextField
        select
        size="small"
        label={t('sortBy')}
        value={sort}
        onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
        sx={selectSx}
      >
        {sortOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

export default CatalogFilters
