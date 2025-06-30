# Frontend API Integration Guide

This document provides comprehensive mapping between frontend services/hooks and backend API endpoints, ensuring correct implementation of all deobfuscation features.

## 📋 Quick Reference

**Backend API Base**: `http://localhost:3001/api/v1`  
**Backend API Documentation**: [../../backend/docs/API_REFERENCE.md](../../backend/docs/API_REFERENCE.md)  
**Frontend Services Directory**: `src/services/`  
**Frontend Hooks Directory**: `src/hooks/`

## 🏗️ Service to API Endpoint Mapping

### DeobfuscationService → Backend API Integration

**Primary Service**: `src/services/deobfuscationService.ts`  
**Related Hook**: `src/hooks/useDeobfuscation.ts`

#### Core Deobfuscation Methods

```typescript
// Primary deobfuscation
async deobfuscateCode(code: string, options: DeobfuscationOptions): Promise<DeobfuscationResult>
→ POST /api/v1/deobfuscate

// Batch processing
async deobfuscateBatch(files: File[], options: DeobfuscationOptions): Promise<BatchResult>
→ POST /api/v1/deobfuscate/batch

// Status checking
async getDeobfuscationStatus(jobId: string): Promise<JobStatus>
→ GET /api/v1/deobfuscate/status/:jobId

// Result retrieval
async getDeobfuscationResult(jobId: string): Promise<DeobfuscationResult>
→ GET /api/v1/deobfuscate/result/:jobId
```

#### Request/Response Type Mapping

```typescript
// DeobfuscationOptions → Backend Request
interface DeobfuscationOptions {
  engine: 'heavy-obfuscation' | 'webpack-minification' | 'generic-formatting'
  enableStringArrayDecoding: boolean
  enableVariableRecovery: boolean
  enableControlFlowDeobfuscation: boolean
  outputFormat: 'formatted' | 'minified' | 'original'
  preserveComments: boolean
  generateReport: boolean
}

// Maps to backend request body:
{
  "code": string,
  "options": DeobfuscationOptions,
  "metadata": {
    "filename": string,
    "sourceType": "javascript" | "typescript",
    "clientId": "electron-app"
  }
}

// DeobfuscationResult ← Backend Response
interface DeobfuscationResult {
  success: boolean
  jobId: string
  originalCode: string
  deobfuscatedCode: string
  statistics: {
    originalLength: number
    deobfuscatedLength: number
    codeReduction: string
    processingTime: string
    hexVariablesRenamed: number
    stringArraysDecoded: number
    meaningfulNamesGenerated: number
  }
  steps: ProcessingStep[]
  metadata: {
    engine: string
    timestamp: string
    version: string
  }
}
```

### FileService → File Management API

**Primary Service**: `src/services/fileService.ts`  
**Related Hook**: `src/hooks/useFileOperations.ts`

#### File Management Methods

```typescript
// File upload
async uploadFile(file: File): Promise<UploadResult>
→ POST /api/v1/files/upload

// File metadata
async getFileInfo(fileId: string): Promise<FileMetadata>
→ GET /api/v1/files/:fileId

// File download
async downloadFile(fileId: string): Promise<Blob>
→ GET /api/v1/files/:fileId/download

// File deletion
async deleteFile(fileId: string): Promise<void>
→ DELETE /api/v1/files/:fileId
```

### AnalysisService → Code Analysis API

**Primary Service**: `src/services/analysisService.ts`  
**Related Hook**: `src/hooks/useCodeAnalysis.ts`

#### Analysis Methods

```typescript
// Code quality analysis
async analyzeCode(code: string): Promise<AnalysisResult>
→ POST /api/v1/analyze

// Security scanning
async securityScan(code: string): Promise<SecurityReport>
→ POST /api/v1/analyze/security

// Complexity analysis
async complexityAnalysis(code: string): Promise<ComplexityReport>
→ POST /api/v1/analyze/complexity

// Get analysis report
async getAnalysisReport(jobId: string): Promise<AnalysisReport>
→ GET /api/v1/analyze/report/:jobId
```

### BundleService → Bundle Processing API

**Primary Service**: `src/services/bundleService.ts`  
**Related Hook**: `src/hooks/useBundleProcessing.ts`

#### Bundle Processing Methods

