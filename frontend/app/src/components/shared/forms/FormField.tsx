import React from 'react'

interface FormFieldProps {
  label: string
  description?: string
  children: React.ReactNode
  layout?: 'vertical' | 'horizontal'
  required?: boolean
}

/**
 * Shared component for form field layout
 * Follows architecture guide principles:
 * - Single responsibility: Form field layout and labeling
 * - Under 50 lines
 * - Clean props interface
 * - Consistent spacing and typography
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  children,
  layout = 'vertical',
  required = false,
}) => {
  if (layout === 'horizontal') {
    return (
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-medium text-text">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-xs text-text-muted">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-text-muted mb-2">{description}</p>
      )}
      {children}
    </div>
  )
}

export default FormField
