/**
 * Metrics Collector
 * Collects and analyzes performance metrics for deobfuscation processing
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 5 - Webpack Bundle Splitting
 * @version 1.0.0
 */

class MetricsCollector {
    constructor(options = {}) {
        this.options = {
            // Collection options
            collectTimings: options.collectTimings !== false,
            collectMemoryUsage: options.collectMemoryUsage !== false,
            collectCodeMetrics: options.collectCodeMetrics !== false,
            collectErrorMetrics: options.collectErrorMetrics !== false,
            
            // Storage options
            maxHistorySize: options.maxHistorySize || 1000,
            enableRealTimeMetrics: options.enableRealTimeMetrics !== false,
            
            // Analysis options
            calculatePercentiles: options.calculatePercentiles !== false,
            trackTrends: options.trackTrends !== false,
            
            ...options
        };
        
        // Metrics storage
        this.metrics = {
            processing: {
                totalJobs: 0,
                successfulJobs: 0,
                failedJobs: 0,
                totalProcessingTime: 0,
                averageProcessingTime: 0,
                minProcessingTime: Infinity,
                maxProcessingTime: 0,
                processingTimeHistory: []
            },
            
            code: {
                totalBytesProcessed: 0,
                totalLinesProcessed: 0,
                averageFileSize: 0,
                compressionRatio: 0,
                complexityReduction: 0,
                fileSizeHistory: []
            },
            
            memory: {
                peakMemoryUsage: 0,
                averageMemoryUsage: 0,
                memoryUsageHistory: [],
                gcCollections: 0
            },
            
            errors: {
                totalErrors: 0,
                errorsByType: new Map(),
                errorsByEngine: new Map(),
                errorRate: 0,
                errorHistory: []
            },
            
            engines: {
                stringArrayProcessor: { runs: 0, totalTime: 0, successRate: 0 },
                variableNameRecovery: { runs: 0, totalTime: 0, successRate: 0 },
                controlFlowProcessor: { runs: 0, totalTime: 0, successRate: 0 },
                reactComponentEngine: { runs: 0, totalTime: 0, successRate: 0 },
                bundleSplitter: { runs: 0, totalTime: 0, successRate: 0 }
            },
            
            performance: {
                throughput: 0, // bytes per second
                jobsPerSecond: 0,
                efficiency: 0, // success rate
                scalability: 0 // performance under load
            }
        };
        
        // Collection state
        this.startTime = Date.now();
        this.lastCollection = Date.now();
        this.isCollecting = false;
        
        // Event handlers
        this.eventHandlers = new Map();
    }
    
    /**
     * Start metrics collection
     */
    start() {
        this.isCollecting = true;
        this.startTime = Date.now();
        this.lastCollection = Date.now();
        
        // Set up memory monitoring if enabled
        if (this.options.collectMemoryUsage) {
            this._startMemoryMonitoring();
        }
        
        this.emit('collectionStarted');
    }
    
    /**
     * Stop metrics collection
     */
    stop() {
        this.isCollecting = false;
        this._stopMemoryMonitoring();
        this.emit('collectionStopped');
    }
    
    /**
     * Record the start of a processing job
     * @param {string} jobId - Unique job identifier
     * @param {Object} metadata - Job metadata
     */
    recordJobStart(jobId, metadata = {}) {
        if (!this.isCollecting) return;
        
        const jobMetrics = {
            id: jobId,
            startTime: Date.now(),
            inputSize: metadata.inputSize || 0,
            engine: metadata.engine || 'unknown',
            type: metadata.type || 'unknown'
        };
        
        this.eventHandlers.set(jobId, jobMetrics);
    }
    
