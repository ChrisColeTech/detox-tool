import React from 'react'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'url'
  className?: string
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

/**
 * Shared component for text inputs
 * Follows architecture guide principles:
 * - Single responsibility: Text input with consistent styling
 * - Under 50 lines
 * - Clean props interface
 * - Support for different input types
 */
const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
  className = '',
  onKeyPress,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 app-border rounded-md bg-surface text-text placeholder-text-muted focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  )
}

export default TextInput
