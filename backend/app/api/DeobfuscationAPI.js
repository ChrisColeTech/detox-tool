/**
 * Deobfuscation API
 * Main API interface for Electron IPC communication
 */

const DeobfuscationEngine = require('../core/DeobfuscationEngine');
const BundleSplitterService = require('../services/BundleSplitterService');
const FolderReconstructorService = require('../services/FolderReconstructorService');
const SourceMapService = require('../services/SourceMapService');
const FileService = require('../services/FileService');

class DeobfuscationAPI {
    constructor() {
        this.deobfuscationEngine = new DeobfuscationEngine();
        this.bundleSplitter = new BundleSplitterService();
        this.folderReconstructor = new FolderReconstructorService();
        this.sourceMapService = new SourceMapService();
        this.fileService = new FileService();
    }

    /**
     * Deobfuscate code
     * @param {string} code - Code to deobfuscate
     * @param {Object} options - Deobfuscation options
     * @returns {Promise<Object>} Deobfuscation result
     */
    async deobfuscateCode(code, options = {}) {
        try {
            const result = await this.deobfuscationEngine.deobfuscate(code, options);
            return {
                success: true,
                result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Split large bundle into modules and components
     * @param {string} code - Bundle code
     * @param {Object} options - Splitting options
     * @returns {Promise<Object>} Splitting result
     */
    async splitBundle(code, options = {}) {
        try {
            const result = await this.bundleSplitter.split(code, options);
            return {
                success: true,
                result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Reconstruct folder structure from code
     * @param {string} code - Code to analyze
     * @param {string} outputPath - Output directory path
     * @param {Object} options - Reconstruction options
     * @returns {Promise<Object>} Reconstruction result
     */
    async reconstructFolderStructure(code, outputPath, options = {}) {
        try {
            const result = await this.folderReconstructor.reconstruct(code, outputPath, options);
            return {
                success: true,
                result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Process source maps in a directory
     * @param {string} directoryPath - Directory containing source maps
     * @returns {Promise<Object>} Source map processing result
     */
    async processSourceMaps(directoryPath) {
        try {
            const result = await this.sourceMapService.processDirectory(directoryPath);
            return {
                success: true,
                result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Reconstruct from source map
     * @param {string} jsFilePath - JavaScript file path
     * @param {string} mapFilePath - Source map file path
     * @returns {Promise<Object>} Reconstruction result
     */
    async reconstructFromSourceMap(jsFilePath, mapFilePath) {
        try {
            const result = await this.sourceMapService.reconstruct(jsFilePath, mapFilePath);
            return {
                success: true,
                result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Batch process multiple files
     * @param {string} folderPath - Folder containing files to process
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} Batch processing result
     */
    async batchProcessFolder(folderPath, options = {}) {
        try {
            const files = await this.fileService.getJavaScriptFiles(folderPath);
            const results = [];

            for (const file of files) {
                try {
                    const content = await this.fileService.readFile(file.path);
                    const deobfuscationResult = await this.deobfuscationEngine.deobfuscate(content, options);
                    
                    results.push({
                        file: file.name,
                        path: file.path,
                        success: true,
                        result: deobfuscationResult,
                        originalSize: content.length,
                        processedSize: deobfuscationResult.code.length
                    });
                } catch (error) {
                    results.push({
                        file: file.name,
                        path: file.path,
                        success: false,
                        error: error.message
                    });
                }
            }

            return {
                success: true,
                result: {
                    totalFiles: files.length,
                    results,
                    summary: this._generateBatchSummary(results)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Save file
     * @param {string} content - File content
     * @param {string} filename - Suggested filename
     * @returns {Promise<Object>} Save result
     */
    async saveFile(content, filename) {
        try {
            // This will be handled by Electron's main process for file dialogs
            // Return the content for now, actual saving is done in Electron main
            return {
                success: true,
                content,
                filename
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Load file
     * @param {string} filePath - File path to load
     * @returns {Promise<Object>} Load result
     */
    async loadFile(filePath) {
        try {
            const content = await this.fileService.readFile(filePath);
            const stats = await this.fileService.getFileStats(filePath);
            
            return {
                success: true,
                result: {
                    content,
                    filePath,
                    size: stats.size,
                    modified: stats.mtime
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }

    /**
     * Get engine information
     * @returns {Object} Engine information
     */
    getEngineInfo() {
        return {
            engines: this.deobfuscationEngine.getEngines(),
            services: {
                bundleSplitter: this.bundleSplitter.getCapabilities(),
                folderReconstructor: this.folderReconstructor.getCapabilities(),
                sourceMapService: this.sourceMapService.getCapabilities()
            },
            version: require('../../package.json').version
        };
    }

    /**
     * Generate batch processing summary
     * @private
     */
    _generateBatchSummary(results) {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0);
        const totalProcessedSize = successful.reduce((sum, r) => sum + r.processedSize, 0);
        
        const codeTypes = {};
        successful.forEach(r => {
            const type = r.result.codeType;
            codeTypes[type] = (codeTypes[type] || 0) + 1;
        });

        return {
            totalFiles: results.length,
            successful: successful.length,
            failed: failed.length,
            successRate: (successful.length / results.length * 100).toFixed(1) + '%',
            totalOriginalSize,
            totalProcessedSize,
            sizeChange: totalProcessedSize - totalOriginalSize,
            codeTypes,
            errors: failed.map(f => ({ file: f.file, error: f.error }))
        };
    }
}

module.exports = DeobfuscationAPI;