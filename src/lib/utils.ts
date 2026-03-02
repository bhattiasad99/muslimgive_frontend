import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrencySymbol(countryCode?: string | null): string {
  if (countryCode === 'united-kingdom') return '£'
  if (countryCode === 'canada' || countryCode === 'united-states') return '$'
  return '$'
}

export function getCurrencyCode(countryCode?: string | null): string {
  if (countryCode === 'united-kingdom') return 'GBP'
  if (countryCode === 'canada') return 'CAD'
  if (countryCode === 'united-states') return 'USD'
  return 'USD'
}
