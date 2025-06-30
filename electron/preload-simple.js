/**
 * Simplified Electron Preload Script
 * Quick startup for testing the shell
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Deobfuscation operations
    deobfuscateCode: (code, options) => 
        ipcRenderer.invoke('deobfuscate-code', code, options),

    // File system operations
    showOpenDialog: (options) => 
        ipcRenderer.invoke('show-open-dialog', options),
    
    showOpenFolderDialog: (options) => 
        ipcRenderer.invoke('show-open-folder-dialog', options),
    
    readFile: (filePath) => 
        ipcRenderer.invoke('read-file', filePath),
    
    saveFile: (filePath, content) => 
        ipcRenderer.invoke('save-file', filePath, content),

    // Utility functions
    platform: process.platform,
    versions: process.versions
});

console.log('🔌 Detox Tool preload script loaded');