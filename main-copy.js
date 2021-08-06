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
    mainwin.webContents.openDevTools();
    mainwin.loadFile('index.html')

	// //创建对象
  //   const view = new BrowserView()
  //   //设置到主窗口
  //   win.setBrowserView(view)
  //   //设置在主窗口的位置和view的大小
  //   view.setBounds({ x: 0, y: 0, width: 800, height: 200 })
  //   view.webContents.loadFile('view1.html')
  //   view.webContents.openDevTools();

  //   const view2 = new BrowserView()
  //   //设置到主窗口
  //   win.setBrowserView(view2)
  //   //设置在主窗口的位置和view的大小
  //   view2.setBounds({ x: 0, y: 200, width: 800, height: 500 })
  //   view2.webContents.loadFile('view2.html')
  //   view2.webContents.openDevTools();
  const child1 = new BrowserWindow({
    width: 1440, 
    height: 100,
    frame: false,
    parent: mainwin,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enablePreferredSizeMode: true,
      webviewTag: true,
      nodeIntegrationInWorker: true,
    }
  })
  child1.webContents.openDevTools();
  child1.loadFile('view1.html')
  child1.setPosition(0, 50);
  child1.isAlwaysOnTop()

  const child2 = new BrowserWindow({
    width: 1440,
    height: 600,
    top: 400,
    left: 0,
    frame: false,
    parent: mainwin,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      webviewTag: true,
      nodeIntegrationInWorker: true,
    }
  })
  child2.webContents.openDevTools();
  child2.loadFile('view2.html');
  child2.setPosition(0, 150);
  child2.hide();
    setTimeout(() => {
      child2.show();
    }, 5000)
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