    /**
     * Record the completion of a processing job
     * @param {string} jobId - Unique job identifier
     * @param {Object} result - Processing result
     */
    recordJobComplete(jobId, result = {}) {
        if (!this.isCollecting) return;
        
        const jobMetrics = this.eventHandlers.get(jobId);
        if (!jobMetrics) return;
        
        const endTime = Date.now();
        const processingTime = endTime - jobMetrics.startTime;
        const outputSize = result.outputSize || result.processedCode?.length || 0;
        
        // Update processing metrics
        this.metrics.processing.totalJobs++;
        this.metrics.processing.successfulJobs++;
        this.metrics.processing.totalProcessingTime += processingTime;
        this.metrics.processing.averageProcessingTime = 
            this.metrics.processing.totalProcessingTime / this.metrics.processing.totalJobs;
        this.metrics.processing.minProcessingTime = Math.min(
            this.metrics.processing.minProcessingTime, 
            processingTime
        );
        this.metrics.processing.maxProcessingTime = Math.max(
            this.metrics.processing.maxProcessingTime, 
            processingTime
        );
        
        // Add to history
        this._addToHistory(this.metrics.processing.processingTimeHistory, {
            timestamp: endTime,
            value: processingTime,
            jobId
        });
        
        // Update code metrics
        this.metrics.code.totalBytesProcessed += jobMetrics.inputSize;
        this.metrics.code.totalLinesProcessed += this._estimateLines(jobMetrics.inputSize);
        this.metrics.code.averageFileSize = 
            this.metrics.code.totalBytesProcessed / this.metrics.processing.totalJobs;
        
        // Calculate compression ratio
        if (jobMetrics.inputSize > 0 && outputSize > 0) {
            const compressionRatio = outputSize / jobMetrics.inputSize;
            this.metrics.code.compressionRatio = 
                (this.metrics.code.compressionRatio + compressionRatio) / 2;
        }
        
        this._addToHistory(this.metrics.code.fileSizeHistory, {
            timestamp: endTime,
            inputSize: jobMetrics.inputSize,
            outputSize: outputSize,
            jobId
        });
        
        // Update engine-specific metrics
        this._updateEngineMetrics(jobMetrics.engine, processingTime, true);
        
        // Update performance metrics
        this._updatePerformanceMetrics();
        
        this.eventHandlers.delete(jobId);
        this.emit('jobCompleted', { jobId, processingTime, result });
    }
    
    /**
     * Record a processing job failure
     * @param {string} jobId - Unique job identifier
     * @param {Error} error - Error that occurred
     */
    recordJobError(jobId, error) {
        if (!this.isCollecting) return;
        
        const jobMetrics = this.eventHandlers.get(jobId);
        if (!jobMetrics) return;
        
        const endTime = Date.now();
        const processingTime = endTime - jobMetrics.startTime;
        
        // Update processing metrics
        this.metrics.processing.totalJobs++;
        this.metrics.processing.failedJobs++;
        
        // Update error metrics
        this.metrics.errors.totalErrors++;
        this.metrics.errors.errorRate = 
            this.metrics.errors.totalErrors / this.metrics.processing.totalJobs;
        
        const errorType = error.name || 'UnknownError';
        const errorCount = this.metrics.errors.errorsByType.get(errorType) || 0;
        this.metrics.errors.errorsByType.set(errorType, errorCount + 1);
        
        const engineErrorCount = this.metrics.errors.errorsByEngine.get(jobMetrics.engine) || 0;
        this.metrics.errors.errorsByEngine.set(jobMetrics.engine, engineErrorCount + 1);
        
        this._addToHistory(this.metrics.errors.errorHistory, {
            timestamp: endTime,
            error: errorType,
            message: error.message,
            engine: jobMetrics.engine,
            jobId
        });
        
        // Update engine-specific metrics
        this._updateEngineMetrics(jobMetrics.engine, processingTime, false);
        
        // Update performance metrics
        this._updatePerformanceMetrics();
        
        this.eventHandlers.delete(jobId);
        this.emit('jobFailed', { jobId, error, processingTime });
    }
    
    /**
     * Get current metrics snapshot
     * @returns {Object} Current metrics
     */
    getMetrics() {
        const currentTime = Date.now();
        const uptime = currentTime - this.startTime;
        
        return {
            ...this.metrics,
            collection: {
                isCollecting: this.isCollecting,
                startTime: this.startTime,
                uptime: uptime,
                lastCollection: this.lastCollection
            },
            computed: this._computeDerivedMetrics()
        };
    }
    
