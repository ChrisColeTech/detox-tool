/**
 * String Array Processor
 * Core functionality for detecting, extracting, and decoding obfuscated string arrays
 * This is the foundation of JavaScript deobfuscation
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

class StringArrayProcessor {
    constructor() {
        this.stringArrays = new Map(); // Variable name -> array contents
        this.decoderFunctions = new Map(); // Function name -> decoder info
        this.stringMappings = new Map(); // Decoder call -> actual string
        this.processedArrays = new Set(); // Track processed arrays to avoid duplicates
    }

    /**
     * Main processing method - detects and decodes all string arrays in code
     * @param {string} code - JavaScript code to process
     * @returns {Object} Processing result with decoded code and metadata
     */
    process(code) {
        try {
            // Step 1: Parse the code into an AST
            const ast = this._parseCode(code);
            
            // Step 2: Detect string arrays in the code
            const stringArrays = this.detectStringArrays(code, ast);
            
            // Step 3: Extract decoder functions
            const decoderFunctions = this.extractDecoders(code, ast);
            
            // Step 4: Build string mappings
            const mappings = this.buildMappings(stringArrays, decoderFunctions);
            
            // Step 5: Replace all string array references with actual strings
            const decodedCode = this.replaceReferences(code, mappings);
            
            return {
                success: true,
                originalCode: code,
                decodedCode: decodedCode,
                stringArrays: Array.from(stringArrays.entries()),
                decoderFunctions: Array.from(decoderFunctions.entries()),
                mappings: Array.from(mappings.entries()),
                statistics: {
                    stringArraysFound: stringArrays.size,
                    decoderFunctionsFound: decoderFunctions.size,
                    stringsDecoded: mappings.size,
                    codeReduction: ((code.length - decodedCode.length) / code.length * 100).toFixed(2) + '%'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalCode: code,
                decodedCode: code // Return original on failure
            };
        }
    }

    /**
     * Detect string array definitions in code
     * @param {string} code - JavaScript code
     * @param {Object} ast - Parsed AST (optional, will parse if not provided)
     * @returns {Map} Map of variable names to array contents
     */
    detectStringArrays(code, ast = null) {
        const stringArrays = new Map();
        
        if (!ast) {
            ast = this._parseCode(code);
        }

        // Traverse AST to find string array patterns
        traverse(ast, {
            VariableDeclarator: (path) => {
                if (this._isStringArray(path.node)) {
                    const arrayName = path.node.id.name;
                    const arrayContents = this._extractArrayContents(path.node.init);
                    
                    if (arrayContents && arrayContents.length > 0) {
                        stringArrays.set(arrayName, arrayContents);
                    }
                }
            }
        });

        // Also check for regex patterns as fallback
        const regexPatterns = this._detectStringArraysWithRegex(code);
        regexPatterns.forEach((contents, name) => {
            if (!stringArrays.has(name)) {
                stringArrays.set(name, contents);
            }
        });

        this.stringArrays = stringArrays;
        return stringArrays;
    }

    /**
     * Extract decoder function definitions
     * @param {string} code - JavaScript code
     * @param {Object} ast - Parsed AST (optional)
     * @returns {Map} Map of function names to decoder information
     */
    extractDecoders(code, ast = null) {
        const decoders = new Map();
        
        if (!ast) {
            ast = this._parseCode(code);
        }

        // Traverse AST to find decoder function patterns
        traverse(ast, {
            FunctionDeclaration: (path) => {
                const decoderInfo = this._analyzeDecoderFunction(path.node);
                if (decoderInfo) {
                    decoders.set(path.node.id.name, decoderInfo);
                }
            },
            VariableDeclarator: (path) => {
                // Check for function expressions assigned to variables
                if (path.node.init && path.node.init.type === 'FunctionExpression') {
                    const decoderInfo = this._analyzeDecoderFunction(path.node.init);
                    if (decoderInfo) {
                        decoders.set(path.node.id.name, decoderInfo);
                    }
                }
                // Check for function assignments (var _0x777 = _0x789abc)
                if (path.node.init && path.node.init.type === 'Identifier') {
                    const referencedName = path.node.init.name;
                    if (decoders.has(referencedName)) {
                        decoders.set(path.node.id.name, decoders.get(referencedName));
                    }
                }
            }
        });

        this.decoderFunctions = decoders;
        return decoders;
    }

    /**
     * Build mappings from decoder function calls to actual strings
     * @param {Map} stringArrays - Map of array names to contents
     * @param {Map} decoderFunctions - Map of decoder function info
     * @returns {Map} Map of function calls to decoded strings
     */
    buildMappings(stringArrays, decoderFunctions) {
        const mappings = new Map();

        // For each decoder function, try to resolve what strings it would return
        decoderFunctions.forEach((decoderInfo, functionName) => {
            const { arrayName, offsetAdjustment } = decoderInfo;
            
            if (stringArrays.has(arrayName)) {
                const stringArray = stringArrays.get(arrayName);
                
                // Build mappings for common index patterns
                for (let i = 0; i < stringArray.length; i++) {
                    const hexIndex = '0x' + i.toString(16);
                    const callPattern = `${functionName}('${hexIndex}')`;
                    const adjustedIndex = i + (offsetAdjustment || 0);
                    
                    if (adjustedIndex >= 0 && adjustedIndex < stringArray.length) {
                        mappings.set(callPattern, `'${stringArray[adjustedIndex]}'`);
                    }
                }
                
                // Also handle numeric indices
                for (let i = 0; i < stringArray.length; i++) {
                    const callPattern = `${functionName}(${i})`;
                    const adjustedIndex = i + (offsetAdjustment || 0);
                    
                    if (adjustedIndex >= 0 && adjustedIndex < stringArray.length) {
                        mappings.set(callPattern, `'${stringArray[adjustedIndex]}'`);
                    }
                }
            }
        });

        this.stringMappings = mappings;
        return mappings;
    }

    /**
     * Replace all string array references with actual strings
     * @param {string} code - Original code
     * @param {Map} mappings - Function call to string mappings
     * @returns {string} Code with references replaced
     */
    replaceReferences(code, mappings) {
        let processedCode = code;

        // Sort mappings by length (longer first) to avoid partial replacements
        const sortedMappings = Array.from(mappings.entries()).sort((a, b) => b[0].length - a[0].length);

        // Replace function calls with actual strings
        sortedMappings.forEach(([functionCall, actualString]) => {
            // Escape special regex characters in the function call
            const escapedCall = functionCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedCall, 'g');
            processedCode = processedCode.replace(regex, actualString);
        });

        // Clean up any remaining decoder function definitions and assignments
        processedCode = this._cleanupDecoderDefinitions(processedCode);

        return processedCode;
    }

    /**
     * Parse JavaScript code with error handling
     * @private
     */
    _parseCode(code) {
        try {
            return parse(code, {
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
            });
        } catch (error) {
            // Try parsing as script if module parsing fails
            return parse(code, {
                sourceType: 'script',
                allowReturnOutsideFunction: true,
                plugins: ['jsx']
            });
        }
    }

    /**
     * Check if a node represents a string array
     * @private
     */
    _isStringArray(node) {
        if (!node.init || node.init.type !== 'ArrayExpression' || !node.init.elements || node.init.elements.length === 0) {
            return false;
        }
        
        // Check if ALL elements are string literals
        const hasOnlyStrings = node.init.elements.every(elem => 
            elem && elem.type === 'StringLiteral'
        );
        
        // Additional heuristics for obfuscated string arrays
        if (hasOnlyStrings) {
            const variableName = node.id.name;
            // Look for hex-style variable names (common in obfuscation)
            const isObfuscatedName = /^_0x[a-fA-F0-9]+$/.test(variableName) || 
                                   /_[a-fA-F0-9]+/.test(variableName);
            
            // If it's an obfuscated name, definitely a string array
            if (isObfuscatedName) {
                return true;
            }
            
            // For non-obfuscated names, be more conservative
            // Only include if it has multiple strings (likely array for lookup)
            return node.init.elements.length >= 2;
        }
        
        return false;
    }

    /**
     * Extract array contents from an ArrayExpression node
     * @private
     */
    _extractArrayContents(arrayNode) {
        if (!arrayNode || arrayNode.type !== 'ArrayExpression') {
            return null;
        }

        return arrayNode.elements.map(elem => {
            if (elem && elem.type === 'StringLiteral') {
                return elem.value;
            }
            return null;
        }).filter(val => val !== null);
    }

    /**
     * Analyze a function to determine if it's a string array decoder
     * @private
     */
    _analyzeDecoderFunction(functionNode) {
        if (!functionNode.body || !functionNode.body.body) {
            return null;
        }

        const statements = functionNode.body.body;
        let arrayReference = null;
        let offsetAdjustment = 0;

        // Look for patterns indicating this is a decoder function
        for (const stmt of statements) {
            // Check for variable declarations that might reference arrays
            if (stmt.type === 'VariableDeclaration') {
                for (const declarator of stmt.declarations) {
                    if (declarator.init && declarator.init.type === 'MemberExpression') {
                        const memberExpr = declarator.init;
                        if (memberExpr.object && memberExpr.object.type === 'Identifier') {
                            arrayReference = memberExpr.object.name;
                        }
                    }
                }
            }
            
            // Check for array access patterns in return statements
            if (stmt.type === 'ReturnStatement' && stmt.argument) {
                const returnExpr = stmt.argument;
                
                if (returnExpr.type === 'MemberExpression' && 
                    returnExpr.object && returnExpr.object.type === 'Identifier') {
                    arrayReference = returnExpr.object.name;
                }
                
                // Also check for variable references in return
                if (returnExpr.type === 'Identifier') {
                    // Look back through statements to find what this variable references
                    for (const prevStmt of statements) {
                        if (prevStmt.type === 'VariableDeclaration') {
                            for (const declarator of prevStmt.declarations) {
                                if (declarator.id.name === returnExpr.name &&
                                    declarator.init && declarator.init.type === 'MemberExpression') {
                                    arrayReference = declarator.init.object.name;
                                }
                            }
                        }
                    }
                }
            }
            
            // Check for index adjustment patterns (_0xabc = _0xabc - 0x0)
            if (stmt.type === 'ExpressionStatement' && 
                stmt.expression && stmt.expression.type === 'AssignmentExpression') {
                const assignment = stmt.expression;
                
                if (assignment.right && assignment.right.type === 'BinaryExpression' &&
                    assignment.right.operator === '-') {
                    // Extract offset adjustment if any
                    if (assignment.right.right && assignment.right.right.type === 'NumericLiteral') {
                        offsetAdjustment = -assignment.right.right.value;
                    }
                }
            }
        }

        if (arrayReference) {
            return {
                arrayName: arrayReference,
                offsetAdjustment: offsetAdjustment,
                isDecoder: true
            };
        }

        return null;
    }

    /**
     * Detect string arrays using regex patterns as fallback
     * @private
     */
    _detectStringArraysWithRegex(code) {
        const stringArrays = new Map();
        
        // Pattern: var _0x1234 = ['string1', 'string2', ...];
        // Only look for obfuscated variable names
        const arrayPattern = /var\s+(_0x[a-fA-F0-9]+|_[a-fA-F0-9]+)\s*=\s*\[([^\]]+)\]/g;
        let match;
        
        while ((match = arrayPattern.exec(code)) !== null) {
            const arrayName = match[1];
            const arrayContent = match[2];
            
            // Extract individual strings
            const strings = this._parseStringArray(arrayContent);
            // Only include if we have multiple strings (likely lookup arrays)
            if (strings.length >= 2) {
                stringArrays.set(arrayName, strings);
            }
        }
        
        return stringArrays;
    }

    /**
     * Parse string array content from regex match
     * @private
     */
    _parseStringArray(content) {
        const strings = [];
        const stringPattern = /'([^'\\]*(\\.[^'\\]*)*)'/g;
        let match;
        
        while ((match = stringPattern.exec(content)) !== null) {
            strings.push(match[1]);
        }
        
        return strings;
    }

    /**
     * Clean up decoder function definitions after processing
     * @private
     */
    _cleanupDecoderDefinitions(code) {
        let cleanedCode = code;

        // Remove decoder function definitions
        this.decoderFunctions.forEach((decoderInfo, functionName) => {
            // Remove function declarations
            const funcPattern = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{[^}]*\\}`, 'g');
            cleanedCode = cleanedCode.replace(funcPattern, '');
            
            // Remove variable assignments to decoders
            const varPattern = new RegExp(`var\\s+${functionName}\\s*=\\s*[^;]+;`, 'g');
            cleanedCode = cleanedCode.replace(varPattern, '');
        });

        // Remove string array definitions that have been fully processed
        this.stringArrays.forEach((arrayContents, arrayName) => {
            const arrayPattern = new RegExp(`var\\s+${arrayName}\\s*=\\s*\\[[^\\]]+\\];`, 'g');
            cleanedCode = cleanedCode.replace(arrayPattern, '');
        });

        // Clean up empty lines and excessive whitespace
        cleanedCode = cleanedCode
            .replace(/\n\s*\n/g, '\n')
            .replace(/^\s*\n/gm, '')
            .trim();

        return cleanedCode;
    }

    /**
     * Get processing statistics
     * @returns {Object} Statistics about the processing
     */
    getStatistics() {
        return {
            stringArraysDetected: this.stringArrays.size,
            decoderFunctionsDetected: this.decoderFunctions.size,
            stringMappingsCreated: this.stringMappings.size,
            totalStringsProcessed: Array.from(this.stringArrays.values()).reduce((sum, arr) => sum + arr.length, 0)
        };
    }

    /**
     * Reset internal state for new processing
     */
    reset() {
        this.stringArrays.clear();
        this.decoderFunctions.clear();
        this.stringMappings.clear();
        this.processedArrays.clear();
    }
}

module.exports = StringArrayProcessor;