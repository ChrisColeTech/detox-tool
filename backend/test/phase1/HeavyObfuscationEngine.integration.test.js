/**
 * Heavy Obfuscation Engine Integration Tests
 * Tests the integration of StringArrayProcessor with HeavyObfuscationEngine
 */

const HeavyObfuscationEngine = require('../../app/core/engines/HeavyObfuscationEngine');
const fs = require('fs');
const path = require('path');

describe('HeavyObfuscationEngine Integration', () => {
    let engine;
    
    beforeEach(() => {
        engine = new HeavyObfuscationEngine();
    });

    describe('String Array Processing Integration', () => {
        test('should process string arrays through the engine', async () => {
            const code = `
                var _0x1234 = ['hello', 'world', 'console', 'log'];
                function _0x5678(_0xabc) {
                    return _0x1234[_0xabc];
                }
                console[_0x5678(2)](_0x5678(0) + ' ' + _0x5678(1));
            `;
            
            const result = await engine.process(code);
            
            expect(result.code).toContain("'hello'");
            expect(result.code).toContain("'world'");
            // Note: console will be processed as a property, so it might not have quotes
            expect(result.steps.length).toBeGreaterThan(0);
            
            // Check for string array processing steps
            const stringArraySteps = result.steps.filter(step => 
                step.name.includes('String Array')
            );
            expect(stringArraySteps.length).toBeGreaterThan(0);
        });

        test('should handle complex string array patterns', async () => {
            const code = `
                var _0xabc123 = ['React', 'createElement', 'div', 'span'];
                var _0xdef456 = ['method', 'property', 'value'];
                function _0x789abc(_0x111) {
                    return _0xabc123[_0x111];
                }
                function _0xfff000(_0x444) {
                    return _0xdef456[_0x444];
                }
                var obj = {};
                obj[_0xfff000(0)] = _0x789abc(0);
                window[_0x789abc(0)][_0x789abc(1)](_0x789abc(2));
            `;
            
            const result = await engine.process(code);
            
            expect(result.success !== false).toBe(true);
            expect(result.stringArrays).toBeDefined();
            expect(result.decodedStrings).toBeDefined();
            
            // Should contain decoded strings
            expect(result.code).toContain("'React'");
            // Note: method becomes property name without quotes after bracket notation processing
        });

        test('should process sample files correctly', async () => {
            const samplePath = path.join(__dirname, '../samples/string-array-sample.js');
            const code = fs.readFileSync(samplePath, 'utf8');
            
            const result = await engine.process(code);
            
            expect(result.code).toContain("'Hello'");
            expect(result.code).toContain("'World'");
            expect(result.steps.length).toBeGreaterThan(0);
            
            // Check for detailed processing steps
            const decodingStep = result.steps.find(step => 
                step.name === 'String Array Decoding'
            );
            expect(decodingStep).toBeDefined();
            expect(decodingStep.count).toBeGreaterThan(0);
        });
    });

    describe('Engine Capabilities', () => {
        test('should report enhanced capabilities', () => {
            const capabilities = engine.getCapabilities();
            
            expect(capabilities.type).toBe('heavy-obfuscated');
            expect(capabilities.patterns).toContain('String array obfuscation with full decoding');
            expect(capabilities.features).toContain('Advanced string array decoding');
            expect(capabilities.features).toContain('Multiple decoder function support');
        });

        test('should include string array decoding in capabilities list', () => {
            expect(engine.capabilities).toContain('string-array-decoding');
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid code gracefully', async () => {
            const code = `invalid javascript {{{ `;
            
            const result = await engine.process(code);
            
            expect(result).toBeDefined();
            expect(result.code).toBeDefined();
            expect(result.steps).toBeDefined();
        });

        test('should handle code with no string arrays', async () => {
            const code = `
                function normalFunction() {
                    console.log('normal code');
                }
                normalFunction();
            `;
            
            const result = await engine.process(code);
            
            expect(result.code).toContain('normal code');
            expect(result.steps).toBeDefined();
        });
    });

    describe('Processing Steps and Statistics', () => {
        test('should provide detailed processing steps', async () => {
            const code = `
                var _0x1234 = ['test', 'string'];
                function _0x5678(_0xa) { return _0x1234[_0xa]; }
                console.log(_0x5678(0));
            `;
            
            const result = await engine.process(code);
            
            expect(result.steps.length).toBeGreaterThan(0);
            
            // Should have string array related steps
            const stringSteps = result.steps.filter(step => 
                step.name.includes('String Array') || step.name.includes('Decoder')
            );
            expect(stringSteps.length).toBeGreaterThan(0);
        });

        test('should provide string array and decoding statistics', async () => {
            const code = `
                var _0x1234 = ['hello', 'world'];
                function _0x5678(_0xa) { return _0x1234[_0xa]; }
                console.log(_0x5678(0) + _0x5678(1));
            `;
            
            const result = await engine.process(code);
            
            expect(result.stringArrays).toBeDefined();
            expect(result.decodedStrings).toBeDefined();
            
            // Check that statistics are included in steps
            const decodingStep = result.steps.find(step => 
                step.name === 'String Array Decoding'
            );
            if (decodingStep) {
                expect(decodingStep.count).toBeGreaterThan(0);
                expect(decodingStep.reduction).toBeDefined();
            }
        });
    });

    describe('Integration with Other Processing Steps', () => {
        test('should process string arrays before other obfuscation techniques', async () => {
            const code = `
                var _0x1234 = ['property', 'value'];
                function _0x5678(_0xa) { return _0x1234[_0xa]; }
                obj[_0x5678('0x0')] = _0x5678('0x1');
            `;
            
            const result = await engine.process(code);
            
            // String arrays should be processed first
            const stepNames = result.steps.map(step => step.name);
            const stringArrayIndex = stepNames.findIndex(name => 
                name.includes('String Array Detection')
            );
            const bracketNotationIndex = stepNames.findIndex(name => 
                name.includes('Bracket Notation')
            );
            
            expect(stringArrayIndex).toBeGreaterThanOrEqual(0);
            if (bracketNotationIndex >= 0) {
                expect(stringArrayIndex).toBeLessThan(bracketNotationIndex);
            }
        });

        test('should handle mixed obfuscation patterns', async () => {
            const code = `
                var _0x1234 = ['console', 'log', 'test'];
                function _0x5678(_0xa) { return _0x1234[_0xa]; }
                var _0x9999 = _0x5678;
                window[_0x9999('0x0')][_0x9999('0x1')](_0x9999('0x2'));
            `;
            
            const result = await engine.process(code);
            
            // Strings should be decoded, but property access may be converted
            expect(result.code).toContain("'test'");
            // Console and log become property names after bracket notation processing
            
            // Should have processed multiple types of obfuscation
            expect(result.steps.length).toBeGreaterThan(3);
        });
    });

    describe('Performance', () => {
        test('should process medium-sized obfuscated code efficiently', async () => {
            // Generate a medium-sized test case with string arrays
            const stringArray = `var _0x1234 = [${
                Array.from({length: 50}, (_, i) => `'string${i}'`).join(', ')
            }];`;
            
            const decoder = `function _0x5678(_0xa) { return _0x1234[_0xa]; }`;
            
            const calls = Array.from({length: 100}, (_, i) => 
                `console.log(_0x5678(${i % 50}));`
            ).join('\n');
            
            const code = [stringArray, decoder, calls].join('\n');
            
            const startTime = Date.now();
            const result = await engine.process(code);
            const processingTime = Date.now() - startTime;
            
            expect(processingTime).toBeLessThan(5000); // Should complete in under 5 seconds
            expect(result.code).toContain("'string0'");
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });
});