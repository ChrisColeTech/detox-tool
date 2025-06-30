/**
 * Simplified Electron Main Process
 * Quick startup for testing the shell
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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
            preload: path.join(__dirname, 'preload-simple.js')
        },
        show: false,
        titleBarStyle: 'default',
        icon: path.join(__dirname, '../assets/icon.png')
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.log('🚀 Detox Tool started successfully!');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App event handlers
app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Simple IPC handlers for testing
ipcMain.handle('deobfuscate-code', async (event, code, options) => {
    // Mock deobfuscation for testing
    return {
        success: true,
        result: `// Deobfuscated code\n${code}\n// End deobfuscated`,
        metadata: {
            originalSize: code.length,
            processedSize: code.length + 50,
            detectedPatterns: ['test-pattern'],
            processingTime: 100
        }
    };
});

ipcMain.handle('show-open-dialog', async (event, options) => {
    const { dialog } = require('electron');
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

ipcMain.handle('read-file', async (event, filePath) => {
    const fs = require('fs').promises;
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

ipcMain.handle('save-file', async (event, filePath, content) => {
    const fs = require('fs').promises;
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

console.log('🔧 Detox Tool Electron starting...');