import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { WelcomeFeature } from '@/config/welcomeFeatures'

interface WelcomeFeatureCardProps {
  feature: WelcomeFeature
  index: number
  cardVariants: any
  prefersReducedMotion: boolean
  onFocus: (index: number) => void
  onBlur: () => void
  onAction: () => void
}

/**
 * Component for individual Welcome page feature cards
 * Follows architecture guide principles:
 * - Single responsibility: Feature card display and interaction
 * - Under 150 lines
 * - Clean props interface
 * - Accessibility focused
 */
const WelcomeFeatureCard: React.FC<WelcomeFeatureCardProps> = ({
  feature,
  index,
  cardVariants,
  prefersReducedMotion,
  onFocus,
  onBlur,
  onAction,
}) => {
  return (
    <motion.article
      variants={cardVariants}
      className={`bg-surface app-border overflow-hidden transition-all duration-300 group focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background ${
        prefersReducedMotion ? '' : 'motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]'
      }`}
      aria-labelledby={`feature-${feature.id}-title`}
      role="region"
    >
      <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
        <div className="flex items-center gap-3">
          <div 
            className={`page-icon transition-transform duration-300 ${prefersReducedMotion ? '' : 'motion-safe:group-hover:scale-110'}`} 
            role="img" 
            aria-hidden="true"
          >
            <feature.icon className="w-6 h-6 text-accent motion-safe:group-hover:text-accent-hover transition-colors" />
          </div>
          <h3 id={`feature-${feature.id}-title`} className="text-xl font-semibold text-text">
            {feature.title}
          </h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Description */}
        <p className="text-text-muted leading-relaxed">
          {feature.description}
        </p>

        {/* Action Button */}
        <button
          onClick={onAction}
          onFocus={() => onFocus(index)}
          onBlur={onBlur}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-base bg-accent hover:bg-accent-hover focus:bg-accent-hover app-border-accent rounded-md transition-all duration-300 text-text-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
            prefersReducedMotion ? '' : 'motion-safe:hover:shadow-theme motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0'
          }`}
          aria-label={feature.ariaLabel}
          type="button"
        >
          <ArrowRight 
            className={`w-4 h-4 transition-transform ${prefersReducedMotion ? '' : 'motion-safe:group-hover:translate-x-1'}`} 
            aria-hidden="true" 
          />
          <span>Get Started with {feature.title}</span>
        </button>
      </div>
    </motion.article>
  )
}

export default WelcomeFeatureCard