```typescript
// Split webpack bundles
async splitBundle(bundleCode: string): Promise<BundleSplitResult>
→ POST /api/v1/bundle/split

// Analyze bundle structure
async analyzeBundle(bundleCode: string): Promise<BundleAnalysis>
→ POST /api/v1/bundle/analyze

// Extract React components
async extractComponents(bundleId: string): Promise<ComponentExtractionResult>
→ GET /api/v1/bundle/:bundleId/components
```

### SourceMapService → Source Map Processing

**Primary Service**: `src/services/sourceMapService.ts`  
**Related Hook**: `src/hooks/useSourceMaps.ts`

#### Source Map Methods

```typescript
// Process source maps
async processSourceMap(sourceMapData: string): Promise<SourceMapResult>
→ POST /api/v1/sourcemap/process

// Reconstruct original structure
async reconstructStructure(sourceMapId: string): Promise<ReconstructionResult>
→ POST /api/v1/sourcemap/reconstruct

// Get reconstructed files
async getReconstructedFiles(mapId: string): Promise<ReconstructedFile[]>
→ GET /api/v1/sourcemap/:mapId/files
```

### HealthService → System Monitoring

**Primary Service**: `src/services/healthService.ts`  
**Related Hook**: `src/hooks/useSystemHealth.ts`

#### Health Check Methods

```typescript
// Basic health check
async getHealth(): Promise<HealthStatus>
→ GET /api/v1/health

// Detailed system status
async getDetailedHealth(): Promise<DetailedHealthStatus>
→ GET /api/v1/health/detailed

// Performance metrics
async getMetrics(): Promise<SystemMetrics>
→ GET /api/v1/metrics
```

## 🎣 Hook Implementation Patterns

### useDeobfuscation Hook

**File**: `src/hooks/useDeobfuscation.ts`

```typescript
export const useDeobfuscation = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<DeobfuscationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  const deobfuscateService = useMemo(() => new DeobfuscationService(), [])

  const deobfuscate = useCallback(async (
    code: string, 
    options: DeobfuscationOptions
  ): Promise<void> => {
    try {
      setIsProcessing(true)
      setError(null)
      setProgress(0)

      // Call backend API through service
      const result = await deobfuscateService.deobfuscateCode(code, options)
      
      if (result.success) {
        setResult(result)
        setProgress(100)
      } else {
        throw new Error(result.error || 'Deobfuscation failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsProcessing(false)
    }
  }, [deobfuscateService])

  // Polling for long-running jobs
  const pollJobStatus = useCallback(async (jobId: string): Promise<void> => {
    const checkStatus = async () => {
      const status = await deobfuscateService.getDeobfuscationStatus(jobId)
      setProgress(status.progress)
      
      if (status.completed) {
        const result = await deobfuscateService.getDeobfuscationResult(jobId)
        setResult(result)
        setIsProcessing(false)
      } else if (!status.failed) {
        setTimeout(checkStatus, 1000) // Poll every second
      } else {
        throw new Error(status.error || 'Processing failed')
      }
    }
    
    await checkStatus()
  }, [deobfuscateService])

  return {
    isProcessing,
    result,
    error,
    progress,
    deobfuscate,
    pollJobStatus,
    clearResult: () => setResult(null),
    clearError: () => setError(null)
  }
}
```

### useFileOperations Hook

**File**: `src/hooks/useFileOperations.ts`

```typescript
export const useFileOperations = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const fileService = useMemo(() => new FileService(), [])

  const uploadFile = useCallback(async (file: File): Promise<UploadResult> => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress (real implementation would use XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const result = await fileService.uploadFile(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setUploadedFiles(prev => [...prev, {
        id: result.fileId,
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
        status: 'uploaded'
      }])

      return result
    } catch (error) {
      throw error
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [fileService])

  const downloadFile = useCallback(async (fileId: string, filename: string): Promise<void> => {
    const blob = await fileService.downloadFile(fileId)
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [fileService])

  return {
    isUploading,
    uploadProgress,
    uploadedFiles,
    uploadFile,
    downloadFile,
    deleteFile: fileService.deleteFile.bind(fileService)
  }
}
```

## 🔧 Service Implementation Patterns

### DeobfuscationService Implementation

**File**: `src/services/deobfuscationService.ts`

