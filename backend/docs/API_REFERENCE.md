# Detox-Tool Backend API Reference

Complete API documentation for all backend services, routes, and data formats.

## Base Configuration

- **Base URL**: `http://localhost:3001/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: API Key (when implemented)
- **Rate Limiting**: 100 requests/minute per client

## API Routes Overview

### Health & System
- `GET /health` - System health check
- `GET /health/detailed` - Detailed system status
- `GET /metrics` - Performance metrics

### Deobfuscation
- `POST /deobfuscate` - Primary deobfuscation endpoint
- `POST /deobfuscate/batch` - Batch file processing
- `GET /deobfuscate/status/:jobId` - Check processing status
- `GET /deobfuscate/result/:jobId` - Retrieve processing results

### Analysis
- `POST /analyze` - Code analysis and quality metrics
- `POST /analyze/security` - Security vulnerability scanning
- `POST /analyze/complexity` - Code complexity analysis
- `GET /analyze/report/:jobId` - Retrieve analysis report

### File Management
- `POST /files/upload` - Upload files for processing
- `GET /files/:fileId` - Retrieve file metadata
- `DELETE /files/:fileId` - Delete uploaded file
- `GET /files/:fileId/download` - Download processed file

### Bundle Processing
- `POST /bundle/split` - Split webpack bundles
- `POST /bundle/analyze` - Analyze bundle structure
- `GET /bundle/:bundleId/components` - Extract React components

### Source Maps
- `POST /sourcemap/process` - Process source map files
- `POST /sourcemap/reconstruct` - Reconstruct original structure
- `GET /sourcemap/:mapId/files` - Get reconstructed files

---

## Detailed API Endpoints

### Health Endpoints

#### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-06-30T13:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### GET /health/detailed
Comprehensive system status including component health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-06-30T13:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "components": {
    "database": "healthy",
    "cache": "healthy",
    "processors": "healthy",
    "fileSystem": "healthy"
  },
  "metrics": {
    "memoryUsage": "256MB",
    "cpuUsage": "15%",
    "activeJobs": 3,
    "completedJobs": 157
  }
}
```

---

### Deobfuscation Endpoints

#### POST /deobfuscate
Primary endpoint for code deobfuscation.

**Request Body:**
```json
{
  "code": "var _0x123=['hello','world']; function _0x456(){return _0x123[0];}", 
  "options": {
    "engine": "heavy-obfuscation",
    "enableStringArrayDecoding": true,
    "enableVariableRecovery": true,
    "enableControlFlowDeobfuscation": false,
    "outputFormat": "formatted",
    "preserveComments": true,
    "generateReport": true
  },
  "metadata": {
    "filename": "obfuscated.js",
    "sourceType": "javascript",
    "clientId": "electron-app"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "jobId": "job_abc123def456",
  "result": {
    "originalCode": "var _0x123=['hello','world']; function _0x456(){return _0x123[0];}",
    "deobfuscatedCode": "var messages = ['hello', 'world'];\nfunction getMessage() {\n  return messages[0];\n}",
    "statistics": {
      "originalLength": 67,
      "deobfuscatedLength": 89,
      "codeReduction": "0%",
      "processingTime": "245ms",
      "hexVariablesRenamed": 2,
      "stringArraysDecoded": 1,
      "meaningfulNamesGenerated": 2
    },
    "steps": [
      {
        "name": "String Array Detection",
        "description": "Found 1 string arrays",
        "count": 1,
        "pattern": "obfuscated string arrays"
      },
      {
        "name": "Variable Name Recovery", 
        "description": "Renamed 2 variables with meaningful names",
        "count": 2,
        "pattern": "hex -> semantic naming"
      }
    ],
    "analysis": {
      "obfuscationLevel": "medium",
      "detectedPatterns": ["string-arrays", "hex-variables"],
      "securityIssues": [],
      "qualityScore": 85
    }
  },
  "metadata": {
    "filename": "obfuscated.js",
    "processedAt": "2024-06-30T13:00:00.000Z",
    "engine": "heavy-obfuscation",
    "version": "2.0.0"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "code": "PARSING_ERROR",
    "message": "Unable to parse JavaScript code",
    "details": "Unexpected token at line 5, column 12",
    "timestamp": "2024-06-30T13:00:00.000Z"
  },
  "originalCode": "invalid javascript code",
  "suggestions": [
    "Check syntax for JavaScript validity",
    "Ensure code is not corrupted",
    "Try preprocessing with alternative parser"
  ]
}
```

