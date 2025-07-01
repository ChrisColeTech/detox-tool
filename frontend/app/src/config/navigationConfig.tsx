import * as React from 'react'
import type { NavigationItem, NavigationConfig } from '@/types/navigation'
import { createIconElement } from '@/utils/iconUtils'

const getPageModules = () => import.meta.glob('../pages/**/[A-Z]*Page.tsx', { eager: true })

const getPanelModules = () => import.meta.glob('../pages/**/[A-Z]*Panel.tsx', { eager: true })

let cachedNavigationItems: NavigationItem[] | null = null

const buildNavigationItems = (): NavigationItem[] => {
  if (cachedNavigationItems) {
    return cachedNavigationItems
  }

  const pageModules = getPageModules()
  const panelModules = getPanelModules()
  
  cachedNavigationItems = Object.entries(pageModules)
  .map(([pagePath, pageModule]) => {
    const folderMatch = pagePath.match(/\/pages\/([^/]+)\//)
    let folderName = folderMatch?.[1]

    if (!folderName) {
      const fileMatch = pagePath.match(/\/pages\/([^/]+)\.tsx$/)
      folderName = fileMatch?.[1]?.replace('Page', '').toLowerCase()
    }

    const typedPageModule = pageModule as {
      navigationConfig?: NavigationConfig
      default?: React.ComponentType<unknown>
    }

    if (!typedPageModule?.navigationConfig || !folderName || !typedPageModule?.default) {
      return null
    }

    const panelPath = Object.keys(panelModules).find(
      (path) => path.includes(`/pages/${folderName}/`) && path.includes('Panel.tsx'),
    )

    const panelModule = panelPath
      ? (panelModules[panelPath] as { default?: React.ComponentType<unknown> })
      : null

    return {
      ...typedPageModule.navigationConfig,
      page: typedPageModule.default,
      panel: panelModule?.default || undefined,
    } as NavigationItem
  })
    .filter((item): item is NavigationItem => item !== null)
    .sort((a, b) => (a.order || 999) - (b.order || 999))

  return cachedNavigationItems
}

export const getNavigationItem = (id: string): NavigationItem | undefined => {
  return buildNavigationItems().find((item) => item.id === id)
}

export const getAllNavigationItems = (): NavigationItem[] => {
  return buildNavigationItems()
}

export const getSidebarItems = (): NavigationItem[] => {
  return buildNavigationItems().filter((item) => item.showInSidebar)
}

export const getPageComponent = (id: string): React.ComponentType<unknown> | undefined => {
  const item = getNavigationItem(id)
  return item?.page
}

export const getPanelComponent = (id: string): React.ComponentType<unknown> | undefined => {
  const item = getNavigationItem(id)
  return item?.panel
}

export const getIcon = (id: string, size: number): React.ReactElement | null => {
  const item = getNavigationItem(id)
  if (item?.iconComponent) {
    return createIconElement(item.iconComponent, size)
  }
  const panelModules = getPanelModules()
  const panelItem = panelModules[
    `../pages/${id.replace('-panel', '')}/${
      id.charAt(0).toUpperCase() + id.slice(1).replace('-panel', '')
    }Panel.tsx`
  ] as { navigationConfig?: NavigationConfig }
  if (panelItem?.navigationConfig?.iconComponent) {
    return createIconElement(panelItem.navigationConfig.iconComponent, size)
  }
  return null
}

export const getTabIcon = (id: string): React.ReactElement | null => {
  return getIcon(id, 12)
}

export const getSidebarIcon = (id: string): React.ReactElement | null => {
  return getIcon(id, 16)
}

export const getPageIcon = (id: string, className?: string): React.ReactElement | null => {
  const item = getNavigationItem(id)
  if (item?.iconComponent) {
    return createIconElement(item.iconComponent, className || 'w-5 h-5')
  }
  return getIcon(id, 20)
}

export const getTabTitle = (id: string): string => {
  const item = getNavigationItem(id)
  return item?.label || id
}

