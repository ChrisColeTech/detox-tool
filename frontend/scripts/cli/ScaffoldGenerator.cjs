const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

class ScaffoldGenerator {
  constructor() {
    this.supportedFormats = {
      'powershell': { ext: '.ps1', comment: '#', multiComment: ['<#', '#>'] },
      'bash': { ext: '.sh', comment: '#', shebang: '#!/bin/bash' },
      'fish': { ext: '.fish', comment: '#', shebang: '#!/usr/bin/fish' },
      'zsh': { ext: '.zsh', comment: '#', shebang: '#!/bin/zsh' },
      'batch': { ext: '.bat', comment: 'REM', echoOff: '@echo off' },
      'python': { ext: '.py', comment: '#', shebang: '#!/usr/bin/env python3' },
      'nodejs': { ext: '.js', comment: '//', shebang: '#!/usr/bin/env node' },
      'ruby': { ext: '.rb', comment: '#', shebang: '#!/usr/bin/env ruby' },
      'perl': { ext: '.pl', comment: '#', shebang: '#!/usr/bin/env perl' },
    }
  }

  async generateScaffold(directoryPath, settings = {}) {
    const defaultSettings = {
      targetOS: 'cross-platform',
      includeContent: false,
      createDirectoriesOnly: false,
      addComments: true,
      scriptName: 'scaffold',
      outputFormat: 'bash',
      includeReadme: true,
      templateVariables: {},
      supportedFileTypes: ['.sh', '.bash', '.ps1', '.bat', '.cmd', '.py', '.py3', '.js', '.mjs', '.ts', '.rb', '.pl', '.fish', '.zsh'],
    }

    const options = { ...defaultSettings, ...settings }
    const stats = {
      totalScripts: 0,
      completedScripts: 0,
      totalDirectories: 0,
      totalFiles: 0,
    }

    try {
      // Scan directory structure
      const structure = await this.scanDirectoryStructure(directoryPath, options)
      stats.totalDirectories = structure.directories.length
      stats.totalFiles = structure.files.length

      // Generate scaffold script
      const scaffold = await this.createScaffoldScript(structure, options, directoryPath)
      stats.totalScripts = 1
      stats.completedScripts = 1

      const scaffolds = [scaffold]

      // Generate README if requested
      if (options.includeReadme) {
        const readme = await this.generateReadme(structure, options, directoryPath)
        scaffolds.push(readme)
        stats.totalScripts++
        stats.completedScripts++
      }

      return { scaffolds, stats }
    } catch (error) {
      console.error('Error generating scaffold:', error)
      throw error
    }
  }

