/**
 * Electron Main Process
 * Handles window management and IPC communication with renderer
 */

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const DeobfuscationAPI = require('../backend/api/DeobfuscationAPI');

// Initialize backend API
const deobfuscationAPI = new DeobfuscationAPI();

let mainWindow;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false,
        titleBarStyle: 'default'
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC Handlers for deobfuscation
ipcMain.handle('deobfuscate-code', async (event, code, options) => {
    try {
        return await deobfuscationAPI.deobfuscateCode(code, options);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('split-bundle', async (event, code, options) => {
    try {
        return await deobfuscationAPI.splitBundle(code, options);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('reconstruct-folder-structure', async (event, code, outputPath, options) => {
    try {
        return await deobfuscationAPI.reconstructFolderStructure(code, outputPath, options);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('process-source-maps', async (event, directoryPath) => {
    try {
        return await deobfuscationAPI.processSourceMaps(directoryPath);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('reconstruct-from-source-map', async (event, jsFilePath, mapFilePath) => {
    try {
        return await deobfuscationAPI.reconstructFromSourceMap(jsFilePath, mapFilePath);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('batch-process-folder', async (event, folderPath, options) => {
    try {
        return await deobfuscationAPI.batchProcessFolder(folderPath, options);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('load-file', async (event, filePath) => {
    try {
        return await deobfuscationAPI.loadFile(filePath);
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

ipcMain.handle('get-engine-info', async (event) => {
    try {
        return {
            success: true,
            result: deobfuscationAPI.getEngineInfo()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});

// File system handlers
ipcMain.handle('show-open-dialog', async (event, options) => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [
                { name: 'JavaScript Files', extensions: ['js', 'jsx', 'ts', 'tsx'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            ...options
        });
        
        return {
            success: true,
            result: result
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('show-open-folder-dialog', async (event, options) => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            ...options
        });
        
        return {
            success: true,
            result: result
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('show-save-dialog', async (event, options) => {
    try {
        const result = await dialog.showSaveDialog(mainWindow, {
            filters: [
                { name: 'JavaScript Files', extensions: ['js'] },
                { name: 'TypeScript Files', extensions: ['ts'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            ...options
        });
        
        return {
            success: true,
            result: result
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('save-file', async (event, filePath, content) => {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        return {
            success: true,
            result: { filePath, size: content.length }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const stats = await fs.stat(filePath);
        
        return {
            success: true,
            result: {
                content,
                filePath,
                size: stats.size,
                modified: stats.mtime
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('show-item-in-folder', async (event, filePath) => {
    try {
        shell.showItemInFolder(filePath);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});