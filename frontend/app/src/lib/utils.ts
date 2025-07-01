import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// cn utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Other general utilities can be added here

