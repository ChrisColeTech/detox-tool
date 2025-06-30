/**
 * Electron Preload Script
 * Exposes secure API to renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Deobfuscation operations
    deobfuscateCode: (code, options) => 
        ipcRenderer.invoke('deobfuscate-code', code, options),
    
    splitBundle: (code, options) => 
        ipcRenderer.invoke('split-bundle', code, options),
    
    reconstructFolderStructure: (code, outputPath, options) => 
        ipcRenderer.invoke('reconstruct-folder-structure', code, outputPath, options),
    
    processSourceMaps: (directoryPath) => 
        ipcRenderer.invoke('process-source-maps', directoryPath),
    
    reconstructFromSourceMap: (jsFilePath, mapFilePath) => 
        ipcRenderer.invoke('reconstruct-from-source-map', jsFilePath, mapFilePath),
    
    batchProcessFolder: (folderPath, options) => 
        ipcRenderer.invoke('batch-process-folder', folderPath, options),
    
    loadFile: (filePath) => 
        ipcRenderer.invoke('load-file', filePath),
    
    getEngineInfo: () => 
        ipcRenderer.invoke('get-engine-info'),

    // File system operations
    showOpenDialog: (options) => 
        ipcRenderer.invoke('show-open-dialog', options),
    
    showOpenFolderDialog: (options) => 
        ipcRenderer.invoke('show-open-folder-dialog', options),
    
    showSaveDialog: (options) => 
        ipcRenderer.invoke('show-save-dialog', options),
    
    saveFile: (filePath, content) => 
        ipcRenderer.invoke('save-file', filePath, content),
    
    readFile: (filePath) => 
        ipcRenderer.invoke('read-file', filePath),
    
    showItemInFolder: (filePath) => 
        ipcRenderer.invoke('show-item-in-folder', filePath),

    // Utility functions
    platform: process.platform,
    versions: process.versions
});

// Expose development helpers in dev mode
if (process.env.NODE_ENV === 'development') {
    contextBridge.exposeInMainWorld('devAPI', {
        openDevTools: () => ipcRenderer.send('open-dev-tools'),
        reload: () => ipcRenderer.send('reload-app')
    });
}