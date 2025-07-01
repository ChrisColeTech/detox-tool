import React from 'react'
import { Monitor } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Select, type SelectOption } from '@/components/ui/select'
import { SettingsSection, FormField } from '@/components/shared/forms'
import type { AppSettings, ColorScheme } from '@/hooks/useSettings'

interface AppearanceSettingsProps {
  settings: AppSettings
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
}

/**
 * Component for appearance and visual settings
 * Uses shared form components for consistent UI
 * Follows architecture guide principles:
 * - Single responsibility: Appearance configuration UI
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared form components
 */
const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const themeOptions: SelectOption[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ]

  const colorSchemeOptions: SelectOption[] = [
    { value: 'onyx', label: 'Onyx' },
    { value: 'ocean-blue', label: 'Ocean Blue' },
    { value: 'forest-green', label: 'Forest Green' },
    { value: 'royal-purple', label: 'Royal Purple' },
    { value: 'sunset-orange', label: 'Sunset Orange' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'office', label: 'Office' },
    { value: 'terminal', label: 'Terminal' },
    { value: 'midnight-blue', label: 'Midnight Blue' },
    { value: 'crimson-red', label: 'Crimson Red' },
    { value: 'warm-sepia', label: 'Warm Sepia' },
    { value: 'rose-gold', label: 'Rose Gold' },
  ]

  const fontSizeOptions: SelectOption[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]

  const iconSizeOptions: SelectOption[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]

  const borderThicknessOptions: SelectOption[] = [
    { value: 'none', label: 'None' },
    { value: 'thin', label: 'Thin' },
    { value: 'medium', label: 'Medium' },
    { value: 'thick', label: 'Thick' },
  ]

  const sidebarPositionOptions: SelectOption[] = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ]

  return (
    <SettingsSection
      icon={Monitor}
      title="Appearance"
    >
      {/* Theme Selection */}
      <FormField label="Theme">
        <Select
          value={settings.theme}
          onValueChange={(value) => onSettingChange('theme', value as AppSettings['theme'])}
          options={themeOptions}
          placeholder="Select theme"
        />
      </FormField>

      {/* Color Scheme Selection */}
      <FormField label="Color Scheme">
        <Select
          value={settings.colorScheme}
          onValueChange={(value) => onSettingChange('colorScheme', value as ColorScheme)}
          options={colorSchemeOptions}
          placeholder="Select color scheme"
        />
      </FormField>

      {/* High Contrast */}
      <FormField
        label="High Contrast"
        description="Increase contrast for better accessibility"
        layout="horizontal"
      >
        <Switch
          checked={settings.highContrast}
          onCheckedChange={(checked) => onSettingChange('highContrast', checked)}
        />
      </FormField>

      {/* Font Size */}
      <FormField label="Font Size">
        <Select
          value={settings.fontSize}
          onValueChange={(value) => onSettingChange('fontSize', value as AppSettings['fontSize'])}
          options={fontSizeOptions}
          placeholder="Select font size"
        />
      </FormField>

      {/* Icon Size */}
      <FormField label="Icon Size">
        <Select
          value={settings.iconSize}
          onValueChange={(value) => onSettingChange('iconSize', value as AppSettings['iconSize'])}
          options={iconSizeOptions}
          placeholder="Select icon size"
        />
      </FormField>

      {/* Border Thickness */}
      <FormField label="Border Thickness">
        <Select
          value={settings.borderThickness}
          onValueChange={(value) => onSettingChange('borderThickness', value as AppSettings['borderThickness'])}
          options={borderThicknessOptions}
          placeholder="Select border thickness"
        />
      </FormField>

      {/* Sidebar Position */}
      <FormField label="Sidebar Position">
        <Select
          value={settings.sidebarPosition}
          onValueChange={(value) => onSettingChange('sidebarPosition', value as AppSettings['sidebarPosition'])}
          options={sidebarPositionOptions}
          placeholder="Select sidebar position"
        />
      </FormField>

      {/* Status Bar */}
      <FormField
        label="Show Status Bar"
        description="Display status information at the bottom"
        layout="horizontal"
      >
        <Switch
          checked={settings.showStatusBar}
          onCheckedChange={(checked) => onSettingChange('showStatusBar', checked)}
        />
      </FormField>
    </SettingsSection>
  )
}

export default AppearanceSettings
