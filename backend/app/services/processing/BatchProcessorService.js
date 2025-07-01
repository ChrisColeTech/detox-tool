/**
 * Batch Processor Service
 * Handles parallel processing of multiple files and code chunks
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 5 - Webpack Bundle Splitting
 * @version 1.0.0
 */

class BatchProcessorService {
    constructor(options = {}) {
        this.options = {
            // Processing options
            maxConcurrency: options.maxConcurrency || 4,
            batchSize: options.batchSize || 10,
            timeout: options.timeout || 30000, // 30 seconds
            retryAttempts: options.retryAttempts || 3,
            retryDelay: options.retryDelay || 1000, // 1 second
            
            // Worker options
            useWorkerThreads: options.useWorkerThreads !== false,
            workerScript: options.workerScript || null,
            
            // Processing limits
            maxMemoryUsage: options.maxMemoryUsage || 1024 * 1024 * 512, // 512MB
            maxProcessingTime: options.maxProcessingTime || 300000, // 5 minutes
            
            // Error handling
            continueOnError: options.continueOnError !== false,
            collectErrors: options.collectErrors !== false,
            
            ...options
        };
        
        // Processing state
        this.isProcessing = false;
        this.activeJobs = new Map();
        this.jobQueue = [];
        this.workers = [];
        
        // Statistics
        this.statistics = {
            totalBatches: 0,
            successfulBatches: 0,
            failedBatches: 0,
            totalItems: 0,
            processedItems: 0,
            failedItems: 0,
            totalProcessingTime: 0,
            averageProcessingTime: 0,
            throughput: 0
        };
        
        // Error collection
        this.errors = [];
        this.retryQueue = [];
    }
    
    /**
     * Process a batch of items in parallel
     * @param {Array} items - Items to process
     * @param {Function} processor - Processing function
     * @param {Object} options - Processing options
     * @returns {Object} Processing result
     */
    async processBatch(items, processor, options = {}) {
        const processingOptions = { ...this.options, ...options };
        const result = {
            success: false,
            totalItems: items.length,
            processedItems: 0,
            successfulItems: 0,
            failedItems: 0,
            results: {},
            errors: {},
            statistics: { ...this.statistics },
            metadata: {
                startTime: Date.now(),
                endTime: null,
                processingTime: 0,
                batches: [],
                warnings: []
            }
        };

        const startTime = Date.now();
        this.isProcessing = true;

        // Validate inputs before processing
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Items must be a non-empty array');
        }
        
        if (typeof processor !== 'function') {
            throw new Error('Processor must be a function');
        }

        try {

            // Split items into batches
            const batches = this._createBatches(items, processingOptions.batchSize);
            result.metadata.batches = batches.map((batch, index) => ({
                id: index,
                size: batch.length,
                status: 'pending'
            }));

            // Process batches in parallel
            const batchPromises = batches.map((batch, batchIndex) =>
                this._processBatchChunk(batch, batchIndex, processor, processingOptions, result)
            );

            // Wait for all batches to complete
            const batchResults = await Promise.allSettled(batchPromises);
            
            // Collect results
            batchResults.forEach((batchResult, batchIndex) => {
                if (batchResult.status === 'fulfilled') {
                    const batchData = batchResult.value;
                    result.processedItems += batchData.processedItems;
                    result.successfulItems += batchData.successfulItems;
                    result.failedItems += batchData.failedItems;
                    
                    // Merge results and errors
                    Object.assign(result.results, batchData.results);
                    Object.assign(result.errors, batchData.errors);
                    
                    result.metadata.batches[batchIndex].status = 'completed';
                } else {
                    result.failedItems += batches[batchIndex].length;
                    result.errors[`batch_${batchIndex}`] = batchResult.reason;
                    result.metadata.batches[batchIndex].status = 'failed';
                    result.metadata.warnings.push(`Batch ${batchIndex} failed: ${batchResult.reason?.message}`);
                }
            });

            // Update statistics
            this.statistics.totalBatches++;
            this.statistics.totalItems += items.length;
            this.statistics.processedItems += result.processedItems;
            
            if (result.failedItems === 0) {
                this.statistics.successfulBatches++;
            } else {
                this.statistics.failedBatches++;
            }
            
            this.statistics.failedItems += result.failedItems;

            result.success = result.successfulItems > 0;
            result.metadata.endTime = Date.now();
            result.metadata.processingTime = result.metadata.endTime - startTime;
            
            // Update processing time statistics
            this.statistics.totalProcessingTime += result.metadata.processingTime;
            this.statistics.averageProcessingTime = 
                this.statistics.totalProcessingTime / this.statistics.totalBatches;
            
            // Calculate throughput (items per second)
            const processingTimeSeconds = result.metadata.processingTime / 1000;
            if (processingTimeSeconds > 0) {
                this.statistics.throughput = result.processedItems / processingTimeSeconds;
            }

        } catch (error) {
            result.success = false;
            result.errors.global = error;
            result.metadata.warnings.push(`Global processing error: ${error.message}`);
        } finally {
            this.isProcessing = false;
        }

