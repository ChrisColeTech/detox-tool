/**
 * Pattern Detector
 * Analyzes code to identify obfuscation patterns and determine processing strategy
 */

class PatternDetector {
    constructor() {
        this.patterns = {
            heavyObfuscation: [
                /_0x[a-f0-9]+/g,
                /parseInt\([^)]+\)\s*\/\s*0x[a-f0-9]+/g,
                /while\s*\(\s*!!\[\]\s*\)\s*\{[^}]*try/g,
                /function\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(\s*\)\s*\{[^}]*return\s*\[/g
            ],
            webpackMinification: [
                /webpack_require/g,
                /webpackChunkName/g,
                /__webpack_exports__/g,
                /\{(\d+):\s*function/g,
                /webpackChunk[^=]*=/g
            ],
            reactComponents: [
                /React\.createElement/g,
                /jsx\s*\(/g,
                /useState|useEffect|useCallback/g,
                /Component\.prototype\./g,
                /extends\s+React\.Component/g
            ]
        };
    }

    /**
     * Analyze code to detect patterns and determine confidence levels
     * @param {string} code - Code to analyze
     * @returns {Object} Analysis result with patterns and confidence scores
     */
    analyzeCode(code) {
        const analysis = {
            patterns: {},
            confidence: {},
            details: {}
        };

        // Analyze each pattern category
        for (const [category, patterns] of Object.entries(this.patterns)) {
            const result = this._analyzePatternCategory(code, patterns);
            analysis.patterns[category] = result.detected;
            analysis.confidence[category] = result.confidence;
            analysis.details[category] = result.details;
        }

        // Calculate overall analysis metrics
        analysis.codeSize = code.length;
        analysis.complexity = this._calculateComplexity(code);
        analysis.primaryPattern = this._determinePrimaryPattern(analysis.confidence);

        return analysis;
    }

    /**
     * Analyze a specific pattern category
     * @private
     */
    _analyzePatternCategory(code, patterns) {
        const matches = [];
        let totalMatches = 0;

        for (const pattern of patterns) {
            const patternMatches = [...code.matchAll(pattern)];
            matches.push({
                pattern: pattern.source,
                count: patternMatches.length,
                matches: patternMatches.slice(0, 5) // Keep first 5 for analysis
            });
            totalMatches += patternMatches.length;
        }

        const detected = totalMatches > 0;
        const confidence = Math.min(totalMatches / 10, 1.0); // Normalize to 0-1

        return {
            detected,
            confidence,
            details: {
                totalMatches,
                patternBreakdown: matches,
                density: totalMatches / (code.length / 1000) // matches per 1000 chars
            }
        };
    }

    /**
     * Calculate code complexity metrics
     * @private
     */
    _calculateComplexity(code) {
        const metrics = {
            linesOfCode: code.split('\n').length,
            cyclomaticComplexity: this._countCyclomaticComplexity(code),
            nestingDepth: this._calculateNestingDepth(code),
            functionCount: (code.match(/function\s+/g) || []).length
        };

        // Overall complexity score (0-1)
        metrics.score = Math.min(
            (metrics.cyclomaticComplexity / 50 + 
             metrics.nestingDepth / 10 + 
             metrics.functionCount / 100) / 3,
            1.0
        );

        return metrics;
    }

    /**
     * Count cyclomatic complexity (simplified)
     * @private
     */
    _countCyclomaticComplexity(code) {
        const controlStructures = [
            /\bif\s*\(/g,
            /\belse\b/g,
            /\bwhile\s*\(/g,
            /\bfor\s*\(/g,
            /\bswitch\s*\(/g,
            /\bcase\s+/g,
            /\bcatch\s*\(/g,
            /\btry\s*\{/g
        ];

        let complexity = 1; // Base complexity
        
        for (const pattern of controlStructures) {
            const matches = code.match(pattern);
            if (matches) {
                complexity += matches.length;
            }
        }

        return complexity;
    }

    /**
     * Calculate maximum nesting depth
     * @private
     */
    _calculateNestingDepth(code) {
        let maxDepth = 0;
        let currentDepth = 0;

        for (const char of code) {
            if (char === '{') {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else if (char === '}') {
                currentDepth--;
            }
        }

        return maxDepth;
    }

    /**
     * Determine the primary obfuscation pattern
     * @private
     */
    _determinePrimaryPattern(confidence) {
        let maxConfidence = 0;
        let primaryPattern = 'generic';

        for (const [pattern, conf] of Object.entries(confidence)) {
            if (conf > maxConfidence) {
                maxConfidence = conf;
                primaryPattern = pattern;
            }
        }

        return primaryPattern;
    }

    /**
     * Get detailed pattern statistics
     */
    getPatternStatistics(code) {
        const analysis = this.analyzeCode(code);
        
        return {
            summary: {
                codeSize: analysis.codeSize,
                complexity: analysis.complexity.score,
                primaryPattern: analysis.primaryPattern
            },
            patterns: Object.entries(analysis.details).map(([name, details]) => ({
                name,
                detected: analysis.patterns[name],
                confidence: analysis.confidence[name],
                matches: details.totalMatches,
                density: details.density
            })),
            recommendations: this._generateRecommendations(analysis)
        };
    }

    /**
     * Generate processing recommendations based on analysis
     * @private
     */
    _generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.confidence.heavyObfuscation > 0.7) {
            recommendations.push({
                type: 'processing',
                message: 'Heavy obfuscation detected - use comprehensive deobfuscation',
                priority: 'high'
            });
        }

        if (analysis.confidence.webpackMinification > 0.5) {
            recommendations.push({
                type: 'processing',
                message: 'Webpack bundle detected - consider module extraction',
                priority: 'medium'
            });
        }

        if (analysis.complexity.score > 0.7) {
            recommendations.push({
                type: 'performance',
                message: 'High complexity code - processing may take longer',
                priority: 'low'
            });
        }

        if (analysis.codeSize > 1000000) { // 1MB
            recommendations.push({
                type: 'performance',
                message: 'Large file detected - consider splitting before processing',
                priority: 'medium'
            });
        }

        return recommendations;
    }
}

module.exports = PatternDetector;