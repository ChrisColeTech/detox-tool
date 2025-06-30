/**
 * Core Deobfuscation Engine
 * Coordinates different deobfuscation strategies based on code patterns
 */

const HeavyObfuscationEngine = require('./engines/HeavyObfuscationEngine');
const WebpackMinificationEngine = require('./engines/WebpackMinificationEngine');
const GenericFormattingEngine = require('./engines/GenericFormattingEngine');
const PatternDetector = require('./PatternDetector');

class DeobfuscationEngine {
    constructor() {
        this.patternDetector = new PatternDetector();
        this.engines = {
            heavy: new HeavyObfuscationEngine(),
            webpack: new WebpackMinificationEngine(),
            generic: new GenericFormattingEngine()
        };
    }

    /**
     * Main deobfuscation method
     * @param {string} code - The obfuscated code to process
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} Deobfuscation result
     */
    async deobfuscate(code, options = {}) {
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid input: code must be a non-empty string');
        }

        const analysis = this.patternDetector.analyzeCode(code);
        const selectedEngine = this._selectEngine(analysis);
        
        const startTime = Date.now();
        const result = await selectedEngine.process(code, options);
        const processingTime = Date.now() - startTime;

        return {
            success: true,
            code: result.code,
            codeType: result.codeType,
            steps: result.steps,
            originalLength: code.length,
            processedLength: result.code.length,
            processingTime,
            patternsDetected: analysis.patterns,
            confidence: analysis.confidence
        };
    }

    /**
     * Select the most appropriate engine based on code analysis
     * @private
     */
    _selectEngine(analysis) {
        const { patterns, confidence } = analysis;

        if (patterns.heavyObfuscation && confidence.heavyObfuscation > 0.7) {
            return this.engines.heavy;
        }
        
        if (patterns.webpackMinification && confidence.webpackMinification > 0.5) {
            return this.engines.webpack;
        }

        return this.engines.generic;
    }

    /**
     * Get available engines and their capabilities
     */
    getEngines() {
        return Object.keys(this.engines).map(key => ({
            name: key,
            capabilities: this.engines[key].getCapabilities()
        }));
    }
}

module.exports = DeobfuscationEngine;