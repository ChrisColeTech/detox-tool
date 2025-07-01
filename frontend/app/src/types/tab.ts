import * as React from 'react'

export interface Tab {
  id: string
  title: string
  label: string
  icon?: React.ReactNode
  isActive: boolean
  closable?: boolean // Added based on useTabs implementation
}

