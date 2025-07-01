import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface SettingsSectionProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  onReset?: () => void
  resetText?: string
}

/**
 * Shared component for settings section with feature card pattern
 * Follows architecture guide principles:
 * - Single responsibility: Settings section with proper card structure
 * - Under 100 lines
 * - Clean props interface
 * - Reusable across all settings components
 * - Feature card pattern compliance
 */
const SettingsSection: React.FC<SettingsSectionProps> = ({
  icon: Icon,
  title,
  children,
  onReset,
  resetText = "Reset to defaults",
}) => {
  const prefersReducedMotion = useReducedMotion()

  const cardVariants = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
  }

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-surface app-border overflow-hidden transition-all duration-300 group motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]"
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}
      role="region"
    >
      {/* Feature Card Header */}
      <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110" role="img" aria-hidden="true">
              <Icon className="w-6 h-6 text-accent motion-safe:group-hover:text-accent-hover transition-colors" />
            </div>
            <h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-title`} className="text-xl font-semibold text-text">
              {title}
            </h2>
          </div>
          
          {onReset && (
            <button
              onClick={onReset}
              className="text-sm text-accent hover:text-accent-hover focus:text-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface px-2 py-1 rounded"
              aria-label={`${resetText} for ${title}`}
            >
              {resetText}
            </button>
          )}
        </div>
      </div>
      
      {/* Feature Card Content */}
      <div className="p-6">
        <div className="grid gap-6">
          {children}
        </div>
      </div>
    </motion.article>
  )
}

export default SettingsSection