#### POST /deobfuscate/batch
Process multiple files in batch.

**Request Body:**
```json
{
  "files": [
    {
      "id": "file1",
      "code": "obfuscated code here...",
      "filename": "app.min.js"
    },
    {
      "id": "file2", 
      "code": "more obfuscated code...",
      "filename": "vendor.min.js"
    }
  ],
  "options": {
    "engine": "heavy-obfuscation",
    "enableStringArrayDecoding": true,
    "enableVariableRecovery": true,
    "outputFormat": "formatted",
    "generateReport": true
  },
  "batchSettings": {
    "parallel": true,
    "maxConcurrency": 3,
    "priority": "normal"
  }
}
```

**Response:**
```json
{
  "success": true,
  "batchId": "batch_xyz789abc123",
  "status": "processing",
  "totalFiles": 2,
  "estimatedTime": "30-60 seconds",
  "statusUrl": "/api/v1/deobfuscate/status/batch_xyz789abc123"
}
```

#### GET /deobfuscate/status/:jobId
Check processing status for job or batch.

**Response (Processing):**
```json
{
  "jobId": "job_abc123def456",
  "status": "processing",
  "progress": {
    "percentage": 65,
    "currentStep": "Variable Name Recovery",
    "estimatedTimeRemaining": "15 seconds"
  },
  "startedAt": "2024-06-30T12:59:45.000Z"
}
```

**Response (Completed):**
```json
{
  "jobId": "job_abc123def456", 
  "status": "completed",
  "progress": {
    "percentage": 100,
    "currentStep": "Complete",
    "processingTime": "245ms"
  },
  "startedAt": "2024-06-30T12:59:45.000Z",
  "completedAt": "2024-06-30T13:00:00.000Z",
  "resultUrl": "/api/v1/deobfuscate/result/job_abc123def456"
}
```

---

### Analysis Endpoints

#### POST /analyze
Comprehensive code analysis including quality metrics, complexity, and patterns.

**Request Body:**
```json
{
  "code": "function complexFunction() { /* code */ }",
  "options": {
    "includeComplexity": true,
    "includeSecurity": true,
    "includeQuality": true,
    "includePatterns": true,
    "detailedReport": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "complexity": {
      "cyclomaticComplexity": 5,
      "cognitiveComplexity": 3,
      "maintainabilityIndex": 72,
      "linesOfCode": 156,
      "functions": 8,
      "classes": 2
    },
    "quality": {
      "score": 85,
      "issues": [
        {
          "type": "warning",
          "message": "Function exceeds recommended length",
          "line": 45,
          "severity": "medium"
        }
      ],
      "suggestions": [
        "Consider breaking down large functions",
        "Add JSDoc documentation"
      ]
    },
    "security": {
      "vulnerabilities": [],
      "riskScore": "low",
      "recommendations": [
        "Input validation looks good",
        "No obvious security issues detected"
      ]
    },
    "patterns": {
      "detectedPatterns": ["module-pattern", "observer-pattern"],
      "antiPatterns": [],
      "recommendations": [
        "Good use of design patterns",
        "Clean code structure"
      ]
    }
  }
}
```

---

### File Management Endpoints

#### POST /files/upload
Upload files for processing.

**Request (Multipart Form):**
```
Content-Type: multipart/form-data

file: [binary file data]
options: {
  "preserveFilename": true,
  "enablePreprocessing": false,
  "maxSize": "10MB"
}
```

**Response:**
```json
{
  "success": true,
  "fileId": "file_abc123def456",
  "metadata": {
    "filename": "obfuscated-app.js",
    "size": 245760,
    "mimeType": "application/javascript",
    "checksum": "sha256:abc123...",
    "uploadedAt": "2024-06-30T13:00:00.000Z"
  },
  "processingUrl": "/api/v1/deobfuscate"
}
```

