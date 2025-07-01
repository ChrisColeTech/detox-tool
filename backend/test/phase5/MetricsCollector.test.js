/**
 * MetricsCollector Test Suite
 * Comprehensive tests for MetricsCollector
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 5 - Webpack Bundle Splitting
 * @version 1.0.0
 */

const MetricsCollector = require('../../app/core/analyzers/MetricsCollector');

describe('MetricsCollector', () => {
    let collector;
    
    beforeEach(() => {
        collector = new MetricsCollector({
            enableRealTimeMetrics: false // Disable console logging for tests
        });
    });

    afterEach(() => {
        if (collector.isCollecting) {
            collector.stop();
        }
    });

    describe('Constructor', () => {
        test('should initialize with default options', () => {
            const instance = new MetricsCollector();
            expect(instance.options.collectTimings).toBe(true);
            expect(instance.options.collectMemoryUsage).toBe(true);
            expect(instance.options.collectCodeMetrics).toBe(true);
            expect(instance.options.collectErrorMetrics).toBe(true);
            expect(instance.options.maxHistorySize).toBe(1000);
            expect(instance.options.enableRealTimeMetrics).toBe(true);
        });

        test('should accept custom options', () => {
            const options = {
                collectTimings: false,
                maxHistorySize: 500,
                enableRealTimeMetrics: false,
                calculatePercentiles: true,
                trackTrends: true
            };
            const instance = new MetricsCollector(options);
            expect(instance.options.collectTimings).toBe(false);
            expect(instance.options.maxHistorySize).toBe(500);
            expect(instance.options.enableRealTimeMetrics).toBe(false);
            expect(instance.options.calculatePercentiles).toBe(true);
        });

        test('should initialize empty metrics', () => {
            expect(collector.metrics.processing.totalJobs).toBe(0);
            expect(collector.metrics.processing.successfulJobs).toBe(0);
            expect(collector.metrics.processing.failedJobs).toBe(0);
            expect(collector.metrics.code.totalBytesProcessed).toBe(0);
            expect(collector.metrics.memory.peakMemoryUsage).toBe(0);
            expect(collector.metrics.errors.totalErrors).toBe(0);
        });

        test('should initialize collection state', () => {
            expect(collector.isCollecting).toBe(false);
            expect(collector.startTime).toBeDefined();
            expect(collector.lastCollection).toBeDefined();
            expect(collector.eventHandlers.size).toBe(0);
        });
    });

    describe('Collection Control', () => {
        test('should start collection', () => {
            collector.start();
            expect(collector.isCollecting).toBe(true);
            expect(collector.startTime).toBeDefined();
        });

        test('should stop collection', () => {
            collector.start();
            collector.stop();
            expect(collector.isCollecting).toBe(false);
        });

        test('should not record metrics when not collecting', () => {
            expect(collector.isCollecting).toBe(false);
            collector.recordJobStart('test-job', { inputSize: 100 });
            expect(collector.eventHandlers.size).toBe(0);
        });
    });

    describe('Job Metrics Recording', () => {
        beforeEach(() => {
            collector.start();
        });

        test('should record job start', () => {
            const jobId = 'test-job-1';
            const metadata = {
                inputSize: 1000,
                engine: 'stringArrayProcessor',
                type: 'deobfuscation'
            };

            collector.recordJobStart(jobId, metadata);

            expect(collector.eventHandlers.has(jobId)).toBe(true);
            const jobMetrics = collector.eventHandlers.get(jobId);
            expect(jobMetrics.id).toBe(jobId);
            expect(jobMetrics.inputSize).toBe(1000);
            expect(jobMetrics.engine).toBe('stringArrayProcessor');
            expect(jobMetrics.type).toBe('deobfuscation');
            expect(jobMetrics.startTime).toBeDefined();
        });

        test('should record job completion', () => {
            const jobId = 'test-job-2';
            const metadata = { inputSize: 500, engine: 'bundleSplitter' };
            const result = { outputSize: 400, success: true };

            collector.recordJobStart(jobId, metadata);
            collector.recordJobComplete(jobId, result);

            const metrics = collector.getMetrics();
            expect(metrics.processing.totalJobs).toBe(1);
            expect(metrics.processing.successfulJobs).toBe(1);
            expect(metrics.processing.failedJobs).toBe(0);
            expect(metrics.code.totalBytesProcessed).toBe(500);
            expect(metrics.engines.bundleSplitter.runs).toBe(1);
            expect(collector.eventHandlers.has(jobId)).toBe(false);
        });

        test('should record job errors', () => {
            const jobId = 'test-job-3';
            const metadata = { inputSize: 300, engine: 'variableNameRecovery' };
            const error = new Error('Processing failed');

            collector.recordJobStart(jobId, metadata);
            collector.recordJobError(jobId, error);

            const metrics = collector.getMetrics();
            expect(metrics.processing.totalJobs).toBe(1);
            expect(metrics.processing.successfulJobs).toBe(0);
            expect(metrics.processing.failedJobs).toBe(1);
            expect(metrics.errors.totalErrors).toBe(1);
            expect(metrics.errors.errorsByType.get('Error')).toBe(1);
            expect(metrics.errors.errorsByEngine.get('variableNameRecovery')).toBe(1);
            expect(collector.eventHandlers.has(jobId)).toBe(false);
        });

        test('should calculate processing statistics', () => {
            const jobs = [
                { id: 'job1', inputSize: 1000, outputSize: 800 },
                { id: 'job2', inputSize: 500, outputSize: 400 },
                { id: 'job3', inputSize: 2000, outputSize: 1600 }
            ];

            jobs.forEach(job => {
                collector.recordJobStart(job.id, { inputSize: job.inputSize });
                // Add small delay to ensure processing time > 0
                setTimeout(() => {
                    collector.recordJobComplete(job.id, { outputSize: job.outputSize });
                }, 1);
            });

            // Allow some time for async processing
            return new Promise(resolve => {
                setTimeout(() => {
                    const metrics = collector.getMetrics();
                    expect(metrics.processing.totalJobs).toBe(3);
                    expect(metrics.processing.successfulJobs).toBe(3);
                    expect(metrics.code.totalBytesProcessed).toBe(3500);
                    expect(metrics.processing.averageProcessingTime).toBeGreaterThanOrEqual(0);
                    resolve();
                }, 50);
            });
        });
    });

    describe('Engine Performance Tracking', () => {
        beforeEach(() => {
            collector.start();
        });

        test('should track engine-specific metrics', () => {
            const jobId = 'engine-test';
            collector.recordJobStart(jobId, { 
                inputSize: 100, 
                engine: 'stringArrayProcessor' 
            });
            collector.recordJobComplete(jobId, { outputSize: 80 });

            const metrics = collector.getMetrics();
            const engine = metrics.engines.stringArrayProcessor;
            expect(engine.runs).toBe(1);
            expect(engine.totalTime).toBeGreaterThanOrEqual(0);
            expect(engine.successRate).toBe(1);
        });

        test('should calculate engine success rates', () => {
            const engine = 'controlFlowProcessor';
            
            // Record successful job
            collector.recordJobStart('success-job', { inputSize: 100, engine });
            collector.recordJobComplete('success-job', { outputSize: 80 });
            
            // Record failed job
            collector.recordJobStart('failed-job', { inputSize: 100, engine });
            collector.recordJobError('failed-job', new Error('Test error'));

            const metrics = collector.getMetrics();
            const engineMetrics = metrics.engines[engine];
            expect(engineMetrics.runs).toBe(2);
            expect(engineMetrics.successRate).toBe(0.5);
        });
    });

    describe('Error Tracking', () => {
        beforeEach(() => {
            collector.start();
        });

        test('should track error types', () => {
            const errors = [
                new SyntaxError('Syntax error'),
                new TypeError('Type error'),
                new Error('Generic error'),
                new SyntaxError('Another syntax error')
            ];

            errors.forEach((error, index) => {
                const jobId = `error-job-${index}`;
                collector.recordJobStart(jobId, { inputSize: 100 });
                collector.recordJobError(jobId, error);
            });

            const metrics = collector.getMetrics();
            expect(metrics.errors.totalErrors).toBe(4);
            expect(metrics.errors.errorsByType.get('SyntaxError')).toBe(2);
            expect(metrics.errors.errorsByType.get('TypeError')).toBe(1);
            expect(metrics.errors.errorsByType.get('Error')).toBe(1);
        });

        test('should calculate error rates', () => {
            // Record successful jobs
            for (let i = 0; i < 7; i++) {
                collector.recordJobStart(`success-${i}`, { inputSize: 100 });
                collector.recordJobComplete(`success-${i}`, { outputSize: 80 });
            }

            // Record failed jobs
            for (let i = 0; i < 3; i++) {
                collector.recordJobStart(`failed-${i}`, { inputSize: 100 });
                collector.recordJobError(`failed-${i}`, new Error('Test error'));
            }

            const metrics = collector.getMetrics();
            expect(metrics.processing.totalJobs).toBe(10);
            expect(metrics.errors.totalErrors).toBe(3);
            expect(metrics.errors.errorRate).toBe(0.3);
        });
    });

    describe('Performance Metrics', () => {
        beforeEach(() => {
            collector.start();
        });

        test('should calculate throughput', (done) => {
            const jobId = 'throughput-test';
            collector.recordJobStart(jobId, { inputSize: 1000 });
            
            setTimeout(() => {
                collector.recordJobComplete(jobId, { outputSize: 800 });
                
                const metrics = collector.getMetrics();
                expect(metrics.performance.throughput).toBeGreaterThan(0);
                expect(metrics.performance.jobsPerSecond).toBeGreaterThan(0);
                done();
            }, 10);
        });

        test('should calculate efficiency', () => {
            // Record mixed results
            collector.recordJobStart('success1', { inputSize: 100 });
            collector.recordJobComplete('success1', { outputSize: 80 });
            
            collector.recordJobStart('success2', { inputSize: 100 });
            collector.recordJobComplete('success2', { outputSize: 80 });
            
            collector.recordJobStart('failed1', { inputSize: 100 });
            collector.recordJobError('failed1', new Error('Test error'));

            const metrics = collector.getMetrics();
            expect(metrics.processing.totalJobs).toBe(3);
            expect(metrics.processing.successfulJobs).toBe(2);
            expect(metrics.processing.failedJobs).toBe(1);
            expect(metrics.performance.efficiency).toBeCloseTo(2/3, 2); // 2 successful out of 3 total
        });
    });

    describe('Metrics Reporting', () => {
        beforeEach(() => {
            collector.start();
        });

        test('should provide metrics snapshot', () => {
            const metrics = collector.getMetrics();
            
            expect(metrics.processing).toBeDefined();
            expect(metrics.code).toBeDefined();
            expect(metrics.memory).toBeDefined();
            expect(metrics.errors).toBeDefined();
            expect(metrics.engines).toBeDefined();
            expect(metrics.performance).toBeDefined();
            expect(metrics.collection).toBeDefined();
            expect(metrics.computed).toBeDefined();
        });

        test('should provide formatted summary', () => {
            // Add some test data
            collector.recordJobStart('summary-test', { inputSize: 1000 });
            collector.recordJobComplete('summary-test', { outputSize: 800 });

            const summary = collector.getSummary();
            
            expect(summary.performance).toBeDefined();
            expect(summary.code).toBeDefined();
            expect(summary.errors).toBeDefined();
            expect(summary.engines).toBeDefined();
            expect(summary.uptime).toBeDefined();
            
            expect(summary.performance.totalJobs).toBe(1);
            expect(summary.performance.successRate).toContain('%');
            expect(summary.code.totalBytesProcessed).toContain('B');
        });
    });

    describe('History Management', () => {
        beforeEach(() => {
            collector.start();
        });

        test('should maintain processing time history', () => {
            const jobId = 'history-test';
            collector.recordJobStart(jobId, { inputSize: 100 });
            collector.recordJobComplete(jobId, { outputSize: 80 });

            const metrics = collector.getMetrics();
            expect(metrics.processing.processingTimeHistory).toHaveLength(1);
            expect(metrics.processing.processingTimeHistory[0].jobId).toBe(jobId);
        });

        test('should limit history size', () => {
            const limitedCollector = new MetricsCollector({ 
                maxHistorySize: 2,
                enableRealTimeMetrics: false 
            });
            limitedCollector.start();

            // Add 3 items to history
            for (let i = 0; i < 3; i++) {
                limitedCollector.recordJobStart(`job-${i}`, { inputSize: 100 });
                limitedCollector.recordJobComplete(`job-${i}`, { outputSize: 80 });
            }

            const metrics = limitedCollector.getMetrics();
            expect(metrics.processing.processingTimeHistory).toHaveLength(2);
            limitedCollector.stop();
        });
    });

    describe('Status and Utilities', () => {
        test('should return implementation status', () => {
            const status = collector.getStatus();

            expect(status.implemented).toBe(true);
            expect(status.phase).toBe('Phase 5');
            expect(status.version).toBe('1.0.0');
            expect(status.capabilities).toContain('performance-metrics-collection');
            expect(status.capabilities).toContain('memory-usage-monitoring');
            expect(status.capabilities).toContain('error-tracking');
            expect(status.capabilities).toContain('engine-performance-analysis');
        });

        test('should reset metrics', () => {
            collector.start();
            collector.recordJobStart('reset-test', { inputSize: 100 });
            collector.recordJobComplete('reset-test', { outputSize: 80 });

            expect(collector.metrics.processing.totalJobs).toBe(1);

            collector.reset();

            expect(collector.metrics.processing.totalJobs).toBe(0);
            expect(collector.metrics.code.totalBytesProcessed).toBe(0);
            expect(collector.eventHandlers.size).toBe(0);
        });

        test('should preserve collection state after reset', () => {
            collector.start();
            expect(collector.isCollecting).toBe(true);

            collector.reset();
            expect(collector.isCollecting).toBe(true);

            collector.stop();
            collector.reset();
            expect(collector.isCollecting).toBe(false);
        });
    });

    describe('Percentiles and Trends', () => {
        beforeEach(() => {
            collector = new MetricsCollector({
                calculatePercentiles: true,
                trackTrends: true,
                enableRealTimeMetrics: false
            });
            collector.start();
        });

        test('should calculate percentiles when enabled', (done) => {
            // Add some processing times
            const processingTimes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
            
            processingTimes.forEach((time, index) => {
                const jobId = `percentile-job-${index}`;
                collector.recordJobStart(jobId, { inputSize: 100 });
                
                setTimeout(() => {
                    collector.recordJobComplete(jobId, { outputSize: 80 });
                    
                    if (index === processingTimes.length - 1) {
                        const metrics = collector.getMetrics();
                        const percentiles = metrics.computed.percentiles;
                        
                        expect(percentiles).toBeDefined();
                        expect(percentiles.p50).toBeDefined();
                        expect(percentiles.p90).toBeDefined();
                        expect(percentiles.p95).toBeDefined();
                        expect(percentiles.p99).toBeDefined();
                        done();
                    }
                }, time);
            });
        });
    });
});