/**
 * Base Engine
 * Abstract base class for all deobfuscation engines
 */

class BaseEngine {
    constructor() {
        this.codeType = 'unknown';
        this.capabilities = [];
    }

    /**
     * Process code - must be implemented by subclasses
     * @param {string} code - Code to process
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} Processing result
     */
    async process(code, options = {}) {
        throw new Error('process() method must be implemented by subclass');
    }

    /**
     * Get engine capabilities - must be implemented by subclasses
     * @returns {Object} Capabilities description
     */
    getCapabilities() {
        throw new Error('getCapabilities() method must be implemented by subclass');
    }

    /**
     * Validate input code
     * @protected
     */
    _validateInput(code) {
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid input: code must be a non-empty string');
        }

        if (code.length > 50 * 1024 * 1024) { // 50MB limit
            throw new Error('Input too large: maximum file size is 50MB');
        }
    }

    /**
     * Create a processing step record
     * @protected
     */
    _createStep(name, description, count = null, additionalData = {}) {
        return {
            name,
            description,
            ...(count !== null && { count }),
            timestamp: new Date().toISOString(),
            ...additionalData
        };
    }

    /**
     * Safe regex matching with timeout protection
     * @protected
     */
    _safeMatch(code, pattern, maxMatches = 1000) {
        const matches = [];
        let match;
        let count = 0;

        // Clone regex to reset lastIndex
        const regex = new RegExp(pattern.source, pattern.flags);

        while ((match = regex.exec(code)) !== null && count < maxMatches) {
            matches.push(match);
            count++;

            // Prevent infinite loops on zero-width matches
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
        }

        return matches;
    }

    /**
     * Measure processing time for operations
     * @protected
     */
    _measureTime(operation) {
        const start = Date.now();
        const result = operation();
        const duration = Date.now() - start;
        
        return { result, duration };
    }

    /**
     * Common code formatting utilities
     * @protected
     */
    _formatBasic(code) {
        return code
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, ';\n}')
            .replace(/{\s*/g, '{\n  ')
            .replace(/;\s*(?=[a-zA-Z_$])/g, ';\n  ');
    }

    /**
     * Count occurrences of a pattern safely
     * @protected
     */
    _countPattern(code, pattern) {
        try {
            const matches = code.match(pattern);
            return matches ? matches.length : 0;
        } catch (error) {
            console.warn(`Pattern counting failed: ${error.message}`);
            return 0;
        }
    }
}

module.exports = BaseEngine;