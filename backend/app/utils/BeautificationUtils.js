/**
 * Beautification Utilities
 * Common utilities for code beautification using popular libraries
 */

const jsBeautify = require('js-beautify');
const prettier = require('prettier');
const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const escodegen = require('escodegen');
const esprima = require('esprima');

class BeautificationUtils {
    constructor() {
        this.defaultOptions = {
            jsBeautify: {
                indent_size: 2,
                indent_char: ' ',
                max_preserve_newlines: 2,
                preserve_newlines: true,
                keep_array_indentation: false,
                break_chained_methods: false,
                indent_scripts: 'normal',
                brace_style: 'collapse',
                space_before_conditional: true,
                unescape_strings: false,
                jslint_happy: false,
                end_with_newline: false,
                wrap_line_length: 120
            },
            prettier: {
                parser: 'babel',
                printWidth: 120,
                tabWidth: 2,
                useTabs: false,
                semi: true,
                singleQuote: true,
                quoteProps: 'as-needed',
                trailingComma: 'es5',
                bracketSpacing: true,
                arrowParens: 'avoid'
            },
            babel: {
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true,
                plugins: [
                    'jsx',
                    'typescript',
                    'decorators-legacy',
                    'functionBind',
                    'exportDefaultFrom',
                    'throwExpressions',
                    'dynamicImport',
                    'objectRestSpread',
                    'asyncGenerators'
                ]
            }
        };
    }

    /**
     * Beautify code using multiple fallback strategies
     * @param {string} code - Code to beautify
     * @param {string} strategy - Primary strategy ('auto', 'prettier', 'js-beautify', 'babel')
     * @returns {Object} Beautification result
     */
    async beautify(code, strategy = 'auto') {
        const results = [];
        
        try {
            switch (strategy) {
                case 'prettier':
                    return await this._beautifyWithPrettier(code);
                case 'js-beautify':
                    return this._beautifyWithJsBeautify(code);
                case 'babel':
                    return await this._beautifyWithBabel(code);
                case 'auto':
                default:
                    return await this._beautifyWithFallbacks(code);
            }
        } catch (error) {
            return {
                success: false,
                code: code,
                method: 'none',
                error: error.message
            };
        }
    }

    /**
     * Try multiple beautification methods with fallbacks
     * @private
     */
    async _beautifyWithFallbacks(code) {
        const methods = [
            { name: 'prettier', fn: () => this._beautifyWithPrettier(code) },
            { name: 'babel', fn: () => this._beautifyWithBabel(code) },
            { name: 'js-beautify', fn: () => this._beautifyWithJsBeautify(code) },
            { name: 'basic', fn: () => this._basicBeautify(code) }
        ];

        for (const method of methods) {
            try {
                const result = await method.fn();
                if (result.success) {
                    return { ...result, method: method.name };
                }
            } catch (error) {
                console.warn(`${method.name} beautification failed: ${error.message}`);
                continue;
            }
        }

        // If all methods fail, return original code
        return {
            success: false,
            code: code,
            method: 'none',
            error: 'All beautification methods failed'
        };
    }

    /**
     * Beautify with Prettier
     * @private
     */
    async _beautifyWithPrettier(code) {
        try {
            const formatted = await prettier.format(code, this.defaultOptions.prettier);
            return {
                success: true,
                code: formatted,
                method: 'prettier'
            };
        } catch (error) {
            throw new Error(`Prettier formatting failed: ${error.message}`);
        }
    }

    /**
     * Beautify with js-beautify
     * @private
     */
    _beautifyWithJsBeautify(code) {
        try {
            const formatted = jsBeautify.js(code, this.defaultOptions.jsBeautify);
            return {
                success: true,
                code: formatted,
                method: 'js-beautify'
            };
        } catch (error) {
            throw new Error(`js-beautify formatting failed: ${error.message}`);
        }
    }

