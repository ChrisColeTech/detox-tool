import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Hash, Folder, Settings as SettingsIcon, Zap, FileText, Code, Layers } from 'lucide-react'
import type { SearchResult } from '@/data/searchData'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Navigation': return Hash
    case 'Tools': return Zap
    case 'Features': return FileText
    case 'Configuration': return SettingsIcon
    case 'Organization': return Folder
    case 'Preview': return Code
    case 'Options': return Layers
    case 'Appearance': return Layers
    case 'Accessibility': return SettingsIcon
    case 'Layout': return Folder
    case 'Core': return Zap
    case 'Export': return FileText
    case 'Interaction': return Hash
    case 'Help': return FileText
    case 'Reference': return Code
    case 'Templates': return Folder
    default: return Hash
  }
}

/**
 * Component for displaying spotlight search results
 * Follows architecture guide principles:
 * - Single responsibility: Search results display
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedIndex,
  onSelect,
}) => {
  const prefersReducedMotion = useReducedMotion()

  if (results.length === 0) {
    return null
  }

  return (
    <div className="p-6 space-y-2 max-h-80 overflow-y-auto">
      {results.map((result, index) => {
        const IconComponent = getCategoryIcon(result.category)
        const isSelected = index === selectedIndex
        
        return (
          <motion.div
            key={result.id}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, delay: index * 0.05 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-300 group focus-within:ring-2 focus-within:ring-accent ${
              isSelected 
                ? 'bg-accent text-text-background motion-safe:scale-[1.02]' 
                : 'hover:bg-surface-hover motion-safe:hover:scale-[1.01]'
            }`}
            onClick={() => onSelect(result)}
            role="option"
            aria-selected={isSelected}
            tabIndex={-1}
          >
            <div className={`page-icon transition-transform duration-300 motion-safe:group-hover:scale-110 ${
              isSelected 
                ? 'bg-text-background/20' 
                : ''
            }`} role="img" aria-hidden="true">
              <IconComponent 
                className={`w-5 h-5 ${
                  isSelected ? 'text-text-background' : 'text-accent'
                }`}
                aria-hidden="true"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold truncate ${
                  isSelected ? 'text-text-background' : 'text-text'
                }`}>
                  {result.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-text-background/20 text-text-background/80' 
                    : 'bg-surface text-text-muted'
                }`}>
                  {result.category}
                </span>
              </div>
              <p className={`text-sm truncate ${
                isSelected ? 'text-text-background/80' : 'text-text-muted'
              }`}>
                {result.description}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SearchResults
