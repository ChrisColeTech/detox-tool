const BundleSplitterService = require('./app/services/processing/BundleSplitterService');

async function debugBundleSplitter() {
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

    console.log('Success:', result.success);
    console.log('Modules extracted:', result.statistics.modulesExtracted);
    console.log('Dependencies resolved:', result.statistics.dependenciesResolved);
    console.log('Modules keys:', Object.keys(result.modules));
    console.log('Dependencies keys:', Object.keys(result.dependencies));
    if (result.dependencies[0]) {
        console.log('Module 0 deps:', result.dependencies[0]);
    }
}

debugBundleSplitter().catch(console.error);