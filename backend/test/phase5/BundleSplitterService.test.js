/**
 * BundleSplitterService Test Suite
 * Comprehensive tests for BundleSplitterService
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 5 - Webpack Bundle Splitting
 * @version 1.0.0
 */

const BundleSplitterService = require('../../app/services/processing/BundleSplitterService');

describe('BundleSplitterService', () => {
    let service;
    
    beforeEach(() => {
        service = new BundleSplitterService();
    });

    describe('Constructor', () => {
        test('should initialize with default options', () => {
            const instance = new BundleSplitterService();
            expect(instance.options.detectWebpackPattern).toBe(true);
            expect(instance.options.extractModules).toBe(true);
            expect(instance.options.analyzeEntryPoints).toBe(true);
            expect(instance.options.mapDependencies).toBe(true);
            expect(instance.options.maxModules).toBe(10000);
        });

        test('should accept custom options', () => {
            const options = {
                detectWebpackPattern: false,
                maxModules: 5000,
                chunkSize: 500
            };
            const instance = new BundleSplitterService(options);
            expect(instance.options.detectWebpackPattern).toBe(false);
            expect(instance.options.maxModules).toBe(5000);
            expect(instance.options.chunkSize).toBe(500);
        });

        test('should initialize empty statistics', () => {
            expect(service.statistics.bundlesProcessed).toBe(0);
            expect(service.statistics.modulesExtracted).toBe(0);
            expect(service.statistics.entryPointsFound).toBe(0);
            expect(service.statistics.dependenciesResolved).toBe(0);
            expect(service.statistics.chunksCreated).toBe(0);
        });

        test('should initialize empty data structures', () => {
            expect(service.modules.size).toBe(0);
            expect(service.entryPoints.size).toBe(0);
            expect(service.dependencies.size).toBe(0);
            expect(service.chunks).toEqual([]);
        });
    });

    describe('Bundle Pattern Detection', () => {
        test('should detect webpack bundle patterns', async () => {
            const webpackCode = `
                (function(modules) {
                    var installedModules = {};
                    function __webpack_require__(moduleId) {
                        if(installedModules[moduleId]) {
                            return installedModules[moduleId].exports;
                        }
                        return installedModules[moduleId] = { exports: {} };
                    }
                    return __webpack_require__(0);
                })([
                    function(module, exports) {
                        module.exports = "Hello World";
                    }
                ]);
            `;

            const result = await service.process(webpackCode, { 
                detectWebpackPattern: true,
                extractModules: false 
            });

            expect(result.success).toBe(true);
            expect(result.metadata.bundleType).toBe('webpack-commonjs');
            expect(result.metadata.patternsFound).toContain('__webpack_require__');
        });

        test('should detect webpackJsonp patterns', async () => {
            const webpackJsonpCode = `
                webpackJsonp([1], {
                    0: function(module, exports, __webpack_require__) {
                        module.exports = __webpack_require__(1);
                    },
                    1: function(module, exports) {
                        exports.hello = "world";
                    }
                });
            `;

            const result = await service.process(webpackJsonpCode, { 
                detectWebpackPattern: true,
                extractModules: false 
            });

            expect(result.success).toBe(true);
            expect(result.metadata.bundleType).toBe('webpack-jsonp');
            expect(result.metadata.patternsFound).toContain('webpackJsonp');
        });

        test('should detect webpack version', async () => {
            const webpackCode = `
                /* webpack/4.46.0 build */
                (function(modules) {
                    return modules;
                })([]);
            `;

            const result = await service.process(webpackCode);

            expect(result.success).toBe(true);
            expect(result.metadata.webpackVersion).toBe('4.46.0');
        });

        test('should handle unknown bundle types', async () => {
            const unknownCode = `
                function regularFunction() {
                    return "not a webpack bundle";
                }
            `;

            const result = await service.process(unknownCode);

            expect(result.success).toBe(true);
            expect(result.metadata.bundleType).toBe('unknown');
            expect(result.metadata.patternsFound).toEqual([]);
        });
    });

    describe('Module Extraction', () => {
        test('should extract modules from webpack array format', async () => {
            const webpackCode = `
                (function(modules) {
                    // webpack bootstrap
                })([
                    function(module, exports, __webpack_require__) {
                        module.exports = "Module 0";
                    },
                    function(module, exports, __webpack_require__) {
                        exports.value = 42;
                    },
                    function(module, exports, __webpack_require__) {
                        var mod0 = __webpack_require__(0);
                        var mod1 = __webpack_require__(1);
                        module.exports = { mod0, mod1 };
                    }
                ]);
            `;

            const result = await service.process(webpackCode, { extractModules: true });

            expect(result.success).toBe(true);
            expect(result.statistics.modulesExtracted).toBe(3);
            expect(Object.keys(result.modules)).toHaveLength(3);
            expect(result.modules[0]).toBeDefined();
            expect(result.modules[0].type).toBe('function');
            expect(result.modules[0].code).toContain('Module 0');
        });

        test('should extract modules from webpack object format', async () => {
            const webpackCode = `
                (function(modules) {
                    // webpack bootstrap
                })({
                    0: function(module, exports) {
                        module.exports = "First module";
                    },
                    1: function(module, exports) {
                        exports.data = "Second module";
                    },
                    42: function(module, exports) {
                        module.exports = { name: "Module 42" };
                    }
                });
            `;

            const result = await service.process(webpackCode, { extractModules: true });

            expect(result.success).toBe(true);
            expect(result.statistics.modulesExtracted).toBe(3);
            expect(Object.keys(result.modules)).toHaveLength(3);
            expect(result.modules[0]).toBeDefined();
            expect(result.modules[1]).toBeDefined();
            expect(result.modules[42]).toBeDefined();
        });

        test('should handle empty module arrays', async () => {
            const webpackCode = `
                (function(modules) {
                    return modules;
                })([]);
            `;

            const result = await service.process(webpackCode, { extractModules: true });

            expect(result.success).toBe(true);
            expect(result.statistics.modulesExtracted).toBe(0);
            expect(Object.keys(result.modules)).toHaveLength(0);
        });
    });

    describe('Entry Point Analysis', () => {
        test('should detect entry points from webpack_require calls', async () => {
            const webpackCode = `
                (function(modules) {
                    function __webpack_require__(moduleId) {
                        return modules[moduleId];
                    }
                    return __webpack_require__(0);
                })([
                    function(module, exports) {
                        module.exports = "entry point";
                    }
                ]);
            `;

            const result = await service.process(webpackCode, { analyzeEntryPoints: true });

            expect(result.success).toBe(true);
            expect(result.statistics.entryPointsFound).toBeGreaterThan(0);
            expect(result.entryPoints).toContain(0);
        });

        test('should detect multiple entry points', async () => {
            const webpackCode = `
                (function(modules) {
                    function __webpack_require__(moduleId) {
                        return modules[moduleId];
                    }
                    __webpack_require__(0);
                    __webpack_require__(5);
                    __webpack_require__("main");
                })([]);
            `;

            const result = await service.process(webpackCode, { analyzeEntryPoints: true });

            expect(result.success).toBe(true);
            expect(result.entryPoints.length).toBe(3);
            expect(result.entryPoints).toContain(0);
            expect(result.entryPoints).toContain(5);
            expect(result.entryPoints).toContain("main");
        });
    });

    describe('Dependency Mapping', () => {
        test('should map dependencies between modules', async () => {
            const webpackCode = `
                (function(modules) {
                    return modules;
                })([
                    function(module, exports, __webpack_require__) {
                        var dep1 = __webpack_require__(1);
                        var dep2 = __webpack_require__(2);
                        module.exports = { dep1, dep2 };
                    },
                    function(module, exports, __webpack_require__) {
                        var dep3 = __webpack_require__(3);
                        module.exports = dep3;
                    },
                    function(module, exports) {
                        module.exports = "no dependencies";
                    },
                    function(module, exports) {
                        module.exports = "dependency target";
                    }
                ]);
            `;

            const result = await service.process(webpackCode, { 
                extractModules: true,
                mapDependencies: true 
            });

            expect(result.success).toBe(true);
            expect(result.statistics.dependenciesResolved).toBeGreaterThan(0);
            expect(Object.keys(result.dependencies)).toContain('0');
            expect(result.dependencies[0]).toEqual(expect.arrayContaining([1, 2]));
            expect(result.dependencies[1]).toEqual(expect.arrayContaining([3]));
        });

        test('should handle modules with no dependencies', async () => {
            const webpackCode = `
                (function(modules) {
                    return modules;
                })([
                    function(module, exports) {
                        module.exports = "standalone module";
                    }
                ]);
            `;

            const result = await service.process(webpackCode, { 
                extractModules: true,
                mapDependencies: true 
            });

            expect(result.success).toBe(true);
            expect(Object.keys(result.dependencies)).toHaveLength(0);
        });
    });

    describe('Chunk Creation', () => {
        test('should create chunks from extracted modules', async () => {
            const webpackCode = `
                (function(modules) {
                    return modules;
                })([
                    ${Array.from({ length: 15 }, (_, i) => `
                        function(module, exports) {
                            module.exports = "Module ${i}";
                        }
                    `).join(',')}
                ]);
            `;

            const result = await service.process(webpackCode, { 
                extractModules: true,
                chunkSize: 5 
            });

            expect(result.success).toBe(true);
            expect(result.statistics.chunksCreated).toBe(3);
            expect(result.chunks).toHaveLength(3);
            
            expect(result.chunks[0].id).toBe(0);
            expect(result.chunks[0].modules).toHaveLength(5);
            expect(result.chunks[0].startIndex).toBe(0);
            expect(result.chunks[0].endIndex).toBe(4);
        });

        test('should handle single chunk for small bundles', async () => {
            const webpackCode = `
                (function(modules) {
                    return modules;
                })([
                    function(module, exports) { module.exports = "test"; }
                ]);
            `;

            const result = await service.process(webpackCode, { 
                extractModules: true,
                chunkSize: 10 
            });

            expect(result.success).toBe(true);
            expect(result.statistics.chunksCreated).toBe(1);
            expect(result.chunks[0].modules).toHaveLength(1);
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid JavaScript', async () => {
            const invalidCode = 'function invalid() { return ';

            const result = await service.process(invalidCode);

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error.phase).toBe('bundle-splitting');
            expect(result.metadata.warnings.length).toBeGreaterThan(0);
        });

        test('should handle empty input', async () => {
            const result = await service.process('');

            expect(result.success).toBe(true);
            expect(result.originalSize).toBe(0);
            expect(result.statistics.modulesExtracted).toBe(0);
        });
    });

    describe('Status and Utilities', () => {
        test('should return implementation status', () => {
            const status = service.getStatus();

            expect(status.implemented).toBe(true);
            expect(status.phase).toBe('Phase 5');
            expect(status.version).toBe('1.0.0');
            expect(status.capabilities).toContain('webpack-bundle-detection');
            expect(status.capabilities).toContain('module-extraction');
            expect(status.capabilities).toContain('dependency-mapping');
        });

        test('should provide current statistics', () => {
            const stats = service.getStatistics();

            expect(stats).toBeDefined();
            expect(stats.bundlesProcessed).toBeDefined();
            expect(stats.modulesExtracted).toBeDefined();
            expect(stats.entryPointsFound).toBeDefined();
        });

        test('should reset state properly', () => {
            service.statistics.modulesExtracted = 10;
            service.modules.set(0, { test: 'data' });
            service.entryPoints.add(0);

            service.reset();

            expect(service.statistics.bundlesProcessed).toBe(0);
            expect(service.statistics.modulesExtracted).toBe(0);
            expect(service.modules.size).toBe(0);
            expect(service.entryPoints.size).toBe(0);
            expect(service.dependencies.size).toBe(0);
            expect(service.chunks).toEqual([]);
        });
    });
});