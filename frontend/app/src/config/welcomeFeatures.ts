import { FileText, Wrench, Play, Zap } from 'lucide-react'

/**
 * Welcome page features configuration
 * Follows architecture guide principles:
 * - Single responsibility: Feature definitions
 * - Separation of data from UI logic
 * - Centralized configuration
 */

export interface WelcomeFeature {
  id: string
  icon: typeof FileText
  title: string
  description: string
  longDescription: string
  action: (handleOpenTab: (tabId: string, tabName: string) => void) => void
  stepIcon: typeof Play
  ariaLabel: string
  steps: string[]
}

export const getWelcomeFeatures = (handleOpenTab: (tabId: string, tabName: string) => void): WelcomeFeature[] => [
  {
    id: 'task-generator',
    icon: FileText,
    title: 'Task Generator',
    description: 'Generate detailed task files with source code for project documentation and workflows',
    longDescription: 'Analyze project directories and automatically create comprehensive task documentation files. Perfect for code reviews, project handoffs, and technical documentation.',
    action: () => handleOpenTab('tasks', 'Task Generator'),
    stepIcon: Play,
    ariaLabel: 'Task Generator - Create comprehensive documentation from your project files',
    steps: [
      'Select your project directory',
      'Configure generation settings', 
      'Generate comprehensive task files',
      'Export documentation'
    ]
  },
  {
    id: 'scaffold-generator',
    icon: Wrench,
    title: 'Scaffold Generator',
    description: 'Generate cross-platform scripts to recreate directory structures and project templates',
    longDescription: 'Convert existing project structures into executable scaffold scripts. Create reproducible project templates for any platform.',
    action: () => handleOpenTab('scaffold', 'Scaffold Generator'),
    stepIcon: Zap,
    ariaLabel: 'Scaffold Generator - Create project template scripts from existing structures',
    steps: [
      'Select source directory structure',
      'Configure script format & options',
      'Generate scaffold scripts',
      'Export executable templates'
    ]
  },
]
