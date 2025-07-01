import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import TextInput from './TextInput'

interface TagListProps {
  title: string
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  placeholder?: string
  emptyMessage?: string
}

/**
 * Shared component for managing lists of tags/strings
 * Follows architecture guide principles:
 * - Single responsibility: Tag list management
 * - Under 100 lines
 * - Clean props interface
 * - Add/remove functionality
 */
const TagList: React.FC<TagListProps> = ({
  title,
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = "Add item",
  emptyMessage = "No items added yet",
}) => {
  const [newTag, setNewTag] = useState('')

  const handleAdd = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim())
      setNewTag('')
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
      
      {/* Add new tag */}
      <div className="flex gap-2">
        <TextInput
          value={newTag}
          onChange={setNewTag}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleAdd}
          variant="secondary"
          size="sm"
          disabled={!newTag.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Tag list */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-surface app-border rounded text-sm"
            >
              <span className="font-mono text-accent">{tag}</span>
              <button
                onClick={() => onRemoveTag(tag)}
                className="text-text-muted hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted italic">{emptyMessage}</p>
      )}
    </div>
  )
}

export default TagList