```typescript
export class DeobfuscationService {
  private baseUrl = 'http://localhost:3001/api/v1'

  async deobfuscateCode(
    code: string, 
    options: DeobfuscationOptions
  ): Promise<DeobfuscationResult> {
    const response = await fetch(`${this.baseUrl}/deobfuscate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        options,
        metadata: {
          filename: 'inline-code.js',
          sourceType: 'javascript',
          clientId: 'detox-tool-frontend'
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Deobfuscation request failed')
    }

    return response.json()
  }

  async deobfuscateBatch(
    files: File[], 
    options: DeobfuscationOptions
  ): Promise<BatchResult> {
    const formData = new FormData()
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    
    formData.append('options', JSON.stringify(options))
    formData.append('metadata', JSON.stringify({
      clientId: 'detox-tool-frontend',
      batchSize: files.length
    }))

    const response = await fetch(`${this.baseUrl}/deobfuscate/batch`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Batch deobfuscation failed')
    }

    return response.json()
  }

  async getDeobfuscationStatus(jobId: string): Promise<JobStatus> {
    const response = await fetch(`${this.baseUrl}/deobfuscate/status/${jobId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get job status')
    }

    return response.json()
  }

  async getDeobfuscationResult(jobId: string): Promise<DeobfuscationResult> {
    const response = await fetch(`${this.baseUrl}/deobfuscate/result/${jobId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get deobfuscation result')
    }

    return response.json()
  }
}
```

## 🛡️ Error Handling Patterns

### Service Error Handling

```typescript
// Standard error handling pattern for all services
export class BaseApiService {
  protected async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        // Parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Fallback to status text if JSON parsing fails
        }

        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      // Log error for debugging
      console.error('API request failed:', error)
      
      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error('An unexpected error occurred')
      }
    }
  }
}
```

### Hook Error Handling

```typescript
// Standard error state management in hooks
export const useApiOperation = <T, Args extends any[]>(
  operation: (...args: Args) => Promise<T>
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: Args): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await operation(...args)
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      
      // Optional: Show toast notification
      // toastService.error('Operation failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [operation])

  return {
    isLoading,
    data,
    error,
    execute,
    clearError: () => setError(null),
    clearData: () => setData(null)
  }
}
```

## 🧪 Testing API Integration

### Service Unit Tests

```typescript
// Example test for DeobfuscationService
describe('DeobfuscationService', () => {
  let service: DeobfuscationService
  
  beforeEach(() => {
    service = new DeobfuscationService()
    
    // Mock fetch globally
    global.fetch = jest.fn()
  })

  it('should deobfuscate code successfully', async () => {
    const mockResponse = {
      success: true,
      jobId: 'test-job-123',
      result: {
        originalCode: 'var _0x123=["hello"];',
        deobfuscatedCode: 'var messages = ["hello"];',
        statistics: {
          originalLength: 20,
          deobfuscatedLength: 24,
          processingTime: '50ms'
        }
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await service.deobfuscateCode('var _0x123=["hello"];', {
      engine: 'heavy-obfuscation',
      enableStringArrayDecoding: true,
      enableVariableRecovery: true,
      enableControlFlowDeobfuscation: false,
      outputFormat: 'formatted',
      preserveComments: true,
      generateReport: true
    })

    expect(result).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/deobfuscate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('var _0x123=["hello"];')
      })
    )
  })

  it('should handle API errors gracefully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid code provided' })
    })

    await expect(
      service.deobfuscateCode('invalid code', {} as DeobfuscationOptions)
    ).rejects.toThrow('Invalid code provided')
  })
})
```

## 📋 Implementation Checklist

### Phase 5: Deobfuscation Core Implementation

**Required Service/Hook Mappings:**
- [ ] `DeobfuscationService` → `/deobfuscate` endpoints
- [ ] `FileService` → `/files` endpoints  
- [ ] `AnalysisService` → `/analyze` endpoints
- [ ] `useDeobfuscation` hook with progress tracking
- [ ] `useFileOperations` hook with upload/download
- [ ] `useCodeAnalysis` hook with security scanning

**API Integration Requirements:**
- [ ] Correct request/response type mapping
- [ ] Proper error handling with user feedback
- [ ] Progress tracking for long-running operations
- [ ] File upload with progress indicators
- [ ] Real-time status polling for batch operations
- [ ] Comprehensive error boundaries

**Testing Requirements:**
- [ ] Unit tests for all service methods
- [ ] Integration tests with mock backend
- [ ] Error handling test scenarios
- [ ] Hook behavior testing with React Testing Library

This guide ensures all frontend services and hooks correctly integrate with the backend API, maintaining type safety and proper error handling throughout the deobfuscation workflow.