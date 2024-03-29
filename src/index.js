const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
let mainWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () =>
{
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    useContentSize: true,
    autoHideMenuBar: true,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('menu:send', (event, args) =>
{
  let list = [];
  for (let i = 0; i < args.length; i++)
  {
    list.push(
      {
        label: args[i],
        click: function()
        {
          setCamera(args[i])
        }
      });
  }
  console.log(list);
  const menuTemplate = [
    {
        label: "Source",
        submenu: list
    }
  ];
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

let setCamera = (src) =>
{
  mainWindow.webContents.send('menu:select', src);
};