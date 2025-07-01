// Welcome page feature components
export { default as WelcomeHeader } from './WelcomeHeader'
export { default as WelcomeFeatureCard } from './WelcomeFeatureCard'

// Re-export related hooks and config
export { useWelcomeAnimations } from '@/hooks/useWelcomeAnimations'
export { useWelcomeState } from '@/hooks/useWelcomeState'
export { getWelcomeFeatures, type WelcomeFeature } from '@/config/welcomeFeatures'
