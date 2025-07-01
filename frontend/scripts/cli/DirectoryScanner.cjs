const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

class DirectoryScanner {
  constructor() {
    this.supportedFileTypes = [
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
      '.py', '.rb', '.php', '.java', '.kt', '.swift',
      '.go', '.rs', '.cpp', '.c', '.h', '.hpp',
      '.cs', '.vb', '.fs', '.clj', '.scala',
      '.html', '.htm', '.css', '.scss', '.sass', '.less',
      '.json', '.xml', '.yaml', '.yml', '.toml',
      '.md', '.txt', '.rst', '.adoc',
      '.sql', '.graphql', '.gql',
      '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
      '.dockerfile', '.docker-compose.yml', '.docker-compose.yaml',
      '.gitignore', '.gitattributes', '.editorconfig',
      '.eslintrc', '.prettierrc', '.babelrc', '.webpack.config.js',
      '.package.json', '.package-lock.json', '.yarn.lock',
      '.gemfile', '.requirements.txt', '.pipfile', '.poetry.lock',
      '.cargo.toml', '.go.mod', '.pom.xml', '.build.gradle',
    ]
  }

  async scanDirectory(directoryPath, settings = {}) {
    const defaultSettings = {
      excludeNodeModules: true,
      excludeGitIgnored: true,
      includeDotFiles: false,
      maxDepth: 10,
      maxFileSize: 50, // MB
      includeEmptyDirs: false,
      fileTypeFilter: [],
    }

    const options = { ...defaultSettings, ...settings }
    const stats = {
      totalFiles: 0,
      totalDirectories: 0,
      totalSize: 0,
      fileTypes: {},
      largestFiles: [],
      deepestPath: 0,
      scanTime: 0,
    }

    const startTime = Date.now()
    
    try {
      const tree = await this.scanDirectoryRecursive(directoryPath, options, stats, 0)
      stats.scanTime = Date.now() - startTime
      
      // Sort largest files
      stats.largestFiles = stats.largestFiles
        .sort((a, b) => b.size - a.size)
        .slice(0, 10)

      return { tree: [tree], stats }
    } catch (error) {
      console.error('Error scanning directory:', error)
      throw error
    }
  }

  async scanDirectoryRecursive(dirPath, options, stats, currentDepth) {
    if (currentDepth >= options.maxDepth) {
      return null
    }

    stats.deepestPath = Math.max(stats.deepestPath, currentDepth)

    try {
      const stat = await fs.stat(dirPath)
      if (!stat.isDirectory()) {
        return null
      }

      const dirName = path.basename(dirPath)
      
      // Skip excluded directories
      if (this.shouldExcludeDirectory(dirName, dirPath, options)) {
        return null
      }

      const node = {
        id: uuidv4(),
        name: dirName,
        type: 'directory',
        path: dirPath,
        children: [],
        size: 0,
        lastModified: stat.mtime,
        isExpanded: currentDepth < 2, // Auto-expand first 2 levels
      }

      stats.totalDirectories++

      const entries = await fs.readdir(dirPath)
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry)
        
        try {
          const entryStat = await fs.stat(fullPath)
          
          if (entryStat.isDirectory()) {
            const childNode = await this.scanDirectoryRecursive(fullPath, options, stats, currentDepth + 1)
            if (childNode) {
              node.children.push(childNode)
              node.size += childNode.size
            }
          } else if (entryStat.isFile()) {
            const fileNode = await this.processFile(fullPath, entry, entryStat, options, stats)
            if (fileNode) {
              node.children.push(fileNode)
              node.size += fileNode.size
            }
          }
        } catch (error) {
          // Skip files/directories that can't be accessed
          console.warn(`Skipping ${fullPath}: ${error.message}`)
        }
      }

      // Remove empty directories if not including them
      if (!options.includeEmptyDirs && node.children.length === 0) {
        stats.totalDirectories--
        return null
      }

