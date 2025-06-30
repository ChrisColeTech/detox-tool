/**
 * Generic Formatting Engine
 * Handles general code formatting and basic deobfuscation for unrecognized patterns
 */

const BaseEngine = require('./BaseEngine');
const BeautificationUtils = require('../../utils/BeautificationUtils');

class GenericFormattingEngine extends BaseEngine {
    constructor() {
        super();
        this.codeType = 'generic';
        this.beautifier = new BeautificationUtils();
        this.capabilities = [
            'syntax-validation',
            'basic-beautification',
            'fallback-formatting',
            'code-structure-analysis'
        ];
    }

    /**
     * Process generic code with basic formatting and validation
     * @param {string} code - Code to process
     * @param {Object} options - Processing options
     * @returns {Object} Processing result
     */
    async process(code, options = {}) {
        this._validateInput(code);
        
        const steps = [];
        let processedCode = code;

        // Step 1: Validate syntax
        const syntaxValidation = this._validateSyntax(code, steps);

        // Step 2: Apply basic cleanup
        processedCode = this._basicCleanup(processedCode, steps);

        // Step 3: Attempt beautification with fallbacks
        processedCode = await this._attemptBeautification(processedCode, steps, syntaxValidation);

        // Step 4: Final formatting
        processedCode = this._finalFormatting(processedCode, steps);

        return {
            code: processedCode,
            codeType: this.codeType,
            steps
        };
    }

    /**
     * Validate code syntax using multiple parsers
     * @private
     */
    _validateSyntax(code, steps) {
        const validation = this.beautifier.validateSyntax(code);
        
        steps.push(this._createStep(
            "Syntax Validation",
            validation.isValid ? "Code syntax is valid" : "Code has syntax errors",
            1,
            { 
                isValid: validation.isValid,
                parser: validation.parser,
                error: validation.error
            }
        ));

        return validation;
    }

    /**
     * Apply basic cleanup operations
     * @private
     */
    _basicCleanup(code, steps) {
        let processedCode = code;
        const operations = [];

        // Remove excessive whitespace
        const beforeWhitespace = processedCode.length;
        processedCode = processedCode.replace(/\s+/g, ' ').trim();
        const afterWhitespace = processedCode.length;
        
        if (beforeWhitespace !== afterWhitespace) {
            operations.push('whitespace normalization');
        }

        // Fix common formatting issues
        const beforeFormatting = processedCode.length;
        processedCode = processedCode
            .replace(/;\s*}/g, ';\n}')
            .replace(/{\s*/g, '{\n  ')
            .replace(/;\s*(?=[a-zA-Z_$])/g, ';\n  ')
            .replace(/,\s*(?=[a-zA-Z_$])/g, ',\n  ');
        const afterFormatting = processedCode.length;

        if (beforeFormatting !== afterFormatting) {
            operations.push('basic structure formatting');
        }

        if (operations.length > 0) {
            steps.push(this._createStep(
                "Basic Cleanup",
                "Applied basic code cleanup",
                operations.length,
                { operations }
            ));
        }

        return processedCode;
    }

    /**
     * Attempt beautification with multiple fallback strategies
     * @private
     */
    async _attemptBeautification(code, steps, syntaxValidation) {
        // Only attempt advanced beautification if syntax is valid
        if (!syntaxValidation.isValid) {
            steps.push(this._createStep(
                "Beautification Skipped",
                "Advanced beautification skipped due to syntax errors",
                0,
                { reason: 'syntax_errors' }
            ));
            return code;
        }

        const { result: beautificationResult, duration } = await this._measureTime(async () => {
            return await this.beautifier.beautify(code, 'auto');
        });

        if (beautificationResult.success) {
            steps.push(this._createStep(
                "Code Beautification",
                `Successfully beautified using ${beautificationResult.method}`,
                1,
                { 
                    method: beautificationResult.method,
                    processingTime: duration,
                    originalLength: code.length,
                    beautifiedLength: beautificationResult.code.length
                }
            ));
            
            return beautificationResult.code;
        } else {
            steps.push(this._createStep(
                "Beautification Failed",
                "All beautification methods failed, using basic formatting",
                0,
                { 
                    error: beautificationResult.error,
                    processingTime: duration
                }
            ));
            
            return code;
        }
    }

    /**
     * Apply final formatting touches
     * @private
     */
    _finalFormatting(code, steps) {
        // Ensure consistent line endings
        let processedCode = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove trailing whitespace
        processedCode = processedCode
            .split('\n')
            .map(line => line.trimEnd())
            .join('\n');

        // Ensure file ends with newline
        if (processedCode && !processedCode.endsWith('\n')) {
            processedCode += '\n';
        }

        steps.push(this._createStep(
            "Final Formatting",
            "Applied final formatting touches",
            1,
            { 
                operations: [
                    'normalized line endings',
                    'removed trailing whitespace',
                    'ensured final newline'
                ]
            }
        ));

        return processedCode;
    }

    /**
     * Analyze code structure for insights
     * @private
     */
    _analyzeCodeStructure(code) {
        const analysis = {
            lines: code.split('\n').length,
            characters: code.length,
            functions: (code.match(/function\s+\w+/g) || []).length,
            arrowFunctions: (code.match(/=>\s*[{(]/g) || []).length,
            objects: (code.match(/\{[^}]*\}/g) || []).length,
            arrays: (code.match(/\[[^\]]*\]/g) || []).length
        };

        analysis.complexity = this._estimateComplexity(analysis);
        return analysis;
    }

    /**
     * Estimate code complexity
     * @private
     */
    _estimateComplexity(analysis) {
        const { lines, functions, arrowFunctions } = analysis;
        
        if (lines < 10) return 'very-low';
        if (lines < 50) return 'low';
        if (lines < 200) return 'medium';
        if (lines < 1000) return 'high';
        return 'very-high';
    }

    /**
     * Get generic engine capabilities
     */
    getCapabilities() {
        return {
            type: this.codeType,
            features: [
                'Syntax validation with multiple parsers',
                'Basic code cleanup and formatting',
                'Beautification with fallback strategies',
                'Structure analysis and metrics'
            ],
            parsers: [
                'Babel (modern JavaScript)',
                'Esprima (ES5 compatible)',
                'Acorn (lightweight parser)'
            ],
            beautifiers: [
                'Prettier (opinionated formatting)',
                'js-beautify (configurable formatting)',
                'Basic fallback formatting'
            ],
            limitations: [
                'Cannot handle heavily obfuscated code',
                'Limited deobfuscation capabilities',
                'Focuses on formatting over transformation'
            ]
        };
    }
}

module.exports = GenericFormattingEngine;