  async scanDirectoryStructure(directoryPath, options) {
    const structure = {
      root: directoryPath,
      directories: [],
      files: [],
      totalSize: 0,
    }

    async function scanRecursive(dir, relativePath = '') {
      try {
        const entries = await fs.readdir(dir)
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry)
          const relativeItemPath = path.join(relativePath, entry)
          
          try {
            const stat = await fs.stat(fullPath)
            
            if (stat.isDirectory()) {
              if (this.shouldSkipDirectory(entry)) {
                continue
              }
              
              structure.directories.push({
                name: entry,
                path: fullPath,
                relativePath: relativeItemPath,
                parentPath: relativePath,
              })
              
              await scanRecursive(fullPath, relativeItemPath)
            } else if (stat.isFile()) {
              if (this.shouldIncludeFile(entry, options)) {
                const fileInfo = {
                  name: entry,
                  path: fullPath,
                  relativePath: relativeItemPath,
                  parentPath: relativePath,
                  size: stat.size,
                  extension: path.extname(entry).toLowerCase(),
                  lastModified: stat.mtime,
                }
                
                // Include content if requested and file is text
                if (options.includeContent && this.isTextFile(fileInfo.extension)) {
                  try {
                    fileInfo.content = await fs.readFile(fullPath, 'utf8')
                  } catch (error) {
                    fileInfo.content = `# Error reading file: ${error.message}`
                  }
                }
                
                structure.files.push(fileInfo)
                structure.totalSize += stat.size
              }
            }
          } catch (error) {
            console.warn(`Skipping ${fullPath}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dir}: ${error.message}`)
      }
    }

    await scanRecursive.call(this, directoryPath)
    return structure
  }

  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules', '.git', '.svn', '.hg',
      'dist', 'build', 'out', 'target',
      '__pycache__', '.pytest_cache',
      '.vscode', '.idea',
      'coverage', '.nyc_output',
      'vendor', 'bower_components',
      '.DS_Store', 'Thumbs.db',
    ]
    
    return skipDirs.includes(dirName) || (dirName.startsWith('.') && dirName !== '.gitignore')
  }

  shouldIncludeFile(fileName, options) {
    // Skip binary and large files
    if (this.isBinaryFile(fileName)) {
      return false
    }

    // Include if creating directories only
    if (options.createDirectoriesOnly) {
      return true
    }

    // Filter by supported file types if specified
    if (options.supportedFileTypes.length > 0) {
      const ext = path.extname(fileName).toLowerCase()
      return options.supportedFileTypes.includes(ext) || this.isImportantConfigFile(fileName)
    }

    return true
  }

  isBinaryFile(fileName) {
    const binaryExtensions = [
      '.exe', '.dll', '.so', '.dylib',
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico',
      '.mp3', '.mp4', '.avi', '.mov', '.wmv',
      '.zip', '.tar', '.gz', '.rar', '.7z',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx',
      '.class', '.jar', '.war',
    ]
    
    const ext = path.extname(fileName).toLowerCase()
    return binaryExtensions.includes(ext)
  }

  isTextFile(extension) {
    const textExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
      '.py', '.rb', '.php', '.java', '.kt', '.swift',
      '.go', '.rs', '.cpp', '.c', '.h', '.hpp',
      '.cs', '.vb', '.fs', '.clj', '.scala',
      '.html', '.htm', '.css', '.scss', '.sass', '.less',
      '.json', '.xml', '.yaml', '.yml', '.toml',
      '.md', '.txt', '.rst', '.adoc',
      '.sql', '.graphql', '.gql',
      '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
      '.gitignore', '.gitattributes', '.editorconfig',
      '.env', '.env.example',
    ]

    return textExtensions.includes(extension.toLowerCase())
  }

  isImportantConfigFile(fileName) {
    const configFiles = [
      'package.json', 'package-lock.json', 'yarn.lock',
      'tsconfig.json', 'jsconfig.json',
      'webpack.config.js', 'vite.config.js',
      'babel.config.js', '.babelrc',
      'eslint.config.js', '.eslintrc', '.eslintrc.json',
      '.prettierrc', '.prettierrc.json',
      'tailwind.config.js', 'postcss.config.js',
      'Dockerfile', 'docker-compose.yml',
      'Gemfile', 'requirements.txt',
      'Cargo.toml', 'go.mod', 'pom.xml',
      'README.md', 'LICENSE', '.gitignore',
    ]

    return configFiles.includes(fileName)
  }

  async createScaffoldScript(structure, options, projectPath) {
    const format = this.supportedFormats[options.outputFormat]
    const lines = []

    // Add shebang or header
    this.addScriptHeader(lines, options, format)

    // Add comments if requested
    if (options.addComments) {
      this.addScriptComments(lines, structure, options, format)
    }

    // Create directories
    this.addDirectoryCreation(lines, structure, options, format)

    // Create files
    if (!options.createDirectoriesOnly) {
      this.addFileCreation(lines, structure, options, format)
    }

    // Add completion message
    this.addCompletionMessage(lines, options, format)

    const content = lines.join('\n')
    const scriptName = `${options.scriptName}${format.ext}`
    
    return {
      id: uuidv4(),
      name: options.scriptName,
      content,
      os: this.getTargetOS(options),
      fileCount: structure.files.length,
      directoryCount: structure.directories.length,
      size: Buffer.byteLength(content, 'utf8'),
      createdAt: new Date(),
      format: options.outputFormat,
    }
  }

  addScriptHeader(lines, options, format) {
    if (format.shebang && options.targetOS !== 'windows') {
      lines.push(format.shebang)
    }
    
    if (format.echoOff) {
      lines.push(format.echoOff)
    }
    
    lines.push('')
  }

  addScriptComments(lines, structure, options, format) {
    const comment = format.comment
    
    lines.push(`${comment} Scaffold script generated by Task Writer`)
    lines.push(`${comment} Generated on: ${new Date().toISOString()}`)
    lines.push(`${comment} Source directory: ${structure.root}`)
    lines.push(`${comment} Target OS: ${options.targetOS}`)
    lines.push(`${comment} Directories: ${structure.directories.length}`)
    lines.push(`${comment} Files: ${structure.files.length}`)
    lines.push(`${comment}`)
    lines.push(`${comment} This script will recreate the directory structure and files`)
    
    if (options.includeContent) {
      lines.push(`${comment} including the original file contents.`)
    } else {
      lines.push(`${comment} as empty placeholder files.`)
    }
    
    lines.push('')
  }

  addDirectoryCreation(lines, structure, options, format) {
    if (structure.directories.length === 0) return

    const comment = format.comment
    lines.push(`${comment} Create directories`)
    
    // Sort directories by depth to ensure parent directories are created first
    const sortedDirs = structure.directories.sort((a, b) => {
      const aDepth = a.relativePath.split(path.sep).length
      const bDepth = b.relativePath.split(path.sep).length
      return aDepth - bDepth
    })

    for (const dir of sortedDirs) {
      const dirPath = this.formatPath(dir.relativePath, options.outputFormat)
      lines.push(this.getMkdirCommand(dirPath, options.outputFormat))
    }
    
    lines.push('')
  }

  addFileCreation(lines, structure, options, format) {
    if (structure.files.length === 0) return

    const comment = format.comment
    lines.push(`${comment} Create files`)

    for (const file of structure.files) {
      const filePath = this.formatPath(file.relativePath, options.outputFormat)
      
      if (options.includeContent && file.content) {
        // Create file with content
        this.addFileWithContent(lines, filePath, file.content, options.outputFormat, format)
      } else {
        // Create empty file
        lines.push(this.getTouchCommand(filePath, options.outputFormat))
      }
    }
    
    lines.push('')
  }

  addFileWithContent(lines, filePath, content, outputFormat, format) {
    const comment = format.comment
    
    switch (outputFormat) {
      case 'powershell':
        lines.push(`${comment} Create ${filePath}`)
        // Escape content for PowerShell here-string
        const psContent = content.replace(/'/g, "''")
        lines.push(`@'`)
        lines.push(psContent)
        lines.push(`'@ | Out-File -FilePath "${filePath}" -Encoding UTF8`)
        break
        
      case 'batch':
        lines.push(`REM Create ${filePath}`)
        // For batch files, we'll write line by line for complex content
        const batchLines = content.split('\n')
        lines.push(`echo. > "${filePath}"`)
        for (const line of batchLines) {
          const escapedLine = line.replace(/[&<>|]/g, '^$&').replace(/"/g, '""')
          lines.push(`echo ${escapedLine} >> "${filePath}"`)
        }
        break
        
      case 'python':
        lines.push(`${comment} Create ${filePath}`)
        lines.push(`with open('${filePath}', 'w', encoding='utf-8') as f:`)
        const pyContent = content.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        lines.push(`    f.write('''${pyContent}''')`)
        break
        
      case 'nodejs':
        lines.push(`${comment} Create ${filePath}`)
        lines.push(`const fs = require('fs');`)
        const jsContent = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
        lines.push(`fs.writeFileSync('${filePath}', \`${jsContent}\`, 'utf8');`)
        break
        
      case 'ruby':
        lines.push(`${comment} Create ${filePath}`)
        const rubyContent = content.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        lines.push(`File.write('${filePath}', '${rubyContent}')`)
        break
        
      case 'perl':
        lines.push(`${comment} Create ${filePath}`)
        lines.push(`open(my $fh, '>', '${filePath}') or die "Cannot open file: $!";`)
        const perlContent = content.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        lines.push(`print $fh '${perlContent}';`)
        lines.push(`close($fh);`)
        break
        
      default: // bash, fish, zsh
        lines.push(`${comment} Create ${filePath}`)
        lines.push(`cat > "${filePath}" << 'EOF'`)
        lines.push(content)
        lines.push('EOF')
        break
    }
    
    lines.push('')
  }

  addCompletionMessage(lines, options, format) {
    const comment = format.comment
    
    lines.push(`${comment} Scaffold generation completed`)
    
    switch (options.outputFormat) {
      case 'powershell':
        lines.push('Write-Host "Scaffold generation completed successfully!" -ForegroundColor Green')
        break
      case 'batch':
        lines.push('echo Scaffold generation completed successfully!')
        break
      case 'python':
        lines.push('print("Scaffold generation completed successfully!")')
        break
      case 'nodejs':
        lines.push('console.log("Scaffold generation completed successfully!");')
        break
      case 'ruby':
        lines.push('puts "Scaffold generation completed successfully!"')
        break
      case 'perl':
        lines.push('print "Scaffold generation completed successfully!\\n";')
        break
      default: // bash, fish, zsh
        lines.push('echo "Scaffold generation completed successfully!"')
        break
    }
  }

  getMkdirCommand(dirPath, outputFormat) {
    switch (outputFormat) {
      case 'powershell':
        return `New-Item -ItemType Directory -Force -Path "${dirPath}"`
      case 'batch':
        return `if not exist "${dirPath}" mkdir "${dirPath}"`
      case 'python':
        return `os.makedirs('${dirPath}', exist_ok=True)`
      case 'nodejs':
        return `fs.mkdirSync('${dirPath}', { recursive: true });`
      case 'ruby':
        return `FileUtils.mkdir_p('${dirPath}')`
      case 'perl':
        return `make_path('${dirPath}');`
      default: // bash, fish, zsh
        return `mkdir -p "${dirPath}"`
    }
  }

  getTouchCommand(filePath, outputFormat) {
    switch (outputFormat) {
      case 'powershell':
        return `New-Item -ItemType File -Force -Path "${filePath}"`
      case 'batch':
        return `echo. > "${filePath}"`
      case 'python':
        return `open('${filePath}', 'a').close()`
      case 'nodejs':
        return `fs.writeFileSync('${filePath}', '', 'utf8');`
      case 'ruby':
        return `File.write('${filePath}', '')`
      case 'perl':
        return `open(my $fh, '>', '${filePath}'); close($fh);`
      default: // bash, fish, zsh
        return `touch "${filePath}"`
    }
  }

  formatPath(relativePath, outputFormat) {
    if (outputFormat === 'powershell' || outputFormat === 'batch') {
      return relativePath.replace(/\//g, '\\')
    }
    return relativePath
  }

  getTargetOS(options) {
    switch (options.targetOS) {
      case 'windows': return 'Windows'
      case 'macos': return 'macOS'
      case 'linux': return 'Linux'
      case 'cross-platform':
      default: return 'Cross-platform'
    }
  }

  async generateReadme(structure, options, projectPath) {
    const lines = []
    
    lines.push('# Scaffold Script')
    lines.push('')
    lines.push('This directory contains a scaffold script generated by Task Writer.')
    lines.push('')
    
    lines.push('## Project Information')
    lines.push('')
    lines.push(`- **Source Directory:** \`${structure.root}\``)
    lines.push(`- **Target OS:** ${this.getTargetOS(options)}`)
    lines.push(`- **Script Format:** ${options.outputFormat}`)
    lines.push(`- **Generated:** ${new Date().toISOString()}`)
    lines.push('')
    
    lines.push('## Structure Summary')
    lines.push('')
    lines.push(`- **Directories:** ${structure.directories.length}`)
    lines.push(`- **Files:** ${structure.files.length}`)
    lines.push(`- **Total Size:** ${this.formatFileSize(structure.totalSize)}`)
    lines.push(`- **Include Content:** ${options.includeContent ? 'Yes' : 'No'}`)
    lines.push('')
    
    lines.push('## Usage')
    lines.push('')
    lines.push('### Prerequisites')
    lines.push('')
    
    switch (options.outputFormat) {
      case 'powershell':
        lines.push('- Windows PowerShell 5.1 or PowerShell Core 6+')
        lines.push('')
        lines.push('### Execution')
        lines.push('')
        lines.push('```powershell')
        lines.push(`powershell -ExecutionPolicy Bypass -File ${options.scriptName}.ps1`)
        lines.push('```')
        break
        
      case 'batch':
        lines.push('- Windows Command Prompt or PowerShell')
        lines.push('')
        lines.push('### Execution')
        lines.push('')
        lines.push('```cmd')
        lines.push(`${options.scriptName}.bat`)
        lines.push('```')
        break
        
      case 'python':
        lines.push('- Python 3.6 or higher')
        lines.push('')
        lines.push('### Execution')
        lines.push('')
        lines.push('```bash')
        lines.push(`python3 ${options.scriptName}.py`)
        lines.push('```')
        break
        
      case 'nodejs':
        lines.push('- Node.js 12 or higher')
        lines.push('')
        lines.push('### Execution')
        lines.push('')
        lines.push('```bash')
        lines.push(`node ${options.scriptName}.js`)
        lines.push('```')
        break
        
      default: // bash, fish, zsh
        lines.push(`- ${options.outputFormat} shell`)
        lines.push('')
        lines.push('### Execution')
        lines.push('')
        lines.push('```bash')
        lines.push(`chmod +x ${options.scriptName}${this.supportedFormats[options.outputFormat].ext}`)
        lines.push(`./${options.scriptName}${this.supportedFormats[options.outputFormat].ext}`)
        lines.push('```')
        break
    }
    
    lines.push('')
    lines.push('## Directory Structure')
    lines.push('')
    lines.push('```')
    lines.push(this.generateDirectoryTree(structure))
    lines.push('```')
    lines.push('')
    
    lines.push('---')
    lines.push('*Generated by Task Writer*')
    
    const content = lines.join('\n')
    
    return {
      id: uuidv4(),
      name: 'README',
      content,
      os: 'All',
      fileCount: 1,
      directoryCount: 0,
      size: Buffer.byteLength(content, 'utf8'),
      createdAt: new Date(),
      format: 'markdown',
    }
  }

  generateDirectoryTree(structure) {
    const tree = new Map()
    
    // Add directories
    for (const dir of structure.directories) {
      const parts = dir.relativePath.split(path.sep)
      let current = tree
      
      for (const part of parts) {
        if (!current.has(part)) {
          current.set(part, new Map())
        }
        current = current.get(part)
      }
    }
    
    // Add files
    for (const file of structure.files) {
      const parts = file.relativePath.split(path.sep)
      const fileName = parts.pop()
      let current = tree
      
      for (const part of parts) {
        if (!current.has(part)) {
          current.set(part, new Map())
        }
        current = current.get(part)
      }
      
      current.set(fileName, null) // null indicates a file
    }
    
    return this.renderDirectoryTree(tree, '')
  }

  renderDirectoryTree(tree, prefix) {
    const lines = []
    const entries = Array.from(tree.entries())
    
    entries.forEach(([name, children], index) => {
      const isLast = index === entries.length - 1
      const isFile = children === null
      
      const connector = isLast ? '└── ' : '├── '
      const icon = isFile ? '📄' : '📁'
      
      lines.push(`${prefix}${connector}${icon} ${name}${isFile ? '' : '/'}`)
      
      if (!isFile && children.size > 0) {
        const childPrefix = prefix + (isLast ? '    ' : '│   ')
        lines.push(this.renderDirectoryTree(children, childPrefix))
      }
    })
    
    return lines.join('\n')
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  getExtensionForFormat(format) {
    return this.supportedFormats[format]?.ext || '.sh'
  }

  async exportScaffolds(scaffolds, outputDirectory) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDirectory, { recursive: true })
      
      for (const scaffold of scaffolds) {
        const extension = scaffold.format === 'markdown' ? '.md' : this.getExtensionForFormat(scaffold.format)
        const fileName = `${scaffold.name}${extension}`
        const filePath = path.join(outputDirectory, fileName)
        
        await fs.writeFile(filePath, scaffold.content, 'utf8')
        
        // Make script executable on Unix-like systems
        if (scaffold.format !== 'markdown' && process.platform !== 'win32') {
          try {
            await fs.chmod(filePath, '755')
          } catch (error) {
            console.warn(`Could not make ${filePath} executable: ${error.message}`)
          }
        }
      }
      
      return true
    } catch (error) {
      console.error('Error exporting scaffolds:', error)
      throw error
    }
  }
}

module.exports = ScaffoldGenerator