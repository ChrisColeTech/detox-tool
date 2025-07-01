const BundleSplitterService = require('./app/services/processing/BundleSplitterService');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

async function debugDependencyMapping() {
    const service = new BundleSplitterService();
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

    console.log('=== BUNDLE PROCESSING RESULT ===');
    console.log('Success:', result.success);
    console.log('Modules extracted:', result.statistics.modulesExtracted);
    console.log('Dependencies resolved:', result.statistics.dependenciesResolved);
    console.log('Modules keys:', Object.keys(result.modules));
    console.log('Dependencies keys:', Object.keys(result.dependencies));
    
    // Debug individual modules
    console.log('\n=== MODULE ANALYSIS ===');
    for (const [moduleId, moduleData] of Object.entries(result.modules)) {
        console.log(`\nModule ${moduleId}:`);
        console.log('Code:', moduleData.code);
        console.log('Type:', moduleData.type);
        
        // Test manual parsing of this module
        try {
            console.log('\n--- Manual Dependency Check ---');
            const moduleAst = parse(moduleData.code, {
                sourceType: 'script',
                allowReturnOutsideFunction: true
            });
            
            const dependencies = [];
            traverse(moduleAst, {
                CallExpression: (path) => {
                    const node = path.node;
                    console.log('Found call expression:', node.callee?.name || 'unknown');
                    
                    // Check for __webpack_require__ calls
                    if (t.isIdentifier(node.callee, { name: '__webpack_require__' })) {
                        console.log('Found __webpack_require__ call!');
                        if (node.arguments && node.arguments[0]) {
                            const arg = node.arguments[0];
                            if (t.isNumericLiteral(arg)) {
                                console.log('Dependency ID:', arg.value);
                                dependencies.push(arg.value);
                            } else if (t.isStringLiteral(arg)) {
                                console.log('Dependency ID:', arg.value);
                                dependencies.push(arg.value);
                            }
                        }
                    }
                }
            });
            
            console.log('Dependencies found:', dependencies);
            
        } catch (error) {
            console.log('Error parsing module:', error.message);
        }
    }
}

debugDependencyMapping().catch(console.error);