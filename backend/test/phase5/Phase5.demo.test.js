/**
 * Phase 5 Integration Demo Test Suite
 * Integration tests for Phase 5 components working together
 * 
 * @status: Phase 5 - Implemented
 * @created: 2025-06-30
 */

const BundleSplitterService = require('../../app/services/processing/BundleSplitterService');
const BatchProcessorService = require('../../app/services/processing/BatchProcessorService');
const MetricsCollector = require('../../app/core/analyzers/MetricsCollector');

describe('Phase 5 Integration Demo', () => {
  let bundleSplitter;
  let batchProcessor;
  let metricsCollector;
  
  beforeEach(() => {
    bundleSplitter = new BundleSplitterService();
    batchProcessor = new BatchProcessorService();
    metricsCollector = new MetricsCollector();
  });

  describe('Component Initialization', () => {
    test('should initialize BundleSplitterService successfully', () => {
      expect(bundleSplitter).toBeDefined();
      expect(bundleSplitter.getStatus().implemented).toBe(true);
      expect(bundleSplitter.getStatus().phase).toBe('Phase 5');
    });

    test('should initialize BatchProcessorService successfully', () => {
      expect(batchProcessor).toBeDefined();
      expect(batchProcessor.getStatus().implemented).toBe(true);
      expect(batchProcessor.getStatus().phase).toBe('Phase 5');
    });

    test('should initialize MetricsCollector successfully', () => {
      expect(metricsCollector).toBeDefined();
      expect(metricsCollector.getStatus().implemented).toBe(true);
      expect(metricsCollector.getStatus().phase).toBe('Phase 5');
    });
  });

  describe('Core Functionality Integration', () => {
    test('should process webpack bundle and create chunks', async () => {
      const webpackCode = `
        (function(modules) {
          return modules;
        })([
          function(module, exports, __webpack_require__) {
            var dep1 = __webpack_require__(1);
            module.exports = dep1;
          },
          function(module, exports) {
            module.exports = "test module";
          }
        ]);
      `;

      const result = await bundleSplitter.process(webpackCode, {
        extractModules: true,
        mapDependencies: true,
        chunkSize: 1
      });

      expect(result.success).toBe(true);
      expect(result.statistics.modulesExtracted).toBe(2);
      expect(result.statistics.dependenciesResolved).toBe(1);
      expect(result.statistics.chunksCreated).toBe(2);
    });

    test('should collect metrics during processing', async () => {
      metricsCollector.start();
      
      const jobId = 'test-job-1';
      metricsCollector.recordJobStart(jobId, {
        inputSize: 1000,
        engine: 'bundleSplitter',
        type: 'webpack-bundle'
      });

      metricsCollector.recordJobComplete(jobId, {
        outputSize: 800,
        success: true
      });

      const metrics = metricsCollector.getMetrics();
      expect(metrics.processing.totalJobs).toBe(1);
      expect(metrics.processing.successfulJobs).toBe(1);
      expect(metrics.code.totalBytesProcessed).toBe(1000);
    });
  });

  describe('Status and Utilities', () => {
    test('should return implementation status for all components', () => {
      const bundleStatus = bundleSplitter.getStatus();
      const batchStatus = batchProcessor.getStatus();
      const metricsStatus = metricsCollector.getStatus();

      expect(bundleStatus.implemented).toBe(true);
      expect(batchStatus.implemented).toBe(true);
      expect(metricsStatus.implemented).toBe(true);

      expect(bundleStatus.phase).toBe('Phase 5');
      expect(batchStatus.phase).toBe('Phase 5');
      expect(metricsStatus.phase).toBe('Phase 5');
    });

    test('should provide comprehensive capabilities', () => {
      const bundleStatus = bundleSplitter.getStatus();
      const batchStatus = batchProcessor.getStatus();
      const metricsStatus = metricsCollector.getStatus();

      expect(bundleStatus.capabilities).toContain('webpack-bundle-detection');
      expect(bundleStatus.capabilities).toContain('module-extraction');
      expect(bundleStatus.capabilities).toContain('dependency-mapping');

      expect(batchStatus.capabilities).toContain('parallel-processing');
      expect(batchStatus.capabilities).toContain('batch-operations');

      expect(metricsStatus.capabilities).toContain('performance-metrics-collection');
      expect(metricsStatus.capabilities).toContain('error-tracking');
    });
  });
});
