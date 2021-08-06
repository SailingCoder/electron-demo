//为了管理应用程序的生命周期事件以及创建和控制浏览器窗口，您从 electron 包导入了 app 和 BrowserWindow 模块 。
const { app, BrowserWindow, BrowserView, screen, systemPreferences, nativeTheme } = require('electron')
const { on } = require('events')
const path = require('path')
//在此之后，你定义了一个创建 新的浏览窗口的函数并将 nodeIntegration 设置为 true，将 index.html 文件加载到窗口中（第 12 行，稍后我们将讨论该文件）
function createWindow () {
  try {
    const mainwin = new BrowserWindow({
        width: 800,
        height: 600,
        // x: 0,
        // y: 0, 
        // center: true,
        movable: true,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true,
          webviewTag: true,
          nodeIntegrationInWorker: true,
        }
    })
    // mainwin.webContents.openDevTools();
    mainwin.loadFile(path.resolve(__dirname, './view1.html'));
    
    mainwin.on('will-move', () => {
      mainwin_child.setParentWindow(null);
      mainwin_child.setPosition(1000, 10);
      // mainwin_child.setPosition(1000, 10);
    })
    mainwin.on('move', () => {
      // mainwin_child.setParentWindow(mainwin);
      // mainwin_child.setPosition(1000, 10);
      mainwin_child.setParentWindow(null);
      mainwin_child.setPosition(1000, 10);
    })
    mainwin.on('moved', debounce(() => {
      // mainwin_child.setPosition(1000, 10);
      mainwin_child.setParentWindow(mainwin);
      mainwin_child.setPosition(1000, 10);
    }, 300))
    mainwin.on('show', () => {
      console.log('show')
      mainwin_child.setPosition(1000, 10);
      mainwin_child.setParentWindow(mainwin);
    });
    // mainwin.on('hide', () => {
    //   console.log('hide')
    // });
    // mainwin.on('focus', () => {
    //   mainwin_child.setParentWindow(mainwin);
    // });
    // mainwin.on('minimize', () => {
    //   console.log('minimize')
    // });
    // mainwin.on('restore', () => {
    //   console.log('restore')
    // });
    // mainwin.on('resize', () => {
    //   console.log('resize')
    // });
    

    // mainwin.on('blur', debounce(() => {
    //   // mainwin_child.setParentWindow(mainwin);
    //   mainwin_child.setParentWindow(null);
    //   mainwin_child.setPosition(1000, 10);
    // }, 300))
    // mainwin.on('will-resize', () => {
    //   mainwin_child.setParentWindow(null);
    //   mainwin_child.setPosition(1000, 10)
    // })
    // mainwin.on('resized', () => {
    //   mainwin_child.setParentWindow(mainwin);
    //   mainwin_child.setPosition(1000, 10)
    // })

    const mainwin_child = new BrowserWindow({
      width: 300,
      height: 250,
      // x: 1000,
      // y: 10,
      movable: false,
      // parent: mainwin,
      // modal: true,
      frame: false,
      titleBarStyle: 'hidden',
      transparent: true,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        webviewTag: true,
        nodeIntegrationInWorker: true,
        // affinity: 'browserviewandwindow',
      }
  })
    // child2.webContents.openDevTools();
    mainwin_child.loadFile(path.resolve(__dirname, './view2.html'));
    // mainwin_child.setBounds({ 
    //   x: 1000,
    //   y: 10, 
    // })
    mainwin_child.setPosition(1000, 10)

    const doubleClickAction = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');

    console.log('doubleClickAction', doubleClickAction)
    systemPreferences.subscribeNotification("NSDistributedNotificationCenter", () => {
      console.log('subscribeNotification')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceSessionDidResignActiveNotification", () => {
      console.log('before')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceSessionDidBecomeActiveNotification", () => {
      console.log('change')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceWillLaunchApplicationNotification", () => {
      console.log('change')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceDidLaunchApplicationNotification", () => {
      console.log('change')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceDidTerminateApplicationNotification", () => {
      console.log('change')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceSessionDidBecomeActiveNotification", () => {
      console.log('change')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceSessionDidBecomeActiveNotification", () => {
      console.log('change')
    })
    systemPreferences.subscribeWorkspaceNotification("NSWorkspaceSessionDidBecomeActiveNotification", () => {
      console.log('change')
    })

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


// 暴力版： 定时器期间，有新操作时，清空旧定时器，重设新定时器
// 增加前缘触发功能
var debounce = (fn, wait, immediate=false) => {
	let timer, startTimeStamp=0;
	let context, args;
 
	let run = (timerInterval)=>{
		timer= setTimeout(()=>{
			let now = (new Date()).getTime();
			let interval=now-startTimeStamp
			if(interval<timerInterval){ // the timer start time has been reset，so the interval is less than timerInterval
				console.log('debounce reset',timerInterval-interval);
				startTimeStamp=now;
				run(wait-interval);  // reset timer for left time 
			}else{
				if(!immediate){
					fn.apply(context,args);
				}
				clearTimeout(timer);
				timer=null;
			}
			
		},timerInterval);
	}
 
	return function(){
		context=this;
		args=arguments;
		let now = (new Date()).getTime();
		startTimeStamp=now; // set timer start time
 
		if(!timer){
			console.log('debounce set',wait);
			if(immediate) {
				fn.apply(context,args);
			}
			run(wait);    // last timer alreay executed, set a new timer
		}
		
	}
 
}


/// 增加前缘
var throttling = (fn, wait, immediate) => {
	let timer, timeStamp=0;
	let context, args;
 
	let run = () => {
		timer=setTimeout(()=>{
			if(!immediate){
				fn.apply(context,args);
			}
			clearTimeout(timer);
			timer=null;
		},wait);
	}
 
	return function () {
		context=this;
		args=arguments;
		if(!timer){
			console.log("throttle, set");
			if(immediate){
				fn.apply(context,args);
			}
			run();
		}else{
			console.log("throttle, ignore");
		}
	}
 
}