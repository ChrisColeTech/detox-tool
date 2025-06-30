/**
 * VariableNameRecovery Test Suite
 * Comprehensive tests for variable name recovery and semantic naming
 */

const VariableNameRecovery = require('../../app/core/VariableNameRecovery');
const fs = require('fs');
const path = require('path');

describe('VariableNameRecovery', () => {
    let recovery;
    
    beforeEach(() => {
        recovery = new VariableNameRecovery();
    });

    describe('Constructor and Initialization', () => {
        test('should initialize with empty maps and proper reserved names', () => {
            expect(recovery.hexVariables.size).toBe(0);
            expect(recovery.variableMappings.size).toBe(0);
            expect(recovery.usageContext.size).toBe(0);
            expect(recovery.reservedNames.has('console')).toBe(true);
            expect(recovery.reservedNames.has('React')).toBe(true);
        });

        test('should have all required methods', () => {
            expect(typeof recovery.process).toBe('function');
            expect(typeof recovery.analyzeVariables).toBe('function');
            expect(typeof recovery.analyzeContext).toBe('function');
            expect(typeof recovery.generateSemanticNames).toBe('function');
            expect(typeof recovery.replaceVariables).toBe('function');
        });
    });

    describe('Hex Variable Detection', () => {
        test('should detect simple hex variables', () => {
            const code = `
                var _0x1a2b = 'hello';
                var _0x3c4d = 42;
                var normalVar = 'normal';
            `;
            
            const ast = recovery._parseCode(code);
            const result = recovery.analyzeVariables(code, ast);
            
            expect(result.size).toBe(2);
            expect(result.has('_0x1a2b')).toBe(true);
            expect(result.has('_0x3c4d')).toBe(true);
            expect(result.has('normalVar')).toBe(false);
        });

        test('should detect hex function names', () => {
            const code = `
                function _0x1234() {
                    return 'test';
                }
                function normalFunction() {
                    return 'normal';
                }
            `;
            
            const ast = recovery._parseCode(code);
            const result = recovery.analyzeVariables(code, ast);
            
            expect(result.has('_0x1234')).toBe(true);
            expect(result.get('_0x1234').type).toBe('function');
            expect(result.has('normalFunction')).toBe(false);
        });

        test('should detect hex parameters', () => {
            const code = `
                function test(_0x1111, _0x2222, normalParam) {
                    return _0x1111 + _0x2222;
                }
            `;
            
            const ast = recovery._parseCode(code);
            const result = recovery.analyzeVariables(code, ast);
            
            expect(result.has('_0x1111')).toBe(true);
            expect(result.has('_0x2222')).toBe(true);
            expect(result.get('_0x1111').type).toBe('parameter');
            expect(result.has('normalParam')).toBe(false);
        });

        test('should track variable usages', () => {
            const code = `
                var _0x1234 = 'test';
                console.log(_0x1234);
                var result = _0x1234.toUpperCase();
            `;
            
            const ast = recovery._parseCode(code);
            const result = recovery.analyzeVariables(code, ast);
            
            expect(result.get('_0x1234').usages.length).toBeGreaterThan(0);
        });
    });

    describe('Context Analysis', () => {
        test('should infer types from initialization', () => {
            const code = `
                var _0x1111 = 'string value';
                var _0x2222 = 42;
                var _0x3333 = true;
                var _0x4444 = [];
                var _0x5555 = {};
                var _0x6666 = function() {};
            `;
            
            const ast = recovery._parseCode(code);
            const variables = recovery.analyzeVariables(code, ast);
            const context = recovery.analyzeContext(ast);
            
            expect(context.get('_0x1111').inferredType).toBe('string');
            expect(context.get('_0x2222').inferredType).toBe('number');
            expect(context.get('_0x3333').inferredType).toBe('boolean');
            expect(context.get('_0x4444').inferredType).toBe('array');
            expect(context.get('_0x5555').inferredType).toBe('object');
            expect(context.get('_0x6666').inferredType).toBe('function');
        });

        test('should analyze usage patterns', () => {
            const code = `
                var _0x1234 = function() {};
                var _0x5678 = {};
                
                _0x1234(); // function call
                _0x5678.property; // object access
                if (_0x1234) {} // condition
            `;
            
            const ast = recovery._parseCode(code);
            const variables = recovery.analyzeVariables(code, ast);
            const context = recovery.analyzeContext(ast);
            
            const func_patterns = context.get('_0x1234').usagePatterns;
            const obj_patterns = context.get('_0x5678').usagePatterns;
            
            expect(func_patterns.asFunctionCall).toBeGreaterThan(0);
            expect(func_patterns.asCondition).toBeGreaterThan(0);
            expect(obj_patterns.asObjectAccess).toBeGreaterThan(0);
        });

        test('should detect React context', () => {
            const code = `
                function _0x1234(_0x5678) {
                    return React.createElement('div', _0x5678);
                }
            `;
            
            const ast = recovery._parseCode(code);
            const variables = recovery.analyzeVariables(code, ast);
            const context = recovery.analyzeContext(ast);
            
            // Should detect React-related context
            expect(context.has('_0x1234')).toBe(true);
            expect(context.has('_0x5678')).toBe(true);
        });
    });

    describe('Semantic Name Generation', () => {
        test('should generate meaningful names for typed variables', () => {
            const code = `
                var _0x1111 = 'hello';
                var _0x2222 = 42;
                var _0x3333 = [];
                var _0x4444 = {};
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.nameMappings.length).toBeGreaterThan(0);
            
            // Check that meaningful names were generated
            const mappings = new Map(result.nameMappings);
            
            // String should get text/message related name
            const stringName = mappings.get('_0x1111');
            expect(stringName).toMatch(/text|str|message|content/);
            
            // Number should get count/num related name
            const numberName = mappings.get('_0x2222');
            expect(numberName).toMatch(/count|index|num|size/);
        });

        test('should avoid reserved names', () => {
            const code = `
                var _0x1111 = 'test';
                var _0x2222 = function() {};
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            
            const mappings = new Map(result.nameMappings);
            const generatedNames = Array.from(mappings.values());
            
            // Should not generate reserved names
            generatedNames.forEach(name => {
                expect(recovery.reservedNames.has(name)).toBe(false);
            });
        });

        test('should ensure name uniqueness', () => {
            const code = `
                var _0x1111 = 'test1';
                var _0x2222 = 'test2';
                var _0x3333 = 'test3';
                var _0x4444 = 'test4';
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            
            const mappings = new Map(result.nameMappings);
            const generatedNames = Array.from(mappings.values());
            const uniqueNames = new Set(generatedNames);
            
            // All names should be unique
            expect(generatedNames.length).toBe(uniqueNames.size);
        });

        test('should prioritize frequently used variables', () => {
            const code = `
                var _0x1111 = 'frequently used';
                var _0x2222 = 'rarely used';
                
                // Use _0x1111 multiple times
                console.log(_0x1111);
                var result1 = _0x1111.toUpperCase();
                var result2 = _0x1111 + ' text';
                
                // Use _0x2222 once
                console.log(_0x2222);
            `;
            
            const ast = recovery._parseCode(code);
            const variables = recovery.analyzeVariables(code, ast);
            
            const var1_usages = variables.get('_0x1111').usages.length;
            const var2_usages = variables.get('_0x2222').usages.length;
            
            expect(var1_usages).toBeGreaterThan(var2_usages);
        });
    });

    describe('Variable Replacement', () => {
        test('should replace variables throughout the code', () => {
            const code = `
                var _0x1234 = 'hello';
                function _0x5678() {
                    return _0x1234 + ' world';
                }
                console.log(_0x5678());
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.renamedCode).not.toContain('_0x1234');
            expect(result.renamedCode).not.toContain('_0x5678');
            
            // Should maintain functionality
            expect(result.renamedCode).toContain('hello');
            expect(result.renamedCode).toContain('world');
        });

        test('should preserve scope boundaries', () => {
            const code = `
                var _0x1111 = 'outer';
                function test() {
                    var _0x1111 = 'inner';
                    return _0x1111;
                }
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            // Both variables should be renamed but to different names
            expect(result.nameMappings.length).toBeGreaterThan(0);
        });

        test('should handle complex expressions', () => {
            const code = `
                var _0x1234 = {
                    prop: function(_0x5678) {
                        return _0x5678 * 2;
                    }
                };
                
                var _0x9999 = _0x1234.prop(5);
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.renamedCode).not.toContain('_0x1234');
            expect(result.renamedCode).not.toContain('_0x5678');
            expect(result.renamedCode).not.toContain('_0x9999');
        });
    });

    describe('Full Processing', () => {
        test('should process simple code end-to-end', () => {
            const code = `
                var _0x1234 = 'message';
                var _0x5678 = function(_0x9999) {
                    return _0x9999.toUpperCase();
                };
                
                console.log(_0x5678(_0x1234));
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.hexVariablesFound).toBe(3);
            expect(result.statistics.variablesRenamed).toBe(3);
            expect(result.renamedCode).toContain('message');
            expect(result.renamedCode).toContain('toUpperCase');
        });

        test('should handle React component patterns', () => {
            const code = `
                function _0x1234(_0x5678) {
                    return React.createElement('div', {
                        className: _0x5678.className
                    }, _0x5678.children);
                }
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.nameMappings.length).toBe(2);
            
            const mappings = new Map(result.nameMappings);
            // Function should get Component-related name
            const funcName = mappings.get('_0x1234');
            expect(funcName).toMatch(/component|Component|create/i);
        });
    });

    describe('Sample File Processing', () => {
        test('should process variable-recovery-sample.js correctly', () => {
            const samplePath = path.join(__dirname, '../samples/variable-recovery-sample.js');
            const code = fs.readFileSync(samplePath, 'utf8');
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.hexVariablesFound).toBeGreaterThan(10);
            expect(result.statistics.variablesRenamed).toBeGreaterThan(10);
            
            // Should not contain any hex variables in actual code (excluding comments)
            const codeWithoutComments = result.renamedCode.replace(/\/\/.*$/gm, '');
            expect(codeWithoutComments).not.toMatch(/_0x[a-fA-F0-9]+/);
            
            // Should contain meaningful names
            expect(result.renamedCode).toMatch(/handler|element|event|component|props|items/i);
        });

        test('should process complex-variable-sample.js correctly', () => {
            const samplePath = path.join(__dirname, '../samples/complex-variable-sample.js');
            const code = fs.readFileSync(samplePath, 'utf8');
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.hexVariablesFound).toBeGreaterThan(20);
            
            // Should handle nested scopes correctly
            expect(result.renamedCode).toContain('React.createElement');
            expect(result.renamedCode).toContain('Promise');
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid JavaScript gracefully', () => {
            const code = `invalid javascript code {{{ `;
            
            const result = recovery.process(code);
            
            // Should not crash, might succeed with partial parsing or fail gracefully
            expect(result).toBeDefined();
            expect(result.originalCode).toBe(code);
        });

        test('should handle empty code', () => {
            const result = recovery.process('');
            
            expect(result.success).toBe(true);
            expect(result.renamedCode).toBe('');
            expect(result.statistics.hexVariablesFound).toBe(0);
        });

        test('should handle code with no hex variables', () => {
            const code = `
                function normalFunction() {
                    var normalVar = 'normal code';
                    return normalVar;
                }
                normalFunction();
            `;
            
            const result = recovery.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.hexVariablesFound).toBe(0);
            expect(result.renamedCode).toContain('normal code');
        });
    });

    describe('Statistics and Utilities', () => {
        test('should provide accurate statistics', () => {
            const code = `
                var _0x1234 = 'test';
                var _0x5678 = function(_0x9999) {
                    return _0x9999;
                };
            `;
            
            const result = recovery.process(code);
            
            expect(result.statistics.hexVariablesFound).toBe(3);
            expect(result.statistics.variablesRenamed).toBe(3);
            expect(result.statistics).toHaveProperty('meaningfulNamesGenerated');
            expect(result.statistics).toHaveProperty('codeReduction');
        });

        test('should reset state correctly', () => {
            recovery.hexVariables.set('test', {});
            recovery.variableMappings.set('test', 'value');
            recovery.usageContext.set('test', {});
            
            recovery.reset();
            
            expect(recovery.hexVariables.size).toBe(0);
            expect(recovery.variableMappings.size).toBe(0);
            expect(recovery.usageContext.size).toBe(0);
        });

        test('should provide detailed statistics via getStatistics', () => {
            recovery.hexVariables.set('var1', {});
            recovery.variableMappings.set('var1', 'newVar1');
            recovery.usageContext.set('var1', {});
            
            const stats = recovery.getStatistics();
            
            expect(stats.hexVariablesDetected).toBe(1);
            expect(stats.variableMappingsCreated).toBe(1);
            expect(stats.contextAnalysisCompleted).toBe(1);
        });
    });

    describe('Performance Tests', () => {
        test('should process medium-sized code efficiently', () => {
            // Generate a medium-sized test case with many hex variables
            const variables = Array.from({length: 50}, (_, i) => 
                `var _0x${i.toString(16).padStart(4, '0')} = 'value${i}';`
            ).join('\n');
            
            const functions = Array.from({length: 20}, (_, i) =>
                `function _0xfn${i.toString(16).padStart(2, '0')}(_0xp${i.toString(16).padStart(2, '0')}) { return _0xp${i.toString(16).padStart(2, '0')}; }`
            ).join('\n');
            
            const usage = Array.from({length: 100}, (_, i) =>
                `console.log(_0x${(i % 50).toString(16).padStart(4, '0')});`
            ).join('\n');
            
            const code = [variables, functions, usage].join('\n');
            
            const startTime = Date.now();
            const result = recovery.process(code);
            const processingTime = Date.now() - startTime;
            
            expect(result.success).toBe(true);
            expect(processingTime).toBeLessThan(5000); // Should complete in under 5 seconds
            expect(result.statistics.hexVariablesFound).toBeGreaterThanOrEqual(50);
        });
    });
});