import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface WelcomeHeaderProps {
  headerVariants: any
  prefersReducedMotion: boolean
}

/**
 * Component for Welcome page header
 * Follows architecture guide principles:
 * - Single responsibility: Header display and branding
 * - Under 100 lines
 * - Clean props interface
 * - Accessibility focused
 */
const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  headerVariants,
  prefersReducedMotion,
}) => {
  return (
    <motion.header
      {...headerVariants}
      className="text-center"
    >
      <div className="bg-surface app-border overflow-hidden mb-6 motion-reduce:transform-none hover:shadow-theme transition-shadow duration-300">
        <div className="bg-gradient-to-r from-surface to-background px-6 py-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-text flex items-center gap-3" id="welcome-title">
              Task Writer
              <div 
                className="page-icon flex items-center" 
                role="img" 
                aria-label="Task Writer application logo"
              >
                <Sparkles 
                  className={`text-accent w-8 h-8 ${prefersReducedMotion ? '' : 'motion-safe:animate-spin-slow motion-safe:hover:animate-pulse'}`}
                  aria-hidden="true"
                />
              </div>
            </h1>
          </div>
          <p className="text-base text-text-muted" id="welcome-subtitle">
            AI-Powered Development Assistant
          </p>
        </div>
      </div>
    </motion.header>
  )
}

export default WelcomeHeader
