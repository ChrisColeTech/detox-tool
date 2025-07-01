import React, { useState } from 'react'
import { FileText, Image, Code, File, Download, Copy, Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from './Button'

export interface PreviewFile {
  name: string
  path: string
  content: string
  language?: string
  size: number
  lastModified: Date
}

interface FilePreviewProps {
  file: PreviewFile
  className?: string
  onDownload?: (file: PreviewFile) => void
  onCopy?: (content: string) => void
  maxHeight?: string
  showActions?: boolean
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
    return Image
  }
  
  if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cs', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(ext || '')) {
    return Code
  }
  
  if (['txt', 'md', 'json', 'yaml', 'yml', 'xml', 'html', 'css', 'scss'].includes(ext || '')) {
    return FileText
  }
  
  return File
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cs: 'csharp',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
  }
  return languageMap[ext || ''] || 'text'
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  className,
  onDownload,
  onCopy,
  maxHeight = '500px',
  showActions = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const FileIcon = getFileIcon(file.name)
  const language = file.language || getLanguageFromExtension(file.name)
  
  const handleCopy = async () => {
    if (onCopy) {
      onCopy(file.content)
    } else {
      await navigator.clipboard.writeText(file.content)
    }
  }

  const isLongContent = file.content.split('\n').length > 20
  const displayContent = isExpanded ? file.content : file.content.split('\n').slice(0, 20).join('\n')

  return (
    <div className={clsx('bg-surface border border-border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-surface-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileIcon className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-medium text-text">{file.name}</h3>
              <p className="text-sm text-text-muted">
                {formatFileSize(file.size)} • {file.lastModified.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2">
              {isLongContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  leftIcon={isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                leftIcon={<Copy className="w-4 h-4" />}
              >
                Copy
              </Button>
              
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(file)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
        
        {file.path && (
          <p className="text-xs text-text-muted mt-2 font-mono bg-surface px-2 py-1 rounded">
            {file.path}
          </p>
        )}
      </div>
      
      {/* Content */}
      <div 
        className="overflow-auto"
        style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
      >
        <pre className={clsx(
          'p-4 text-sm font-mono text-text whitespace-pre-wrap break-words',
          'bg-code-bg border-0 m-0'
        )}>
          <code className={`language-${language}`}>
            {displayContent}
          </code>
        </pre>
        
        {isLongContent && !isExpanded && (
          <div className="px-4 pb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="w-full"
            >
              Show More ({file.content.split('\n').length - 20} more lines)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
