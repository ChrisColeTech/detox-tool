import React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

const cardVariants = {
  default: 'bg-surface border border-border',
  elevated: 'bg-surface shadow-lg border border-border/50',
  outlined: 'bg-transparent border-2 border-border',
  glass: 'bg-surface/80 backdrop-blur-md border border-border/30 shadow-xl',
}

const cardPadding = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive = false,
  onClick,
}) => {
  const Component = 'div'

  return (
    <Component
      className={clsx(
        'rounded-lg transition-all duration-200',
        cardVariants[variant],
        cardPadding[padding],
        interactive && 'cursor-pointer hover:shadow-md hover:scale-105',
        onClick && 'cursor-pointer hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx('pb-3 border-b border-border/50', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className, 
  as: Component = 'h3' 
}) => {
  return (
    <Component className={clsx('text-lg font-semibold text-text', className)}>
      {children}
    </Component>
  )
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <p className={clsx('text-sm text-text-muted mt-1', className)}>
      {children}
    </p>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={clsx('pt-3', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={clsx('pt-3 border-t border-border/50 mt-3', className)}>
      {children}
    </div>
  )
}
