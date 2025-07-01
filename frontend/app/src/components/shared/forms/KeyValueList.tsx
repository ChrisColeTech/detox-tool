import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import TextInput from './TextInput'

interface KeyValueListProps {
  title: string
  items: Record<string, string>
  onAddItem: (key: string, value: string) => void
  onRemoveItem: (key: string) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
  emptyMessage?: string
}

/**
 * Shared component for managing key-value pairs
 * Follows architecture guide principles:
 * - Single responsibility: Key-value pair management
 * - Under 150 lines
 * - Clean props interface
 * - Add/remove functionality
 */
const KeyValueList: React.FC<KeyValueListProps> = ({
  title,
  items,
  onAddItem,
  onRemoveItem,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  emptyMessage = "No items added yet",
}) => {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAdd = () => {
    if (newKey.trim() && newValue.trim()) {
      onAddItem(newKey.trim(), newValue.trim())
      setNewKey('')
      setNewValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-text">{title}</h4>
      
      {/* Add new key-value pair */}
      <div className="flex gap-2">
        <TextInput
          value={newKey}
          onChange={setNewKey}
          placeholder={keyPlaceholder}
          onKeyPress={handleKeyPress}
        />
        <TextInput
          value={newValue}
          onChange={setNewValue}
          placeholder={valuePlaceholder}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleAdd}
          variant="secondary"
          size="sm"
          disabled={!newKey.trim() || !newValue.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Key-value list */}
      {Object.keys(items).length > 0 ? (
        <div className="space-y-2">
          {Object.entries(items).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 p-2 bg-surface app-border rounded">
              <span className="text-sm font-mono text-accent">{key}</span>
              <span className="text-sm text-text-muted">=</span>
              <span className="text-sm text-text flex-1">{value}</span>
              <button
                onClick={() => onRemoveItem(key)}
                className="text-text-muted hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted italic">{emptyMessage}</p>
      )}
    </div>
  )
}

export default KeyValueList
