//为了管理应用程序的生命周期事件以及创建和控制浏览器窗口，您从 electron 包导入了 app 和 BrowserWindow 模块 。
const { app, BrowserWindow,BrowserView } = require('electron')
const path = require('path')
//在此之后，你定义了一个创建 新的浏览窗口的函数并将 nodeIntegration 设置为 true，将 index.html 文件加载到窗口中（第 12 行，稍后我们将讨论该文件）
function createWindow () {
  try {
    const mainwin = new BrowserWindow({
        width: 1440,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    // mainwin.webContents.openDevTools();
    mainwin.loadFile('index.html')

    const child1 = new BrowserView({
      width: 1440, 
      height: 800,
      frame: false,
      titleBarStyle: 'hiddenInset',
      resizeable: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        // webviewTag: true,
        nodeIntegrationInWorker: true,
      }
    })
      
    mainwin.addBrowserView(child1)
    child1.view_id = 1
    child1.setBounds({
      x: 0,
      y: 40,
      width: 1440, 
      height: 100,
    });

    child1.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });
    child1.webContents.loadFile(path.resolve(__dirname, './view1.html'))



    const child2 = new BrowserView({
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
      }
    });
    child2.webContents.openDevTools();
    mainwin.addBrowserView(child2)
    child2.setBounds({
        x: 0,
        y: 40,
        width: 1440, 
        height: 100,
    });
    child2.webContents.loadFile(path.resolve(__dirname, 'view2.html'));


    // const child3 = new BrowserView({
    //   width: 500,
    //   height: 500,
    //   top: 400,
    //   left: 0,
    //   frame: false,
    //   show: false,
    //   resizeable: false,
    //   transparent: false,
    //   webPreferences: {
    //     webSecurity: false,
    //     nodeIntegration: true,
    //     webviewTag: true,
    //     nodeIntegrationInWorker: true,
    //   }
    // });

    // mainwin.addBrowserView(child3)

    // child3.view_id = 3
    // child3.setBounds({
    //   x: 0,
    //   y: 40,
    //   width: 1440, 
    //   height: 100,
    // });

    // child3.setAutoResize({
    //   width: true,
    //   height: true,
    //   horizontal: true,
    //   vertical: true,
    // });
    // child3.webContents.loadFile(path.resolve(__dirname, 'view3.html'));
    // mainwin.setTopBrowserView(child3);
  } catch (error) {
    console.log('error', error)
  }
}

//你通过调用 createWindow方法，在 electron app 第一次被初始化时创建了一个新的窗口。
app.whenReady().then(createWindow)

//您添加了一个新的侦听器，当应用程序不再有任何打开窗口时试图退出。 由于操作系统的 窗口管理行为 ，此监听器在 macOS 上是禁止操作的
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//您添加一个新的侦听器，只有当应用程序激活后没有可见窗口时，才能创建新的浏览器窗口。 例如，在首次启动应用程序后或重启运行中的应用程序
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
