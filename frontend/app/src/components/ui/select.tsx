import React, { useEffect, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
}) => {
  const selectedOption = options.find((option) => option.value === value)
  const [themeClasses, setThemeClasses] = useState('')

  // Theme detection - get all theme-related classes including color scheme
  useEffect(() => {
    const getThemeClasses = () => {
      const appContainer = document.querySelector('.h-screen.flex.flex-col') // Layout root element
      if (appContainer) {
        const classes = Array.from(appContainer.classList)
        const relevantClasses = classes.filter(
          (cls) =>
            cls === 'dark' ||
            cls === 'high-contrast' ||
            cls.startsWith('color-') ||
            cls.startsWith('font-') ||
            cls.startsWith('icon-'),
        )
        setThemeClasses(relevantClasses.join(' '))
      }
    }

    getThemeClasses()
    // Simple interval check instead of MutationObserver to avoid complexity
    const interval = setInterval(getThemeClasses, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <Listbox value={value} onChange={onValueChange} disabled={disabled}>
      <ListboxButton
        className={cn(
          'relative block w-full py-1.5 pr-8 pl-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50 bg-surface text-text app-border rounded-md',
          className,
        )}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown
          className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4"
          style={{ color: 'var(--text-muted)' }}
          aria-hidden="true"
        />
      </ListboxButton>

      <ListboxOptions
        anchor="bottom"
        transition
        className={cn(
          'w-[var(--button-width)] p-1 shadow-lg focus:outline-none bg-surface app-border rounded-md',
          'transition duration-100 ease-in data-closed:opacity-0 data-closed:scale-95',
          themeClasses,
        )}
      >
        {options.map((option) => (
          <ListboxOption key={option.value} value={option.value}>
            {({ selected, focus }) => (
              <div
                className="relative cursor-default select-none py-2 pl-10 pr-4"
                style={{
                  backgroundColor: focus
                    ? 'var(--surface-hover)'
                    : selected
                    ? 'var(--surface-hover)'
                    : 'transparent',
                  color: selected ? 'var(--accent)' : 'var(--text)',
                }}
              >
                <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                  {option.label}
                </span>
                {selected && (
                  <span
                    className="absolute inset-y-0 left-0 flex items-center pl-3"
                    style={{ color: 'var(--accent)' }}
                  >
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

