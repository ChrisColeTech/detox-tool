/**
 * Webpack Minification Engine
 * Handles webpack-minified code with module extraction and React component detection
 */

const BaseEngine = require('./BaseEngine');
const BeautificationUtils = require('../../utils/BeautificationUtils');

class WebpackMinificationEngine extends BaseEngine {
    constructor() {
        super();
        this.codeType = 'webpack-minified';
        this.beautifier = new BeautificationUtils();
        this.capabilities = [
            'webpack-module-extraction',
            'react-component-detection',
            'variable-renaming',
            'code-beautification',
            'chunk-analysis'
        ];
    }

    /**
     * Process webpack minified code
     * @param {string} code - Minified webpack code
     * @param {Object} options - Processing options
     * @returns {Object} Processing result
     */
    async process(code, options = {}) {
        this._validateInput(code);
        
        const steps = [];
        let processedCode = code;

        // Step 1: Detect webpack chunks and modules
        processedCode = this._processWebpackChunks(processedCode, steps);

        // Step 2: Identify React components
        processedCode = this._processReactComponents(processedCode, steps);

        // Step 3: Extract module definitions
        processedCode = this._processModules(processedCode, steps);

        // Step 4: Rename minified variables
        processedCode = await this._processVariableRenaming(processedCode, steps);

        // Step 5: Beautify with fallback libraries
        processedCode = await this._beautifyCode(processedCode, steps);

        return {
            code: processedCode,
            codeType: this.codeType,
            steps
        };
    }

    /**
     * Process webpack chunk patterns
     * @private
     */
    _processWebpackChunks(code, steps) {
        const patterns = [
            /webpackChunk[^=]*=\s*\(([^)]*)\)\s*=>/g,
            /webpackChunk[^=]*=\s*webpackChunk[^=]*\|\|/g,
            /__webpack_require__/g
        ];

        let totalMatches = 0;
        patterns.forEach(pattern => {
            const matches = this._safeMatch(code, pattern);
            totalMatches += matches.length;
        });

        if (totalMatches > 0) {
            steps.push(this._createStep(
                "Webpack Chunk Detection",
                "Found webpack chunk definitions",
                totalMatches,
                { pattern: "webpackChunk patterns" }
            ));
        }

