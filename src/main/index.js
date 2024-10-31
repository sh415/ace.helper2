import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon2.png?asset'

const { autoUpdater } = require("electron-updater");
const { execFile } = require("child_process");
const fs = require('fs');
const path = require("path");
const axios = require('axios');

const jsonFilePath = path.join(__dirname, '../../resources', 'settings.json'); // JSON 파일 경로
let mainWindow = null;
let fastApiProcess;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    icon: icon, // ...(process.platform === 'linux' ? { icon } : { }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  
  ipcMain.handle('getAppVersion', () => {
    return app.getVersion();
  });

  ipcMain.on('checkUpdate', async (event, params) => {
    try {
      autoUpdater.checkForUpdates(); // 업데이트 확인 시작, 개발 모드에서는 확인할 수 없음.
      
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.handle('checkSettings', async (event, params) => {
    try {
      const data = fs.readFileSync(jsonFilePath, 'utf-8');
      const jsonData = JSON.parse(data);
      return jsonData;
      
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.on('updateSettings', async (event, params) => {
    const { key, value } = params;

    try {
      // 1. 현재 설정 로드
      const settings = await loadSettings();

      // 2. 설정 업데이트
      settings[key] = value;

      // 3. 업데이트된 설정 저장
      await saveSettings(settings);

      mainWindow.webContents.send("updateResult", key);
      
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.on('updateSettingsFolder', async (event, params) => {
    const { key, value } = params;

    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'], // 디렉토리 선택
      });

      if (!result.canceled) {
        const folderPath = result.filePaths[0];

        // 1. 현재 설정 로드
        const settings = await loadSettings();

        // 2. 설정 업데이트
        settings[key] = folderPath;

        // 3. 업데이트된 설정 저장
        await saveSettings(settings);

        const res = {
          key: key,
          path: folderPath,
        }
        event.sender.send('updateResultFolder', res);
        mainWindow.webContents.send("updateResult", key);
      } 

    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.handle('checkApiKey', async (event, params) => {
    try {
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${params}`,
        },
      });
      return response.data;
      
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.handle('checkConnection', async (event, params) => {
    try {
      const response = await axios.get('http://127.0.0.1:5816');
      return response.data.result;
      
    } catch (error) {
      console.log(error);
      return false;
    }
  });

  ipcMain.handle('triggerServer', async (event, params) => {
    try {
      const programPath = path.join(__dirname, "../../resources", "app.exe");
      execFile(programPath, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing file: ${error}`);
          return {
            result: false,
            message: error,
          };
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });

      fastApiProcess = true;
      return {
        result: true,
        message: 'success',
      };

    } catch (error) {
      console.log(error);
      return {
        result: true,
        message: error,
      }
    }
  });

  ipcMain.handle('triggerMessage', async (event, params) => {
    try {
      const response = await axios.post('http://127.0.0.1:5816/message', {});
      return response.data;
      
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle('triggerStart', async (event, params) => {
    try {
      const response = await axios.post('http://127.0.0.1:5816/start', {});
      return response.data;
      
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle('troubleShooting', async (event, params) => {
    try {
      await axios.post('http://127.0.0.1:5816/shutdown', {});
      
    } catch (error) {
      console.log(error);
    }
  });


  const loadSettings = async () => { // 기존 설정을 로드하는 함수
    try {
      const data = fs.readFileSync(jsonFilePath, 'utf-8');
      return JSON.parse(data);

    } catch (error) {
      console.error('Error loading settings:', error);
      return {}; 
    }
  };

  const saveSettings = async (settings) => { // 설정을 저장하는 함수,빌드 환경에서 app.asar에 쓰기 권한 없음.
    try {
      if (jsonFilePath.includes('app.asar')) {
        const asarPath = jsonFilePath.replace('app.asar', 'app.asar.unpacked');
        fs.writeFileSync(asarPath, JSON.stringify(settings, null, 2), 'utf-8');
      } else {
        fs.writeFileSync(jsonFilePath, JSON.stringify(settings, null, 2), 'utf-8');
      }


    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  createWindow()


  /** 업데이트 관련 */
  autoUpdater.on("checking-for-update", () => {
    const res = {
      result: 0,
      message: "업데이트 확인 중.",
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("update-available", () => { // 업데이트 할 신규 버전이 있을 시 호출 됨
    const res = {
      result: 1,
      message: "신규 버전 확인 및 업데이트 가능.",
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("update-not-available", () => { // 업데이트 할 신규 버전이 없을 시 호출 됨
    const res = {
      result: 2,
      message: "최신 버전입니다.",
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("error", (err) => { // 업데이트 에러 발생시 호출
    console.log(err);
    const res = {
      result: 3,
      message: "업데이트 오류",
      err: err,
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("download-progress", (progress) => {
    const res = {
      result: 4,
      message: `다운로드 중... ${progress.percent.toFixed(1)}%`,
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("update-downloaded", (info) => { // 업데이트 설치 파일 다운로드 완료 시 업데이트 진행 여부 선택
    const res = {
      result: 5,
      message: "신규 버전 다운로드 완료."
    }
    mainWindow.webContents.send("updateChecking", res);
    autoUpdater.quitAndInstall();
  });


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (fastApiProcess) {
    shutdown();
  }

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const shutdown = async () => {
  try {
    await axios.post('http://127.0.0.1:5816/shutdown', {});
    
  } catch (error) {
    console.log(error);
  }
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
