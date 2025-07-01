export function formatTitle(title: string): string {
  return title.charAt(0).toUpperCase() + title.slice(1)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getStorageKey(key: string): string {
  return `task-writer-${key}`
}

export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (jsonString === null) return fallback
  try {
    return JSON.parse(jsonString) || fallback
  } catch {
    return fallback
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

