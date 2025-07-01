import { useReducedMotion } from 'framer-motion'

/**
 * Custom hook for managing Welcome page animations
 * Follows architecture guide principles:
 * - Single responsibility: Animation configuration and variants
 * - Clean separation from UI logic
 * - Responsive to accessibility preferences
 */
export const useWelcomeAnimations = () => {
  const prefersReducedMotion = useReducedMotion() ?? false

  // Animation variants for reduced motion support
  const createAnimationVariants = (customDuration?: number) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { 
      duration: customDuration || 0.4,
      ease: "easeOut"
    }
  })

  // Staggered animation for cards container
  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  }

  // Individual card animation variants
  const cardVariants = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.5, 
        ease: "easeOut" 
      }
    }
  }

  // CSS classes for motion-safe animations
  const getMotionClasses = (baseClasses: string, motionClasses: string) => {
    return prefersReducedMotion ? baseClasses : `${baseClasses} ${motionClasses}`
  }

  // Header animation with custom duration
  const headerVariants = createAnimationVariants(0.6)

  return {
    prefersReducedMotion,
    createAnimationVariants,
    containerVariants,
    cardVariants,
    headerVariants,
    getMotionClasses,
  }
}
