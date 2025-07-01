import React from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const buttonVariants = {
  primary: [
    'bg-accent text-white border-accent',
    'hover:bg-accent-hover hover:border-accent-hover',
    'focus:ring-2 focus:ring-accent/20',
    'disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500',
  ].join(' '),
  
  secondary: [
    'bg-surface text-text border-border',
    'hover:bg-surface-hover',
    'focus:ring-2 focus:ring-accent/20',
    'disabled:bg-gray-100 disabled:text-gray-400',
  ].join(' '),
  
  outline: [
    'bg-transparent text-text border-border',
    'hover:bg-surface-hover',
    'focus:ring-2 focus:ring-accent/20',
    'disabled:text-gray-400 disabled:border-gray-200',
  ].join(' '),
  
  ghost: [
    'bg-transparent text-text border-transparent',
    'hover:bg-surface-hover',
    'focus:ring-2 focus:ring-accent/20',
    'disabled:text-gray-400',
  ].join(' '),
  
  destructive: [
    'bg-red-500 text-white border-red-500',
    'hover:bg-red-600 hover:border-red-600',
    'focus:ring-2 focus:ring-red-500/20',
    'disabled:bg-red-300 disabled:border-red-300',
  ].join(' '),
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium border rounded-md',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-offset-2 focus:ring-offset-background',
        'disabled:cursor-not-allowed',
        'hover:scale-105 active:scale-95',
        
        // Variant styles
        buttonVariants[variant],
        
        // Size styles
        buttonSizes[size],
        
        // Width
        fullWidth && 'w-full',
        
        // Custom className
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2 flex-shrink-0">{leftIcon}</span>
      )}
      
      <span className="truncate">{children}</span>
      
      {!loading && rightIcon && (
        <span className="ml-2 flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}

// Button group component for related actions
interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal'
}) => {
  return (
    <div
      className={clsx(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        '[&>button]:rounded-none',
        '[&>button:first-child]:rounded-l-md',
        '[&>button:last-child]:rounded-r-md',
        orientation === 'vertical' && [
          '[&>button:first-child]:rounded-t-md [&>button:first-child]:rounded-l-none',
          '[&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none'
        ],
        '[&>button:not(:first-child)]:border-l-0',
        orientation === 'vertical' && '[&>button:not(:first-child)]:border-l [&>button:not(:first-child)]:border-t-0',
        className
      )}
    >
      {children}
    </div>
  )
}