      // Sort children: directories first, then files
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })

      return node
    } catch (error) {
      console.warn(`Error scanning directory ${dirPath}: ${error.message}`)
      return null
    }
  }

  async processFile(filePath, fileName, stat, options, stats) {
    // Check file size limit
    const fileSizeMB = stat.size / (1024 * 1024)
    if (fileSizeMB > options.maxFileSize) {
      return null
    }

    // Check if file should be included
    if (!this.shouldIncludeFile(fileName, filePath, options)) {
      return null
    }

    const ext = path.extname(fileName).toLowerCase()
    const fileNode = {
      id: uuidv4(),
      name: fileName,
      type: 'file',
      path: filePath,
      size: stat.size,
      lastModified: stat.mtime,
      extension: ext,
      isText: this.isTextFile(ext),
    }

    stats.totalFiles++
    stats.totalSize += stat.size

    // Track file types
    if (!stats.fileTypes[ext]) {
      stats.fileTypes[ext] = { count: 0, size: 0 }
    }
    stats.fileTypes[ext].count++
    stats.fileTypes[ext].size += stat.size

    // Track largest files
    stats.largestFiles.push({
      name: fileName,
      path: filePath,
      size: stat.size,
      extension: ext,
    })

    return fileNode
  }

  shouldExcludeDirectory(dirName, dirPath, options) {
    // Always exclude certain directories
    const alwaysExclude = [
      '.git', '.svn', '.hg', '.bzr',
      '.DS_Store', 'Thumbs.db',
      '__pycache__', '.pytest_cache',
      '.tox', '.coverage',
      'dist', 'build',
    ]

    if (alwaysExclude.includes(dirName)) {
      return true
    }

    // Exclude node_modules if specified
    if (options.excludeNodeModules && dirName === 'node_modules') {
      return true
    }

    // Exclude dot directories unless specified
    if (!options.includeDotFiles && dirName.startsWith('.')) {
      return true
    }

    return false
  }

  shouldIncludeFile(fileName, filePath, options) {
    // Exclude dot files unless specified
    if (!options.includeDotFiles && fileName.startsWith('.') && fileName !== '.gitignore') {
      return true // Actually include gitignore even if excluding dot files
    }

    // Filter by file types if specified
    if (options.fileTypeFilter.length > 0) {
      const ext = path.extname(fileName).toLowerCase()
      return options.fileTypeFilter.includes(ext)
    }

    // Include common development files
    const ext = path.extname(fileName).toLowerCase()
    const isSupported = this.supportedFileTypes.includes(ext)
    const isConfigFile = this.isConfigFile(fileName)
    const isDocFile = this.isDocumentationFile(fileName, ext)

    return isSupported || isConfigFile || isDocFile
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
      '.eslintrc', '.prettierrc', '.babelrc',
    ]

    return textExtensions.includes(extension.toLowerCase())
  }

  isConfigFile(fileName) {
    const configFiles = [
      'package.json', 'package-lock.json', 'yarn.lock',
      'webpack.config.js', 'vite.config.js', 'rollup.config.js',
      'tsconfig.json', 'jsconfig.json',
      'babel.config.js', '.babelrc', '.babelrc.json',
      'eslint.config.js', '.eslintrc', '.eslintrc.json', '.eslintrc.js',
      '.prettierrc', '.prettierrc.json', '.prettierrc.js',
      'tailwind.config.js', 'postcss.config.js',
      'docker-compose.yml', 'docker-compose.yaml', 'Dockerfile',
      'Gemfile', 'Gemfile.lock',
      'requirements.txt', 'Pipfile', 'Pipfile.lock', 'poetry.lock',
      'Cargo.toml', 'Cargo.lock',
      'go.mod', 'go.sum',
      'pom.xml', 'build.gradle', 'build.gradle.kts',
      'CMakeLists.txt', 'Makefile',
      '.gitignore', '.gitattributes',
      '.editorconfig', '.env', '.env.example',
      'README.md', 'README.txt', 'CHANGELOG.md', 'LICENSE',
    ]

    return configFiles.includes(fileName)
  }

  isDocumentationFile(fileName, extension) {
    const docExtensions = ['.md', '.txt', '.rst', '.adoc']
    const docFileNames = [
      'README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING',
      'CODE_OF_CONDUCT', 'SECURITY', 'SUPPORT'
    ]

    if (docExtensions.includes(extension)) {
      return true
    }

    const nameWithoutExt = path.basename(fileName, extension).toLowerCase()
    return docFileNames.some(docName => nameWithoutExt.includes(docName.toLowerCase()))
  }

  async getDirectoryStructure(dirPath, options = {}) {
    try {
      const result = await this.scanDirectory(dirPath, options)
      return this.convertToFlatStructure(result.tree[0])
    } catch (error) {
      console.error('Error getting directory structure:', error)
      throw error
    }
  }

  convertToFlatStructure(node, prefix = '') {
    const lines = []
    
    if (node.type === 'directory') {
      lines.push(`${prefix}📁 ${node.name}/`)
      
      if (node.children) {
        node.children.forEach((child, index) => {
          const isLast = index === node.children.length - 1
          const childPrefix = prefix + (isLast ? '└── ' : '├── ')
          const grandChildPrefix = prefix + (isLast ? '    ' : '│   ')
          
          if (child.type === 'directory') {
            lines.push(`${childPrefix}📁 ${child.name}/`)
            lines.push(...this.convertToFlatStructure(child, grandChildPrefix))
          } else {
            const icon = this.getFileIcon(child.extension)
            lines.push(`${childPrefix}${icon} ${child.name}`)
          }
        })
      }
    }
    
    return lines
  }

  getFileIcon(extension) {
    const iconMap = {
      '.js': '📄', '.jsx': '⚛️', '.ts': '📘', '.tsx': '⚛️',
      '.py': '🐍', '.rb': '💎', '.php': '🐘',
      '.java': '☕', '.kt': '🏗️', '.swift': '🦉',
      '.go': '🐹', '.rs': '🦀', '.cpp': '⚙️', '.c': '⚙️',
      '.html': '🌐', '.css': '🎨', '.scss': '🎨',
      '.json': '📋', '.xml': '📄', '.yaml': '📄', '.yml': '📄',
      '.md': '📝', '.txt': '📄',
      '.sql': '🗃️', '.db': '🗃️',
      '.sh': '🐚', '.bash': '🐚', '.zsh': '🐚',
      '.dockerfile': '🐳', '.gitignore': '🙈',
    }

    return iconMap[extension.toLowerCase()] || '📄'
  }
}

module.exports = DirectoryScanner