        return code;
    }

    /**
     * Process React component patterns
     * @private
     */
    _processReactComponents(code, steps) {
        const reactPatterns = [
            /React\.createElement/g,
            /jsx\s*\(/g,
            /useState|useEffect|useCallback|useMemo|useContext/g,
            /Component\.prototype\./g,
            /extends\s+React\.Component/g
        ];

        let totalMatches = 0;
        const patternBreakdown = [];

        reactPatterns.forEach(pattern => {
            const matches = this._safeMatch(code, pattern);
            if (matches.length > 0) {
                totalMatches += matches.length;
                patternBreakdown.push({
                    pattern: pattern.source,
                    count: matches.length
                });
            }
        });

        if (totalMatches > 0) {
            steps.push(this._createStep(
                "React Component Detection",
                "Found React components and hooks",
                totalMatches,
                { 
                    pattern: "React patterns",
                    breakdown: patternBreakdown
                }
            ));
        }

        return code;
    }

    /**
     * Process webpack module definitions
     * @private
     */
    _processModules(code, steps) {
        const modulePatterns = [
            /\{(\d+):\s*function\s*\([^)]*\)\s*\{/g,
            /\{(\d+):\s*\([^)]*\)\s*=>/g,
            /__webpack_exports__\[/g
        ];

        let totalMatches = 0;
        const moduleIds = new Set();

        modulePatterns.forEach(pattern => {
            const matches = this._safeMatch(code, pattern);
            matches.forEach(match => {
                if (match[1]) { // Module ID captured
                    moduleIds.add(match[1]);
                }
            });
            totalMatches += matches.length;
        });

        if (totalMatches > 0) {
            steps.push(this._createStep(
                "Module Extraction",
                "Found webpack module definitions",
                totalMatches,
                { 
                    pattern: "module definitions",
                    uniqueModules: moduleIds.size
                }
            ));
        }

        return code;
    }

    /**
     * Process variable renaming with context awareness
     * @private
     */
    async _processVariableRenaming(code, steps) {
        const { result: renamedCode, duration } = this._measureTime(() => {
            return this._renameMinifiedVariables(code);
        });

        steps.push(this._createStep(
            "Variable Renaming",
            "Renamed minified variables to readable names",
            this._getVariableRenameCount(code, renamedCode),
            { 
                pattern: "single letter variables",
                processingTime: duration
            }
        ));

        return renamedCode;
    }

    /**
     * Rename minified variables with context
     * @private
     */
    _renameMinifiedVariables(code) {
        // Common minified variable mappings based on context
        const contextMappings = {
            // Function parameters in common patterns
            't': 'target',
            'e': 'event', 
            'a': 'args',
            'r': 'result',
            'n': 'node',
            'o': 'options',
            'i': 'index',
            'l': 'length',
            's': 'source',
            'c': 'callback',
            'u': 'utils',
            'd': 'data',
            'f': 'func',
            'v': 'value',
            'p': 'props',
            'm': 'module'
        };

        let processedCode = code;

        // Replace function parameters first
        processedCode = processedCode.replace(
            /function\s+([a-z])\s*\(([a-z](?:,\s*[a-z])*)\)/g,
            (match, funcName, params) => {
                const paramList = params.split(',').map(p => p.trim());
                const newParams = paramList.map((param, index) => {
                    return contextMappings[param] || `param${index + 1}`;
                });
                return `function ${funcName}(${newParams.join(', ')})`;
            }
        );

        // Replace standalone variables (carefully to avoid false positives)
        Object.entries(contextMappings).forEach(([minified, readable]) => {
            const pattern = new RegExp(`\\b${minified}\\b(?!['"]\s*:)(?![a-zA-Z0-9_$])`, 'g');
            processedCode = processedCode.replace(pattern, readable);
        });

        return processedCode;
    }

    /**
     * Beautify code using external libraries with fallbacks
     * @private
     */
    async _beautifyCode(code, steps) {
        const strategy = this.beautifier.getRecommendedStrategy(code);
        
        const { result: beautificationResult, duration } = await this._measureTime(async () => {
            return await this.beautifier.beautify(code, strategy);
        });

        if (beautificationResult.success) {
            steps.push(this._createStep(
                "Code Beautification",
                `Applied ${beautificationResult.method} beautification`,
                1,
                { 
                    method: beautificationResult.method,
                    strategy: strategy,
                    processingTime: duration
                }
            ));
            
            return beautificationResult.code;
        } else {
            // Fallback to basic formatting
            const basicFormatted = this._formatBasic(code);
            
            steps.push(this._createStep(
                "Basic Code Formatting",
                "Applied basic formatting (beautification libraries failed)",
                1,
                { 
                    method: 'basic',
                    error: beautificationResult.error,
                    processingTime: duration
                }
            ));
            
            return basicFormatted;
        }
    }

    /**
     * Count variable renames between original and processed code
     * @private
     */
    _getVariableRenameCount(original, processed) {
        const singleLetterVars = (original.match(/\b[a-z]\b/g) || []).length;
        const remainingSingleLetterVars = (processed.match(/\b[a-z]\b/g) || []).length;
        return Math.max(0, singleLetterVars - remainingSingleLetterVars);
    }

    /**
     * Get webpack-specific capabilities
     */
    getCapabilities() {
        return {
            type: this.codeType,
            patterns: [
                'Webpack chunk loading (webpackChunk)',
                'Module definitions ({123: function...})',
                'React component patterns',
                'Minified variable names (t,e,a,r,n)',
                'Export/import patterns (__webpack_exports__)'
            ],
            beautification: [
                'Prettier (for React/modern JS)',
                'Babel (for ES6+ features)',
                'js-beautify (for general formatting)',
                'Basic fallback formatting'
            ],
            limitations: [
                'Cannot recover original variable names without source maps',
                'Dynamic imports may not be fully resolved',
                'Some webpack runtime code may remain minified'
            ]
        };
    }
}

module.exports = WebpackMinificationEngine;