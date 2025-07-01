import type { ElementType } from 'react'

// Configuration interface (what pages export)
export interface NavigationConfig {
  id: string
  label: string
  iconComponent?: ElementType // Use ElementType directly
  showInSidebar: boolean
  defaultVisible?: boolean // Whether this item should be visible by default (overrides showInSidebar for initial state)
  order?: number
  position?: 'left' | 'right'
  group?: string
  closable?: boolean
}

export interface NavigationItem extends NavigationConfig {
  page: React.ComponentType<unknown>
  panel?: React.ComponentType<unknown>
}

