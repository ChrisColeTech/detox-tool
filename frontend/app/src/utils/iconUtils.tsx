import React from 'react'

export const createIconElement = (IconComponent: React.ElementType, sizeOrClassName: number | string) => {
  // If it's a string, treat it as className for CSS-based sizing
  if (typeof sizeOrClassName === 'string') {
    return <IconComponent className={sizeOrClassName} />
  }
  // Otherwise, use the legacy size prop
  return <IconComponent size={sizeOrClassName} />
}

export const getIconSizeForContext = (
  context: 'sidebar' | 'tab' | 'page',
  iconSize: 'small' | 'medium' | 'large',
) => {
  const sizeMap = {
    sidebar: {
      small: 14,
      medium: 16,
      large: 18,
    },
    tab: {
      small: 10,
      medium: 12,
      large: 14,
    },
    page: {
      small: 18,
      medium: 20,
      large: 22,
    },
  }

  return sizeMap[context][iconSize]
}

