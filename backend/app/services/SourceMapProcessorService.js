/**
 * Source Map Processor Service  
 * Handles source map processing and reconstruction
 */

const fs = require('fs').promises;
const path = require('path');

class SourceMapProcessorService {
    constructor() {
        this.sourceMaps = new Map();
    }

    /**
     * Process source maps in directory
     * @param {string} directoryPath - Directory to scan for source maps
     * @returns {Object} - Processing result
     */
    async processSourceMaps(directoryPath) {
        try {
            const files = await fs.readdir(directoryPath);
            const mapFiles = files.filter(file => file.endsWith('.map'));
            const processed = [];

            for (const mapFile of mapFiles) {
                const mapPath = path.join(directoryPath, mapFile);
                const mapContent = await fs.readFile(mapPath, 'utf8');
                
                try {
                    const sourceMap = JSON.parse(mapContent);
                    processed.push({
                        file: mapFile,
                        sources: sourceMap.sources || [],
                        sourcesContent: sourceMap.sourcesContent || [],
                        mappings: sourceMap.mappings || '',
                        version: sourceMap.version || 3
                    });
                } catch (parseError) {
                    processed.push({
                        file: mapFile,
                        error: 'Invalid JSON format',
                        details: parseError.message
                    });
                }
            }

            return {
                success: true,
                result: {
                    directoryPath,
                    totalFiles: files.length,
                    mapFiles: mapFiles.length,
                    processed: processed,
                    errors: processed.filter(p => p.error).length
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
     * Reconstruct from source map
     * @param {string} jsFilePath - JavaScript file path
     * @param {string} mapFilePath - Source map file path
     * @returns {Object} - Reconstruction result
     */
    async reconstructFromSourceMap(jsFilePath, mapFilePath) {
        try {
            const [jsContent, mapContent] = await Promise.all([
                fs.readFile(jsFilePath, 'utf8'),
                fs.readFile(mapFilePath, 'utf8')
            ]);

            const sourceMap = JSON.parse(mapContent);
            
            const reconstruction = {
                originalFile: jsFilePath,
                mapFile: mapFilePath,
                sources: sourceMap.sources || [],
                sourcesContent: sourceMap.sourcesContent || [],
                reconstructedFiles: []
            };

            // Basic reconstruction - extract sources content
            if (sourceMap.sourcesContent) {
                sourceMap.sources.forEach((source, index) => {
                    if (sourceMap.sourcesContent[index]) {
                        reconstruction.reconstructedFiles.push({
                            path: source,
                            content: sourceMap.sourcesContent[index],
                            size: sourceMap.sourcesContent[index].length
                        });
                    }
                });
            }

            return {
                success: true,
                result: reconstruction
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
     * Extract source content from source map
     * @param {Object} sourceMap - Parsed source map object
     * @returns {Array} - Extracted sources
     */
    extractSources(sourceMap) {
        const sources = [];
        
        if (sourceMap.sources && sourceMap.sourcesContent) {
            sourceMap.sources.forEach((source, index) => {
                if (sourceMap.sourcesContent[index]) {
                    sources.push({
                        path: source,
                        content: sourceMap.sourcesContent[index],
                        index: index
                    });
                }
            });
        }
        
        return sources;
    }
}

module.exports = SourceMapProcessorService;