        return result;
    }
    
    /**
     * Process files in parallel
     * @param {Array} filePaths - Array of file paths to process
     * @param {Function} fileProcessor - Function to process each file
     * @param {Object} options - Processing options
     * @returns {Object} Processing result
     */
    async processFiles(filePaths, fileProcessor, options = {}) {
        return this.processBatch(filePaths, async (filePath, index) => {
            const metadata = { filePath, index, type: 'file' };
            return await fileProcessor(filePath, metadata);
        }, options);
    }
    
    /**
     * Process code chunks in parallel
     * @param {Array} codeChunks - Array of code chunks to process
     * @param {Function} chunkProcessor - Function to process each chunk
     * @param {Object} options - Processing options
     * @returns {Object} Processing result
     */
    async processCodeChunks(codeChunks, chunkProcessor, options = {}) {
        return this.processBatch(codeChunks, async (chunk, index) => {
            const metadata = { 
                chunkId: chunk.id || index,
                size: chunk.code?.length || 0,
                type: 'code-chunk'
            };
            return await chunkProcessor(chunk, metadata);
        }, options);
    }
    
    /**
     * Process a single batch chunk
     * @private
     */
    async _processBatchChunk(batch, batchIndex, processor, options, globalResult) {
        const result = {
            batchIndex,
            processedItems: 0,
            successfulItems: 0,
            failedItems: 0,
            results: {},
            errors: {}
        };

        // Process items in this batch with controlled concurrency
        const semaphore = this._createSemaphore(options.maxConcurrency);
        const itemPromises = batch.map(async (item, itemIndex) => {
            return semaphore(async () => {
                const globalIndex = batchIndex * options.batchSize + itemIndex;
                return this._processItem(item, globalIndex, processor, options);
            });
        });

        const itemResults = await Promise.allSettled(itemPromises);
        
        // Collect item results
        itemResults.forEach((itemResult, itemIndex) => {
            const globalIndex = batchIndex * options.batchSize + itemIndex;
            result.processedItems++;
            
            if (itemResult.status === 'fulfilled') {
                result.successfulItems++;
                result.results[globalIndex] = itemResult.value;
            } else {
                result.failedItems++;
                result.errors[globalIndex] = itemResult.reason;
                
                if (!options.continueOnError) {
                    throw itemResult.reason;
                }
            }
        });

        return result;
    }
    
    /**
     * Process a single item with retry logic
     * @private
     */
    async _processItem(item, index, processor, options) {
        let lastError;
        
        for (let attempt = 0; attempt <= options.retryAttempts; attempt++) {
            try {
                const startTime = Date.now();
                
                // Set up timeout
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Processing timeout')), options.timeout);
                });
                
                // Process with timeout
                const processingPromise = processor(item, index);
                const result = await Promise.race([processingPromise, timeoutPromise]);
                
                const processingTime = Date.now() - startTime;
                
                return {
                    success: true,
                    result,
                    processingTime,
                    attempts: attempt + 1
                };
                
            } catch (error) {
                lastError = error;
                
                if (attempt < options.retryAttempts) {
                    // Wait before retry
                    await this._delay(options.retryDelay * Math.pow(2, attempt));
                }
            }
        }
        
        throw lastError;
    }
    
    /**
     * Create batches from items array
     * @private
     */
    _createBatches(items, batchSize) {
        const batches = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        return batches;
    }
    
    /**
     * Create a semaphore for controlling concurrency
     * @private
     */
    _createSemaphore(maxConcurrency) {
        let running = 0;
        const queue = [];
        
        return async (task) => {
            return new Promise((resolve, reject) => {
                queue.push({ task, resolve, reject });
                process();
            });
        };
        
        function process() {
            if (running >= maxConcurrency || queue.length === 0) {
                return;
            }
            
            running++;
            const { task, resolve, reject } = queue.shift();
            
            task()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    running--;
                    process();
                });
        }
    }
    
    /**
     * Utility delay function
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Get current processing statistics
     * @returns {Object} Current statistics
     */
    getStatistics() {
        return { ...this.statistics };
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
                'parallel-processing',
                'batch-operations',
                'retry-logic',
                'timeout-handling',
                'concurrency-control',
                'error-collection',
                'performance-monitoring'
            ],
            description: "Handles parallel processing of multiple files and code chunks",
            isProcessing: this.isProcessing,
            statistics: this.getStatistics()
        };
    }
    
    /**
     * Reset service state
     */
    reset() {
        this.isProcessing = false;
        this.activeJobs.clear();
        this.jobQueue = [];
        this.workers = [];
        this.errors = [];
        this.retryQueue = [];
        
        this.statistics = {
            totalBatches: 0,
            successfulBatches: 0,
            failedBatches: 0,
            totalItems: 0,
            processedItems: 0,
            failedItems: 0,
            totalProcessingTime: 0,
            averageProcessingTime: 0,
            throughput: 0
        };
    }
}

module.exports = BatchProcessorService;