import { Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWelcomeAnimations } from '@/hooks/useWelcomeAnimations'
import { useWelcomeState } from '@/hooks/useWelcomeState'
import { getWelcomeFeatures } from '@/config/welcomeFeatures'
import WelcomeHeader from '@/components/features/welcome/WelcomeHeader'
import WelcomeFeatureCard from '@/components/features/welcome/WelcomeFeatureCard'
import type { NavigationConfig } from '@/types/navigation'

/**
 * Refactored Welcome page component
 * Follows architecture guide principles:
 * - Single responsibility: Page orchestration and layout
 * - Under 150 lines (reduced from 247 lines)
 * - Clean separation of concerns via hooks and components
 * - Composition over complex logic
 */
const WelcomePage = () => {
  const {
    prefersReducedMotion,
    containerVariants,
    cardVariants,
    headerVariants,
  } = useWelcomeAnimations()

  const {
    announcement,
    handleOpenTab,
    handleKeyDown,
    handleFocus,
    handleBlur,
  } = useWelcomeState()

  const features = getWelcomeFeatures(handleOpenTab)

  return (
    <div 
      className="h-full overflow-y-auto flex items-center justify-center" 
      role="main" 
      aria-label="Welcome to Task Writer"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="w-full max-w-6xl p-6">
        {/* Screen reader announcements */}
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        <div className="space-y-6">
          {/* Header */}
          <WelcomeHeader 
            headerVariants={headerVariants}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Features */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            aria-labelledby="features-heading"
          >
            <h2 id="features-heading" className="sr-only">Main application features</h2>
            
            {features.map((feature, index) => (
              <WelcomeFeatureCard
                key={feature.id}
                feature={feature}
                index={index}
                cardVariants={cardVariants}
                prefersReducedMotion={prefersReducedMotion}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onAction={() => feature.action(handleOpenTab)}
              />
            ))}
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage

// Export the navigation config for auto-discovery
export const navigationConfig: NavigationConfig = {
  id: 'welcome',
  label: 'Welcome',
  iconComponent: Home,
  showInSidebar: false,
  closable: true,
  order: 0,
}
