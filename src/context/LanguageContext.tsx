import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { translations, type Language, type TranslationKey } from '../i18n/translations'

const LANGUAGE_STORAGE_KEY = 'kihannama-language'

export type Direction = 'ltr' | 'rtl'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
  dir: Direction
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === 'en' || stored === 'fa') return stored
  } catch {
    // Ignore localStorage access errors (e.g. incognito restrictions)
  }
  return 'fa'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)
  const dir: Direction = language === 'fa' ? 'rtl' : 'ltr'

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      // Ignore localStorage access errors
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const t = useCallback(
    (key: TranslationKey) => translations[language][key] ?? key,
    [language],
  )

  const value: LanguageContextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      dir,
    }),
    [language, setLanguage, t, dir],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