    /**
     * Get metrics summary for reporting
     * @returns {Object} Metrics summary
     */
    getSummary() {
        const metrics = this.getMetrics();
        
        return {
            performance: {
                totalJobs: metrics.processing.totalJobs,
                successRate: (metrics.processing.successfulJobs / Math.max(metrics.processing.totalJobs, 1) * 100).toFixed(2) + '%',
                averageProcessingTime: metrics.processing.averageProcessingTime.toFixed(2) + 'ms',
                throughput: metrics.performance.throughput.toFixed(2) + ' bytes/sec',
                efficiency: (metrics.performance.efficiency * 100).toFixed(2) + '%'
            },
            
            code: {
                totalBytesProcessed: this._formatBytes(metrics.code.totalBytesProcessed),
                averageFileSize: this._formatBytes(metrics.code.averageFileSize),
                compressionRatio: (metrics.code.compressionRatio * 100).toFixed(2) + '%'
            },
            
            errors: {
                totalErrors: metrics.errors.totalErrors,
                errorRate: (metrics.errors.errorRate * 100).toFixed(2) + '%',
                topErrorTypes: this._getTopErrors(5)
            },
            
            engines: this._getEnginePerformance(),
            
            uptime: this._formatDuration(metrics.collection.uptime)
        };
    }
    
    /**
     * Reset all metrics
     */
    reset() {
        const wasCollecting = this.isCollecting;
        
        this.stop();
        
        this.metrics = {
            processing: {
                totalJobs: 0,
                successfulJobs: 0,
                failedJobs: 0,
                totalProcessingTime: 0,
                averageProcessingTime: 0,
                minProcessingTime: Infinity,
                maxProcessingTime: 0,
                processingTimeHistory: []
            },
            
            code: {
                totalBytesProcessed: 0,
                totalLinesProcessed: 0,
                averageFileSize: 0,
                compressionRatio: 0,
                complexityReduction: 0,
                fileSizeHistory: []
            },
            
            memory: {
                peakMemoryUsage: 0,
                averageMemoryUsage: 0,
                memoryUsageHistory: [],
                gcCollections: 0
            },
            
            errors: {
                totalErrors: 0,
                errorsByType: new Map(),
                errorsByEngine: new Map(),
                errorRate: 0,
                errorHistory: []
            },
            
            engines: {
                stringArrayProcessor: { runs: 0, totalTime: 0, successRate: 0 },
                variableNameRecovery: { runs: 0, totalTime: 0, successRate: 0 },
                controlFlowProcessor: { runs: 0, totalTime: 0, successRate: 0 },
                reactComponentEngine: { runs: 0, totalTime: 0, successRate: 0 },
                bundleSplitter: { runs: 0, totalTime: 0, successRate: 0 }
            },
            
            performance: {
                throughput: 0,
                jobsPerSecond: 0,
                efficiency: 0,
                scalability: 0
            }
        };
        
        this.eventHandlers.clear();
        
        if (wasCollecting) {
            this.start();
        }
        
        this.emit('metricsReset');
    }
    
    /**
     * Private helper methods
     * @private
     */
    _startMemoryMonitoring() {
        this.memoryInterval = setInterval(() => {
            if (typeof process !== 'undefined' && process.memoryUsage) {
                const usage = process.memoryUsage();
                const totalMemory = usage.heapUsed + usage.external;
                
                this.metrics.memory.peakMemoryUsage = Math.max(
                    this.metrics.memory.peakMemoryUsage,
                    totalMemory
                );
                
                this._addToHistory(this.metrics.memory.memoryUsageHistory, {
                    timestamp: Date.now(),
                    heapUsed: usage.heapUsed,
                    heapTotal: usage.heapTotal,
                    external: usage.external,
                    rss: usage.rss
                });
            }
        }, 1000);
    }
    
