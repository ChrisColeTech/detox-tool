import React from 'react'

interface CheckboxOption {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

interface CheckboxGroupProps {
  title: string
  options: CheckboxOption[]
  layout?: 'vertical' | 'horizontal'
}

/**
 * Shared component for checkbox groups
 * Follows architecture guide principles:
 * - Single responsibility: Checkbox group layout
 * - Under 100 lines
 * - Clean props interface
 * - Consistent styling
 */
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  options,
  layout = 'vertical',
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-text">{title}</h4>
      
      <div className={`space-y-3 ${layout === 'horizontal' ? 'sm:flex sm:flex-wrap sm:gap-6 sm:space-y-0' : ''}`}>
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={(e) => option.onChange(e.target.checked)}
              className="w-4 h-4 text-accent app-border rounded focus:ring-2 focus:ring-accent"
            />
            <div className="flex-1">
              <span className="text-sm text-text">{option.label}</span>
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

export default CheckboxGroup
