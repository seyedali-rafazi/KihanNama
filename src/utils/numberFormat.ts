const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

/**
 * Converts ASCII numbers (0-9) to Persian digits (۰-۹).
 */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (char) => PERSIAN_DIGITS[Number(char)] ?? char)
}

/**
 * Formats a number based on active language:
 * - 'fa' -> Persian digits (e.g. ۸۴)
 * - 'en' (or others) -> Latin digits (e.g. 84)
 */
export function formatLocalizedNumber(value: number | string, language: string): string {
  if (language === 'fa') {
    return toPersianDigits(value)
  }
  return String(value)
}
