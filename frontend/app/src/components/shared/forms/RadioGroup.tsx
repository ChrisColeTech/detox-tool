import React from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  title: string
  name: string
  value: string
  options: RadioOption[]
  onChange: (value: string) => void
  layout?: 'vertical' | 'horizontal' | 'grid'
  gridCols?: number
}

/**
 * Shared component for radio button groups
 * Follows architecture guide principles:
 * - Single responsibility: Radio group layout
 * - Under 100 lines
 * - Clean props interface
 * - Flexible layout options
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  title,
  name,
  value,
  options,
  onChange,
  layout = 'vertical',
  gridCols = 2,
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-6'
      case 'grid':
        return `grid grid-cols-${gridCols} gap-2`
      default:
        return 'space-y-2'
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-text">{title}</h4>
      
      <div className={getLayoutClasses()}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-accent app-border focus:ring-2 focus:ring-accent"
            />
            <div className="flex-1">
              <span className="text-sm text-text capitalize">
                {option.label.replace('-', ' ')}
              </span>
              {option.description && (
                <p className="text-xs text-text-muted mt-1">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

export default RadioGroup
