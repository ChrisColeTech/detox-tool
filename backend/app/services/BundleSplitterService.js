/**
 * Bundle Splitter Service
 * Handles splitting large webpack bundles into manageable components
 */

class BundleSplitterService {
    constructor() {
        this.chunkSize = 50000; // Default chunk size in characters
    }

    /**
     * Split a large bundle into smaller chunks
     * @param {string} code - The bundle code to split
     * @param {Object} options - Splitting options
     * @returns {Object} - Split result with chunks
     */
    async splitBundle(code, options = {}) {
        try {
            const {
                chunkSize = this.chunkSize,
                preserveModules = true,
                extractComments = true
            } = options;

            const chunks = [];
            let currentChunk = '';
            let chunkIndex = 0;

            // Simple splitting by lines for now
            const lines = code.split('\n');
            
            for (const line of lines) {
                if (currentChunk.length + line.length > chunkSize) {
                    if (currentChunk.trim()) {
                        chunks.push({
                            index: chunkIndex++,
                            content: currentChunk,
                            size: currentChunk.length,
                            lines: currentChunk.split('\n').length
                        });
                    }
                    currentChunk = line + '\n';
                } else {
                    currentChunk += line + '\n';
                }
            }

            // Add the last chunk
            if (currentChunk.trim()) {
                chunks.push({
                    index: chunkIndex,
                    content: currentChunk,
                    size: currentChunk.length,
                    lines: currentChunk.split('\n').length
                });
            }

            return {
                success: true,
                result: {
                    originalSize: code.length,
                    totalChunks: chunks.length,
                    chunks: chunks,
                    metadata: {
                        averageChunkSize: chunks.reduce((sum, chunk) => sum + chunk.size, 0) / chunks.length,
                        splitMethod: 'line-based',
                        preservedModules: preserveModules,
                        extractedComments: extractComments
                    }
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
     * Reconstruct bundle from chunks
     * @param {Array} chunks - Array of chunk objects
     * @returns {Object} - Reconstructed bundle
     */
    async reconstructBundle(chunks) {
        try {
            const reconstructed = chunks
                .sort((a, b) => a.index - b.index)
                .map(chunk => chunk.content)
                .join('');

            return {
                success: true,
                result: {
                    content: reconstructed,
                    size: reconstructed.length,
                    chunksProcessed: chunks.length
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
     * Analyze bundle structure
     * @param {string} code - Bundle code to analyze
     * @returns {Object} - Analysis result
     */
    async analyzeBundle(code) {
        try {
            const analysis = {
                size: code.length,
                lines: code.split('\n').length,
                modules: this.detectModules(code),
                webpackChunks: this.detectWebpackChunks(code),
                reactComponents: this.detectReactComponents(code)
            };

            return {
                success: true,
                result: analysis
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
     * Detect modules in bundle
     * @param {string} code - Code to analyze
     * @returns {Array} - Detected modules
     */
    detectModules(code) {
        const modulePattern = /\/\*\*\*\/ \(function\(module, exports?, __webpack_require__\)/g;
        const matches = [];
        let match;
        
        while ((match = modulePattern.exec(code)) !== null) {
            matches.push({
                index: matches.length,
                position: match.index,
                type: 'webpack_module'
            });
        }
        
        return matches;
    }

    /**
     * Detect webpack chunks
     * @param {string} code - Code to analyze  
     * @returns {Array} - Detected chunks
     */
    detectWebpackChunks(code) {
        const chunkPattern = /webpackJsonp\s*\(\s*\[([^\]]*)\]/g;
        const matches = [];
        let match;
        
        while ((match = chunkPattern.exec(code)) !== null) {
            matches.push({
                chunkIds: match[1].split(',').map(id => id.trim()),
                position: match.index
            });
        }
        
        return matches;
    }

    /**
     * Detect React components
     * @param {string} code - Code to analyze
     * @returns {Array} - Detected components
     */
    detectReactComponents(code) {
        const componentPatterns = [
            /React\.createElement\s*\(/g,
            /function\s+([A-Z][a-zA-Z]*)\s*\([^)]*\)\s*{[^}]*return\s+React/g,
            /const\s+([A-Z][a-zA-Z]*)\s*=\s*\([^)]*\)\s*=>/g
        ];
        
        const components = [];
        
        componentPatterns.forEach((pattern, patternIndex) => {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                components.push({
                    name: match[1] || `Component_${components.length}`,
                    position: match.index,
                    pattern: patternIndex,
                    type: patternIndex === 0 ? 'createElement' : 'function'
                });
            }
        });
        
        return components;
    }
}

module.exports = BundleSplitterService;