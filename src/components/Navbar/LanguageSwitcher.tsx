import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LanguageIcon from '@mui/icons-material/Language'
import { alpha, useTheme } from '@mui/material/styles'
import { useLanguage } from '../../context/LanguageContext'
import type { Language } from '../../i18n/translations'

type LanguageSwitcherProps = {
  compact?: boolean
}

function getLanguageLabel(value: Language, t: (key: 'english' | 'persian') => string) {
  return value === 'en' ? t('english') : t('persian')
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, t, dir } = useLanguage()
  const theme = useTheme()

  return (
    <Box
      dir={dir}
      className="language-select"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: compact ? 'stretch' : undefined,
        gap: 0.75,
        width: compact ? '100%' : 'auto',
        direction: dir,
      }}
    >
      {!compact && <LanguageIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />}
      <FormControl
        size="small"
        sx={{
          width: compact ? '100%' : 'auto',
          minWidth: compact ? 0 : 120,
          flex: compact ? 1 : undefined,
        }}
      >
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          dir={dir}
          MenuProps={{
            slotProps: {
              paper: {
                dir,
                sx: { direction: dir },
              },
            },
          }}
          renderValue={(value) => (
            <Box
              component="span"
              style={{
                display: 'block',
                width: '100%',
                textAlign: dir === 'rtl' ? 'right' : 'left',
              }}
            >
              {getLanguageLabel(value as Language, t)}
            </Box>
          )}
          sx={{
            width: '100%',
            fontSize: '0.85rem',
            color: 'text.primary',
            bgcolor: alpha(theme.palette.common.white, 0.04),
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            direction: dir,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.07) },
            '& .MuiSelect-select': {
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <MenuItem
            value="en"
            style={{ textAlign: dir === 'rtl' ? 'right' : 'left', direction: dir }}
          >
            {t('english')}
          </MenuItem>
          <MenuItem
            value="fa"
            style={{ textAlign: dir === 'rtl' ? 'right' : 'left', direction: dir }}
          >
            {t('persian')}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default LanguageSwitcher
