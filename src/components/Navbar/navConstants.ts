import type { TranslationKey } from '../../i18n/translations'

export type NavItem = {
  to: string
  key: TranslationKey
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'home' },
  { to: '/satellites', key: 'satellites' },
  { to: '/launchers', key: 'launchers' },
  { to: '/satellite-station', key: 'satelliteStation' },
]

export const DRAWER_BG = '#000000'
