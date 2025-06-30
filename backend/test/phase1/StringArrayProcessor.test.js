/**
 * StringArrayProcessor Test Suite
 * Comprehensive tests for string array detection, extraction, and decoding
 */

const StringArrayProcessor = require('../../app/core/StringArrayProcessor');
const fs = require('fs');
const path = require('path');

describe('StringArrayProcessor', () => {
    let processor;
    
    beforeEach(() => {
        processor = new StringArrayProcessor();
    });

    describe('Constructor and Initialization', () => {
        test('should initialize with empty maps', () => {
            expect(processor.stringArrays.size).toBe(0);
            expect(processor.decoderFunctions.size).toBe(0);
            expect(processor.stringMappings.size).toBe(0);
        });

        test('should have all required methods', () => {
            expect(typeof processor.process).toBe('function');
            expect(typeof processor.detectStringArrays).toBe('function');
            expect(typeof processor.extractDecoders).toBe('function');
            expect(typeof processor.buildMappings).toBe('function');
            expect(typeof processor.replaceReferences).toBe('function');
        });
    });

    describe('String Array Detection', () => {
        test('should detect simple string array', () => {
            const code = `var _0x1234 = ['hello', 'world', 'test'];`;
            const result = processor.detectStringArrays(code);
            
            expect(result.size).toBe(1);
            expect(result.has('_0x1234')).toBe(true);
            expect(result.get('_0x1234')).toEqual(['hello', 'world', 'test']);
        });

        test('should detect multiple string arrays', () => {
            const code = `
                var _0x1234 = ['first', 'array'];
                var _0x5678 = ['second', 'array', 'values'];
            `;
            const result = processor.detectStringArrays(code);
            
            expect(result.size).toBe(2);
            expect(result.get('_0x1234')).toEqual(['first', 'array']);
            expect(result.get('_0x5678')).toEqual(['second', 'array', 'values']);
        });

        test('should ignore non-string arrays', () => {
            const code = `
                var numbers = [1, 2, 3];
                var mixed = ['string', 123, true];
                var _0x1234 = ['valid', 'obfuscated'];
                var singleString = ['only one'];
            `;
            const result = processor.detectStringArrays(code);
            
            // Should only detect the obfuscated array (hex name pattern)
            // and ignore regular arrays, mixed arrays, and single-string arrays with normal names
            expect(result.size).toBe(1);
            expect(result.has('_0x1234')).toBe(true);
        });

        test('should handle empty arrays', () => {
            const code = `var empty = [];`;
            const result = processor.detectStringArrays(code);
            
            expect(result.size).toBe(0);
        });
    });

    describe('Decoder Function Extraction', () => {
        test('should detect simple decoder function', () => {
            const code = `
                var _0x1234 = ['hello', 'world'];
                function _0x5678(_0xabc, _0xdef) {
                    _0xabc = _0xabc - 0x0;
                    var _0x123456 = _0x1234[_0xabc];
                    return _0x123456;
                }
            `;
            const result = processor.extractDecoders(code);
            
            expect(result.size).toBe(1);
            expect(result.has('_0x5678')).toBe(true);
            expect(result.get('_0x5678').arrayName).toBe('_0x1234');
            expect(result.get('_0x5678').isDecoder).toBe(true);
        });

        test('should detect function expression decoders', () => {
            const code = `
                var _0x1234 = ['test', 'values'];
                var _0x5678 = function(_0xa, _0xb) {
                    var _0xc = _0x1234[_0xa];
                    return _0xc;
                };
            `;
            const result = processor.extractDecoders(code);
            
            expect(result.size).toBe(1);
            expect(result.has('_0x5678')).toBe(true);
        });

        test('should detect decoder function assignments', () => {
            const code = `
                function _0x1234(_0xa) {
                    return _0x5678[_0xa];
                }
                var _0x9999 = _0x1234;
            `;
            const result = processor.extractDecoders(code);
            
            expect(result.size).toBe(2);
            expect(result.has('_0x1234')).toBe(true);
            expect(result.has('_0x9999')).toBe(true);
        });
    });

    describe('String Mapping Building', () => {
        test('should build correct mappings for simple case', () => {
            const stringArrays = new Map([
                ['_0x1234', ['hello', 'world', 'test']]
            ]);
            const decoders = new Map([
                ['_0x5678', { arrayName: '_0x1234', offsetAdjustment: 0, isDecoder: true }]
            ]);
            
            const result = processor.buildMappings(stringArrays, decoders);
            
            expect(result.size).toBeGreaterThan(0);
            expect(result.get("_0x5678('0x0')")).toBe("'hello'");
            expect(result.get("_0x5678('0x1')")).toBe("'world'");
            expect(result.get("_0x5678('0x2')")).toBe("'test'");
        });

        test('should handle numeric indices', () => {
            const stringArrays = new Map([
                ['_0x1234', ['first', 'second']]
            ]);
            const decoders = new Map([
                ['_0x5678', { arrayName: '_0x1234', offsetAdjustment: 0, isDecoder: true }]
            ]);
            
            const result = processor.buildMappings(stringArrays, decoders);
            
            expect(result.get('_0x5678(0)')).toBe("'first'");
            expect(result.get('_0x5678(1)')).toBe("'second'");
        });

        test('should handle offset adjustments', () => {
            const stringArrays = new Map([
                ['_0x1234', ['zero', 'one', 'two']]
            ]);
            const decoders = new Map([
                ['_0x5678', { arrayName: '_0x1234', offsetAdjustment: -1, isDecoder: true }]
            ]);
            
            const result = processor.buildMappings(stringArrays, decoders);
            
            // With offset -1, index 0 should map to array[0-1] which is invalid
            // index 1 should map to array[1-1] = array[0] = 'zero'
            expect(result.get("_0x5678('0x1')")).toBe("'zero'");
            expect(result.get("_0x5678('0x2')")).toBe("'one'");
        });
    });

    describe('Reference Replacement', () => {
        test('should replace simple function calls', () => {
            const code = `console.log(_0x5678('0x0'));`;
            const mappings = new Map([
                ["_0x5678('0x0')", "'hello'"]
            ]);
            
            const result = processor.replaceReferences(code, mappings);
            
            expect(result).toBe("console.log('hello');");
        });

        test('should replace multiple references', () => {
            const code = `
                console.log(_0x5678('0x0') + ' ' + _0x5678('0x1'));
                window.title = _0x5678('0x2');
            `;
            const mappings = new Map([
                ["_0x5678('0x0')", "'Hello'"],
                ["_0x5678('0x1')", "'World'"],
                ["_0x5678('0x2')", "'Test Title'"]
            ]);
            
            const result = processor.replaceReferences(code, mappings);
            
            expect(result).toContain("console.log('Hello' + ' ' + 'World');");
            expect(result).toContain("window.title = 'Test Title';");
        });

        test('should handle bracket notation in replacements', () => {
            const code = `obj[_0x5678('0x0')] = _0x5678('0x1');`;
            const mappings = new Map([
                ["_0x5678('0x0')", "'property'"],
                ["_0x5678('0x1')", "'value'"]
            ]);
            
            const result = processor.replaceReferences(code, mappings);
            
            expect(result).toBe("obj['property'] = 'value';");
        });
    });

    describe('Full Processing', () => {
        test('should process simple obfuscated code end-to-end', () => {
            const code = `
                var _0x1234 = ['hello', 'world', 'console', 'log'];
                function _0x5678(_0xabc) {
                    return _0x1234[_0xabc];
                }
                console[_0x5678(2)](_0x5678(0) + ' ' + _0x5678(1));
            `;
            
            const result = processor.process(code);
            
            expect(result.success).toBe(true);
            expect(result.decodedCode).toContain("console['console']");
            expect(result.decodedCode).toContain("'hello' + ' ' + 'world'");
            expect(result.statistics.stringArraysFound).toBe(1);
            expect(result.statistics.decoderFunctionsFound).toBe(1);
        });

        test('should handle complex nested calls', () => {
            const code = `
                var _0x1234 = ['method', 'property', 'value'];
                function _0x5678(_0xa) {
                    return _0x1234[_0xa];
                }
                var _0x9999 = _0x5678;
                obj[_0x9999(0)][_0x9999(1)] = _0x9999(2);
            `;
            
            const result = processor.process(code);
            
            expect(result.success).toBe(true);
            expect(result.decodedCode).toContain("obj['method']['property'] = 'value'");
        });
    });

    describe('Sample File Processing', () => {
        test('should process string-array-sample.js correctly', () => {
            const samplePath = path.join(__dirname, '../samples/string-array-sample.js');
            const code = fs.readFileSync(samplePath, 'utf8');
            
            const result = processor.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.stringArraysFound).toBeGreaterThan(0);
            expect(result.statistics.decoderFunctionsFound).toBeGreaterThan(0);
            
            // Should contain the expected deobfuscated patterns
            expect(result.decodedCode).toContain("'Hello'");
            expect(result.decodedCode).toContain("'World'");
        });

        test('should process complex-string-array-sample.js correctly', () => {
            const samplePath = path.join(__dirname, '../samples/complex-string-array-sample.js');
            const code = fs.readFileSync(samplePath, 'utf8');
            
            const result = processor.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.stringArraysFound).toBeGreaterThanOrEqual(2);
            expect(result.statistics.decoderFunctionsFound).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid JavaScript gracefully', () => {
            const code = `invalid javascript code {{{ `;
            
            const result = processor.process(code);
            
            // Should not crash, might succeed with partial parsing or fail gracefully
            expect(result).toBeDefined();
            expect(result.originalCode).toBe(code);
        });

        test('should handle empty code', () => {
            const result = processor.process('');
            
            expect(result.success).toBe(true);
            expect(result.decodedCode).toBe('');
            expect(result.statistics.stringArraysFound).toBe(0);
        });

        test('should handle code with no string arrays', () => {
            const code = `
                function normalFunction() {
                    console.log('normal code');
                }
                normalFunction();
            `;
            
            const result = processor.process(code);
            
            expect(result.success).toBe(true);
            expect(result.statistics.stringArraysFound).toBe(0);
            expect(result.decodedCode).toContain('normal code');
        });
    });

    describe('Statistics and Utilities', () => {
        test('should provide accurate statistics', () => {
            const code = `
                var _0x1234 = ['a', 'b', 'c'];
                var _0x5678 = ['x', 'y'];
                function _0x999(_0xa) { return _0x1234[_0xa]; }
            `;
            
            const result = processor.process(code);
            
            expect(result.statistics.stringArraysFound).toBe(2);
            expect(result.statistics.decoderFunctionsFound).toBe(1);
            expect(result.statistics).toHaveProperty('codeReduction');
        });

        test('should reset state correctly', () => {
            processor.stringArrays.set('test', ['value']);
            processor.decoderFunctions.set('testFunc', {});
            processor.stringMappings.set('testCall', 'testValue');
            
            processor.reset();
            
            expect(processor.stringArrays.size).toBe(0);
            expect(processor.decoderFunctions.size).toBe(0);
            expect(processor.stringMappings.size).toBe(0);
        });

        test('should provide detailed statistics via getStatistics', () => {
            processor.stringArrays.set('array1', ['a', 'b']);
            processor.stringArrays.set('array2', ['x', 'y', 'z']);
            processor.decoderFunctions.set('decoder1', {});
            processor.stringMappings.set('call1', 'value1');
            
            const stats = processor.getStatistics();
            
            expect(stats.stringArraysDetected).toBe(2);
            expect(stats.decoderFunctionsDetected).toBe(1);
            expect(stats.stringMappingsCreated).toBe(1);
            expect(stats.totalStringsProcessed).toBe(5); // 2 + 3 strings total
        });
    });

    describe('Performance Tests', () => {
        test('should process medium-sized code efficiently', () => {
            // Generate a medium-sized test case
            const stringArrays = Array.from({length: 10}, (_, i) => 
                `var _0x${i.toString(16).padStart(4, '0')} = [${
                    Array.from({length: 50}, (_, j) => `'string${i}_${j}'`).join(', ')
                }];`
            ).join('\n');
            
            const decoders = Array.from({length: 10}, (_, i) =>
                `function _0xdec${i}(_0xa) { return _0x${i.toString(16).padStart(4, '0')}[_0xa]; }`
            ).join('\n');
            
            const calls = Array.from({length: 100}, (_, i) =>
                `console.log(_0xdec${i % 10}(${i % 50}));`
            ).join('\n');
            
            const code = [stringArrays, decoders, calls].join('\n');
            
            const startTime = Date.now();
            const result = processor.process(code);
            const processingTime = Date.now() - startTime;
            
            expect(result.success).toBe(true);
            expect(processingTime).toBeLessThan(5000); // Should complete in under 5 seconds
            expect(result.statistics.stringArraysFound).toBe(10);
        });
    });
});