#### GET /files/:fileId
Retrieve file metadata and status.

**Response:**
```json
{
  "fileId": "file_abc123def456",
  "metadata": {
    "filename": "obfuscated-app.js",
    "size": 245760,
    "mimeType": "application/javascript",
    "checksum": "sha256:abc123...",
    "uploadedAt": "2024-06-30T13:00:00.000Z"
  },
  "status": "ready",
  "processingHistory": [
    {
      "jobId": "job_xyz789",
      "status": "completed",
      "processedAt": "2024-06-30T13:05:00.000Z"
    }
  ]
}
```

---

## Error Codes and Messages

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional technical details",
    "timestamp": "2024-06-30T13:00:00.000Z",
    "requestId": "req_abc123"
  },
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2"
  ]
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body or parameters |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `PARSING_ERROR` | 422 | Unable to parse provided code |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds size limit |
| `UNSUPPORTED_FORMAT` | 415 | File format not supported |
| `PROCESSING_FAILED` | 500 | Internal processing error |
| `ENGINE_ERROR` | 500 | Deobfuscation engine error |
| `TIMEOUT_ERROR` | 408 | Processing timeout exceeded |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

### Error Response Examples

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": "Field 'code' is required but was not provided",
    "timestamp": "2024-06-30T13:00:00.000Z"
  },
  "suggestions": [
    "Ensure 'code' field is included in request body",
    "Check API documentation for required fields"
  ]
}
```

**Processing Error:**
```json
{
  "success": false,
  "error": {
    "code": "PROCESSING_FAILED",
    "message": "Deobfuscation processing failed",
    "details": "Memory limit exceeded during AST transformation",
    "timestamp": "2024-06-30T13:00:00.000Z"
  },
  "suggestions": [
    "Try reducing code size",
    "Contact support if issue persists"
  ]
}
```

## Request/Response Headers

### Standard Request Headers
```
Content-Type: application/json
Accept: application/json
User-Agent: DetoxTool/1.0.0
X-Request-ID: unique-request-identifier
```

### Standard Response Headers
```
Content-Type: application/json
X-Response-Time: 245ms
X-Request-ID: unique-request-identifier
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1640995200
```

## WebSocket Events (Real-time Updates)

For long-running operations, WebSocket connection provides real-time updates:

### Connection
```
ws://localhost:3001/ws
```

### Events

**Job Progress:**
```json
{
  "event": "job:progress",
  "data": {
    "jobId": "job_abc123",
    "progress": 45,
    "currentStep": "Control Flow Analysis",
    "estimatedTimeRemaining": "30 seconds"
  }
}
```

**Job Completed:**
```json
{
  "event": "job:completed", 
  "data": {
    "jobId": "job_abc123",
    "status": "success",
    "resultUrl": "/api/v1/deobfuscate/result/job_abc123"
  }
}
```

**Job Error:**
```json
{
  "event": "job:error",
  "data": {
    "jobId": "job_abc123",
    "error": {
      "code": "PROCESSING_FAILED",
      "message": "Processing failed due to memory constraints"
    }
  }
}
```

## Rate Limiting

- **Default**: 100 requests per minute per client
- **Burst**: Up to 10 requests in 1 second
- **Headers**: `X-Rate-Limit-*` headers in responses
- **Upgrade**: Contact support for higher limits

## Authentication (Future)

When authentication is implemented:

```json
{
  "headers": {
    "Authorization": "Bearer your-api-key-here"
  }
}
```

## SDK Integration

For integration with frontend applications, see the JavaScript SDK:

```javascript
import { DetoxToolAPI } from '@detox-tool/api-client';

const api = new DetoxToolAPI({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 30000
});

const result = await api.deobfuscate({
  code: obfuscatedCode,
  options: { engine: 'heavy-obfuscation' }
});
```

For complete implementation details, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) and [ARCHITECTURE.md](ARCHITECTURE.md).