    _stopMemoryMonitoring() {
        if (this.memoryInterval) {
            clearInterval(this.memoryInterval);
            this.memoryInterval = null;
        }
    }
    
    _updateEngineMetrics(engineName, processingTime, success) {
        const engine = this.metrics.engines[engineName];
        if (!engine) return;
        
        engine.runs++;
        engine.totalTime += processingTime;
        
        if (success) {
            engine.successRate = ((engine.successRate * (engine.runs - 1)) + 1) / engine.runs;
        } else {
            engine.successRate = (engine.successRate * (engine.runs - 1)) / engine.runs;
        }
    }
    
    _updatePerformanceMetrics() {
        const currentTime = Date.now();
        const uptime = (currentTime - this.startTime) / 1000; // seconds
        
        if (uptime > 0) {
            this.metrics.performance.throughput = this.metrics.code.totalBytesProcessed / uptime;
            this.metrics.performance.jobsPerSecond = this.metrics.processing.totalJobs / uptime;
        }
        
        if (this.metrics.processing.totalJobs > 0) {
            this.metrics.performance.efficiency = 
                this.metrics.processing.successfulJobs / this.metrics.processing.totalJobs;
        }
    }
    
    _computeDerivedMetrics() {
        return {
            percentiles: this._calculatePercentiles(),
            trends: this._calculateTrends()
        };
    }
    
    _calculatePercentiles() {
        if (!this.options.calculatePercentiles) return {};
        
        const times = this.metrics.processing.processingTimeHistory.map(h => h.value);
        if (times.length === 0) return {};
        
        times.sort((a, b) => a - b);
        
        return {
            p50: this._percentile(times, 50),
            p90: this._percentile(times, 90),
            p95: this._percentile(times, 95),
            p99: this._percentile(times, 99)
        };
    }
    
    _calculateTrends() {
        if (!this.options.trackTrends) return {};
        
        return {
            processingTimesTrend: this._calculateTrend(
                this.metrics.processing.processingTimeHistory.slice(-100)
            )
        };
    }
    
    _addToHistory(historyArray, item) {
        historyArray.push(item);
        
        if (historyArray.length > this.options.maxHistorySize) {
            historyArray.shift();
        }
    }
    
    _estimateLines(bytes) {
        return Math.ceil(bytes / 50); // Rough estimate: 50 chars per line
    }
    
    _formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
    
    _formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    _getTopErrors(limit) {
        return Array.from(this.metrics.errors.errorsByType.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([type, count]) => ({ type, count }));
    }
    
    _getEnginePerformance() {
        const performance = {};
        for (const [name, engine] of Object.entries(this.metrics.engines)) {
            if (engine.runs > 0) {
                performance[name] = {
                    runs: engine.runs,
                    averageTime: (engine.totalTime / engine.runs).toFixed(2) + 'ms',
                    successRate: (engine.successRate * 100).toFixed(2) + '%'
                };
            }
        }
        return performance;
    }
    
    _percentile(sortedArray, percentile) {
        const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
        return sortedArray[Math.max(0, index)];
    }
    
    _calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const values = data.map(d => d.value || d.inputSize || 0);
        const n = values.length;
        
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumXX += i * i;
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }
    
    /**
     * Event emitter functionality
     */
    emit(event, data) {
        // Simple event emission - could be enhanced with full EventEmitter
        if (this.options.enableRealTimeMetrics) {
            console.log(`MetricsCollector: ${event}`, data);
        }
    }
    
    /**
     * Get service status and capabilities
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            implemented: true,
            phase: "Phase 5",
            version: "1.0.0",
            capabilities: [
                'performance-metrics-collection',
                'memory-usage-monitoring',
                'error-tracking',
                'engine-performance-analysis',
                'real-time-metrics',
                'metrics-export'
            ],
            description: "Collects and analyzes performance metrics for deobfuscation processing",
            isCollecting: this.isCollecting,
            statistics: this.getSummary()
        };
    }
}

module.exports = MetricsCollector;