    /**
     * Beautify with Babel (parse + generate)
     * @private
     */
    async _beautifyWithBabel(code) {
        try {
            const ast = parse(code, this.defaultOptions.babel);
            const output = generate(ast, {
                retainLines: false,
                compact: false,
                minified: false,
                comments: true
            });
            
            return {
                success: true,
                code: output.code,
                method: 'babel'
            };
        } catch (error) {
            throw new Error(`Babel formatting failed: ${error.message}`);
        }
    }

    /**
     * Basic beautification fallback
     * @private
     */
    _basicBeautify(code) {
        try {
            const formatted = code
                .replace(/\s+/g, ' ')
                .replace(/;\s*}/g, ';\n}')
                .replace(/{\s*/g, '{\n  ')
                .replace(/;\s*(?=[a-zA-Z_$])/g, ';\n  ')
                .replace(/,\s*(?=[a-zA-Z_$])/g, ',\n  ');

            return {
                success: true,
                code: formatted,
                method: 'basic'
            };
        } catch (error) {
            throw new Error(`Basic formatting failed: ${error.message}`);
        }
    }

    /**
     * Parse code with multiple parser fallbacks
     * @param {string} code - Code to parse
     * @returns {Object} Parse result with AST
     */
    parseWithFallbacks(code) {
        const parsers = [
            { name: 'babel', fn: () => parse(code, this.defaultOptions.babel) },
            { name: 'esprima', fn: () => esprima.parseScript(code, { tolerant: true }) },
            { name: 'acorn', fn: () => require('acorn').parse(code, { ecmaVersion: 'latest' }) }
        ];

        for (const parser of parsers) {
            try {
                const ast = parser.fn();
                return {
                    success: true,
                    ast,
                    parser: parser.name
                };
            } catch (error) {
                console.warn(`${parser.name} parsing failed: ${error.message}`);
                continue;
            }
        }

        return {
            success: false,
            ast: null,
            parser: 'none',
            error: 'All parsers failed'
        };
    }

    /**
     * Generate code from AST with fallbacks
     * @param {Object} ast - Abstract syntax tree
     * @param {string} preferredGenerator - Preferred code generator
     * @returns {Object} Generation result
     */
    generateFromAST(ast, preferredGenerator = 'babel') {
        const generators = [
            { 
                name: 'babel', 
                fn: () => generate(ast, { compact: false, minified: false }).code 
            },
            { 
                name: 'escodegen', 
                fn: () => escodegen.generate(ast, { format: { indent: { style: '  ' } } }) 
            }
        ];

        // Try preferred generator first
        const preferred = generators.find(g => g.name === preferredGenerator);
        if (preferred) {
            generators.unshift(preferred);
        }

        for (const generator of generators) {
            try {
                const code = generator.fn();
                return {
                    success: true,
                    code,
                    generator: generator.name
                };
            } catch (error) {
                console.warn(`${generator.name} generation failed: ${error.message}`);
                continue;
            }
        }

        return {
            success: false,
            code: null,
            generator: 'none',
            error: 'All generators failed'
        };
    }

    /**
     * Validate if code is syntactically correct
     * @param {string} code - Code to validate
     * @returns {Object} Validation result
     */
    validateSyntax(code) {
        const parseResult = this.parseWithFallbacks(code);
        
        return {
            isValid: parseResult.success,
            parser: parseResult.parser,
            error: parseResult.error || null
        };
    }

    /**
     * Get recommended beautification strategy based on code analysis
     * @param {string} code - Code to analyze
     * @returns {string} Recommended strategy
     */
    getRecommendedStrategy(code) {
        // Check for React/JSX patterns
        if (/React\.|jsx|tsx/.test(code)) {
            return 'prettier';
        }

        // Check for modern ES6+ features
        if (/import\s+|export\s+|=>\s*|const\s+|let\s+/.test(code)) {
            return 'babel';
        }

        // Check for minified/obfuscated code
        if (code.length > 10000 && code.split('\n').length < 50) {
            return 'js-beautify';
        }

        return 'auto';
    }
}

module.exports = BeautificationUtils;