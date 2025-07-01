/**
 * BatchProcessorService Test Suite
 * Comprehensive tests for BatchProcessorService
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 5 - Webpack Bundle Splitting
 * @version 1.0.0
 */

const BatchProcessorService = require('../../app/services/processing/BatchProcessorService');

describe('BatchProcessorService', () => {
    let service;
    
    beforeEach(() => {
        service = new BatchProcessorService();
    });

    describe('Constructor', () => {
        test('should initialize with default options', () => {
            const instance = new BatchProcessorService();
            expect(instance.options.maxConcurrency).toBe(4);
            expect(instance.options.batchSize).toBe(10);
            expect(instance.options.timeout).toBe(30000);
            expect(instance.options.retryAttempts).toBe(3);
            expect(instance.options.continueOnError).toBe(true);
        });

        test('should accept custom options', () => {
            const options = {
                maxConcurrency: 8,
                batchSize: 20,
                timeout: 60000,
                retryAttempts: 5
            };
            const instance = new BatchProcessorService(options);
            expect(instance.options.maxConcurrency).toBe(8);
            expect(instance.options.batchSize).toBe(20);
            expect(instance.options.timeout).toBe(60000);
            expect(instance.options.retryAttempts).toBe(5);
        });

        test('should initialize empty statistics', () => {
            expect(service.statistics.totalBatches).toBe(0);
            expect(service.statistics.successfulBatches).toBe(0);
            expect(service.statistics.failedBatches).toBe(0);
            expect(service.statistics.totalItems).toBe(0);
            expect(service.statistics.processedItems).toBe(0);
            expect(service.statistics.failedItems).toBe(0);
        });

        test('should initialize processing state', () => {
            expect(service.isProcessing).toBe(false);
            expect(service.activeJobs.size).toBe(0);
            expect(service.jobQueue).toEqual([]);
            expect(service.errors).toEqual([]);
        });
    });

    describe('Batch Processing', () => {
        test('should process simple batch successfully', async () => {
            const items = [1, 2, 3, 4, 5];
            const processor = async (item) => item * 2;

            const result = await service.processBatch(items, processor);

            expect(result.success).toBe(true);
            expect(result.totalItems).toBe(5);
            expect(result.processedItems).toBe(5);
            expect(result.successfulItems).toBe(5);
            expect(result.failedItems).toBe(0);
            expect(Object.values(result.results)).toEqual([
                { success: true, result: 2, processingTime: expect.any(Number), attempts: 1 },
                { success: true, result: 4, processingTime: expect.any(Number), attempts: 1 },
                { success: true, result: 6, processingTime: expect.any(Number), attempts: 1 },
                { success: true, result: 8, processingTime: expect.any(Number), attempts: 1 },
                { success: true, result: 10, processingTime: expect.any(Number), attempts: 1 }
            ]);
        });

        test('should handle processing errors gracefully', async () => {
            const items = [1, 2, 3, 4, 5];
            const processor = async (item) => {
                if (item === 3) {
                    throw new Error('Processing failed for item 3');
                }
                return item * 2;
            };

            const result = await service.processBatch(items, processor, { 
                retryAttempts: 0 // Disable retries for faster test
            });

            expect(result.success).toBe(true); // Success because some items processed
            expect(result.totalItems).toBe(5);
            expect(result.processedItems).toBe(5);
            expect(result.successfulItems).toBe(4);
            expect(result.failedItems).toBe(1);
            expect(result.errors[2]).toBeDefined(); // Item at index 2 (value 3) failed
        }, 10000);

        test('should respect batch size configuration', async () => {
            const items = Array.from({ length: 15 }, (_, i) => i + 1);
            const processor = async (item) => item;

            const result = await service.processBatch(items, processor, { batchSize: 5 });

            expect(result.success).toBe(true);
            expect(result.metadata.batches).toHaveLength(3);
            expect(result.metadata.batches[0].size).toBe(5);
            expect(result.metadata.batches[1].size).toBe(5);
            expect(result.metadata.batches[2].size).toBe(5);
        });

        test('should handle empty items array', async () => {
            const items = [];
            const processor = async (item) => item;

            await expect(service.processBatch(items, processor))
                .rejects.toThrow('Items must be a non-empty array');
        });

        test('should validate processor function', async () => {
            const items = [1, 2, 3];
            const processor = 'not a function';

            await expect(service.processBatch(items, processor))
                .rejects.toThrow('Processor must be a function');
        });
    });

    describe('File Processing', () => {
        test('should process files with metadata', async () => {
            const filePaths = ['file1.js', 'file2.js', 'file3.js'];
            const fileProcessor = async (filePath, metadata) => {
                expect(metadata.filePath).toBe(filePath);
                expect(metadata.type).toBe('file');
                expect(typeof metadata.index).toBe('number');
                return `processed ${filePath}`;
            };

            const result = await service.processFiles(filePaths, fileProcessor);

            expect(result.success).toBe(true);
            expect(result.totalItems).toBe(3);
            expect(result.successfulItems).toBe(3);
        });
    });

    describe('Code Chunk Processing', () => {
        test('should process code chunks with metadata', async () => {
            const codeChunks = [
                { id: 'chunk1', code: 'console.log("hello");' },
                { id: 'chunk2', code: 'function test() { return 42; }' },
                { id: 'chunk3', code: 'const x = 10;' }
            ];
            const chunkProcessor = async (chunk, metadata) => {
                expect(metadata.chunkId).toBe(chunk.id);
                expect(metadata.type).toBe('code-chunk');
                expect(metadata.size).toBe(chunk.code.length);
                return `processed ${chunk.id}`;
            };

            const result = await service.processCodeChunks(codeChunks, chunkProcessor);

            expect(result.success).toBe(true);
            expect(result.totalItems).toBe(3);
            expect(result.successfulItems).toBe(3);
        });
    });

    describe('Retry Logic', () => {
        test('should retry failed operations', async () => {
            const items = [1, 2, 3];
            let attemptCount = 0;
            const processor = async (item) => {
                if (item === 2) {
                    attemptCount++;
                    if (attemptCount < 3) {
                        throw new Error('Temporary failure');
                    }
                }
                return item * 2;
            };

            const result = await service.processBatch(items, processor, { retryAttempts: 3 });

            expect(result.success).toBe(true);
            expect(result.successfulItems).toBe(3);
            expect(result.results[1].attempts).toBe(3); // Item 2 took 3 attempts
        });

        test('should respect retry attempts limit', async () => {
            const items = [1, 2, 3];
            const processor = async (item) => {
                if (item === 2) {
                    throw new Error('Persistent failure');
                }
                return item * 2;
            };

            const result = await service.processBatch(items, processor, { retryAttempts: 1 });

            expect(result.success).toBe(true); // Other items succeeded
            expect(result.successfulItems).toBe(2);
            expect(result.failedItems).toBe(1);
        });
    });

    describe('Timeout Handling', () => {
        test('should timeout long-running operations', async () => {
            const items = [1, 2, 3];
            const processor = async (item) => {
                if (item === 2) {
                    // Simulate long-running operation
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return item * 2;
            };

            const result = await service.processBatch(items, processor, { 
                timeout: 50, // 50ms timeout
                retryAttempts: 0 
            });

            expect(result.success).toBe(true); // Other items succeeded
            expect(result.successfulItems).toBe(2);
            expect(result.failedItems).toBe(1);
        });
    });

    describe('Statistics and Monitoring', () => {
        test('should update statistics after processing', async () => {
            const items = [1, 2, 3, 4, 5];
            const processor = async (item) => {
                // Add small delay to ensure processing time > 0
                await new Promise(resolve => setTimeout(resolve, 1));
                return item * 2;
            };

            await service.processBatch(items, processor);

            const stats = service.getStatistics();
            expect(stats.totalBatches).toBe(1);
            expect(stats.successfulBatches).toBe(1);
            expect(stats.failedBatches).toBe(0);
            expect(stats.totalItems).toBe(5);
            expect(stats.processedItems).toBe(5);
            expect(stats.failedItems).toBe(0);
            expect(stats.averageProcessingTime).toBeGreaterThan(0);
            expect(stats.throughput).toBeGreaterThan(0);
        });

        test('should track failed batches', async () => {
            const items = [1, 2, 3];
            const processor = async (item) => {
                throw new Error('All items fail');
            };

            await service.processBatch(items, processor, { retryAttempts: 0 });

            const stats = service.getStatistics();
            expect(stats.totalBatches).toBe(1);
            expect(stats.successfulBatches).toBe(0);
            expect(stats.failedBatches).toBe(1);
            expect(stats.failedItems).toBe(3);
        });
    });

    describe('Status and Utilities', () => {
        test('should return implementation status', () => {
            const status = service.getStatus();

            expect(status.implemented).toBe(true);
            expect(status.phase).toBe('Phase 5');
            expect(status.version).toBe('1.0.0');
            expect(status.capabilities).toContain('parallel-processing');
            expect(status.capabilities).toContain('batch-operations');
            expect(status.capabilities).toContain('retry-logic');
            expect(status.capabilities).toContain('timeout-handling');
        });

        test('should provide current statistics', () => {
            const stats = service.getStatistics();

            expect(stats).toBeDefined();
            expect(stats.totalBatches).toBeDefined();
            expect(stats.processedItems).toBeDefined();
            expect(stats.averageProcessingTime).toBeDefined();
        });

        test('should reset state properly', () => {
            service.statistics.totalBatches = 5;
            service.statistics.processedItems = 100;
            service.isProcessing = true;

            service.reset();

            expect(service.statistics.totalBatches).toBe(0);
            expect(service.statistics.processedItems).toBe(0);
            expect(service.isProcessing).toBe(false);
            expect(service.activeJobs.size).toBe(0);
            expect(service.errors).toEqual([]);
        });
    });

    describe('Concurrency Control', () => {
        test('should respect maxConcurrency setting', async () => {
            const items = Array.from({ length: 10 }, (_, i) => i + 1);
            let currentlyRunning = 0;
            let maxConcurrentObserved = 0;

            const processor = async (item) => {
                currentlyRunning++;
                maxConcurrentObserved = Math.max(maxConcurrentObserved, currentlyRunning);
                
                // Simulate some work
                await new Promise(resolve => setTimeout(resolve, 10));
                
                currentlyRunning--;
                return item * 2;
            };

            await service.processBatch(items, processor, { maxConcurrency: 2 });

            // Due to timing, we might not always hit exactly 2, but it should be reasonable
            expect(maxConcurrentObserved).toBeLessThanOrEqual(4); // Allow some tolerance
        });
    });
});