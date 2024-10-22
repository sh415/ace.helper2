import { app, shell, BrowserWindow, ipcMain } from 'electron'
const { autoUpdater } = require("electron-updater");
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon2.png?asset'

let mainWindow = null;

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
      sandbox: false
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
app.whenReady().then(() => {
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

  ipcMain.on('checkUpdate', async (event, arg) => {
    try {
      console.log('checkUpdate');
      autoUpdater.checkForUpdates(); // 업데이트 확인 시작, 개발 모드에서는 확인할 수 없음.
      
    } catch (error) {
      console.log(error);
    }
  });

  createWindow()

  /** 업데이트 관련 */
  autoUpdater.on("checking-for-update", () => {
    const res = {
      result: true,
      message: "업데이트 확인 중.",
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("update-available", () => { // 업데이트 할 신규 버전이 있을 시 호출 됨
    const res = {
      result: true,
      message: "신규 버전 확인 및 업데이트 가능.",
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("update-not-available", () => { // 업데이트 할 신규 버전이 없을 시 호출 됨
    const res = {
      result: false,
      message: "최신 버전입니다.",
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("error", (err) => { // 업데이트 에러 발생시 호출
    console.log(err);
    const res = {
      result: false,
      message: "업데이트 오류",
      err: err,
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("download-progress", (progress) => {
    const res = {
      result: true,
      message: `다운로드 중... ${progress.percent.toFixed(1)}%`,
    }
    mainWindow.webContents.send("updateChecking", res);
  });

  autoUpdater.on("update-downloaded", (info) => { // 업데이트 설치 파일 다운로드 완료 시 업데이트 진행 여부 선택
    const res = {
      result: true,
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
