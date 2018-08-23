'use strict'
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage,
  Notification,
  dialog
} = require('electron')
const ms = require('mediaserver')
const fs = require('fs')
const path = require('path')
const http = require('http')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const icon = path.join(__static, '/icons/32.ico')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1200,
    frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: false,
    title: 'Hufe',
    autoHideMenuBar: true,
    center: true,
    icon
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// 关闭和最小化餐单
ipcMain.on('close', e => {
  mainWindow.close()
})

ipcMain.on('minimize', e => {
  mainWindow.minimize()
})

// 系统托盘
let tray = null
let trayMenu = [{
  label: 'hufe-music'
},
{
  type: 'separator'
},
{
  label: '暂停',
  icon: formatImg('pause.png'),
  click () {
    menuClick(1)
  }
},
{
  label: '上一首',
  icon: formatImg('before.png'),
  click () {
    menuClick(2)
  }
},
{
  label: '下一首',
  icon: formatImg('after.png'),
  click () {
    menuClick(3)
  }
},
{
  type: 'separator'
},
{
  label: '退出程序',
  role: 'quit',
  icon: formatImg('logout.png')
}
]
app.on('ready', () => {
  tray = new Tray(icon)
  // 点击托盘区显示应用
  tray.on('click', function () {
    mainWindow.isMinimized() ? mainWindow.show() : mainWindow.minimize()
  })
  // 托盘区餐单功能
  let contextMenu = Menu.buildFromTemplate(trayMenu)
  tray.setToolTip('hufe-music')
  tray.setContextMenu(contextMenu)
})

// 向渲染程序发送控制播放器命令
function menuClick (arg) {
  mainWindow.webContents.send('play_shell', {
    status: arg
  })
}

// 接收渲染进程有关播放器的信息
ipcMain.on('change_menu', (event, arg) => {
  trayMenu[2].label = arg.is_play ? '暂停' : '播放'
  trayMenu[2].icon = arg.is_play ? formatImg('pause.png') : formatImg('play.png')
  if (arg.song.id) {
    trayMenu[0].label = arg.song.name.length > 8 ? arg.song.name.substring(0, 8) + '...' : arg.song.name
  }
  tray.setContextMenu(Menu.buildFromTemplate(trayMenu))
  event.returnValue = 200
})

// 格式化图片
function formatImg (name) {
  let url = path.join(__static, '/icons/' + name)
  let result = nativeImage.createFromPath(url)
  return result.resize({
    width: 18,
    height: 18
  })
}

// 读取本地配置
let config
const baseUrl = app.getPath('userData')
const musicUrl = path.join(baseUrl, 'music.json')
if (!fs.existsSync(musicUrl)) {
  fs.writeFileSync(musicUrl, '{"address":[]}')
} else {
  config = JSON.parse(fs.readFileSync(musicUrl, 'utf8'))
}

// 音频代理
ms.mediaTypes['.flac'] = 'audio/flac' // 拓展格式
const allowKeys = []
// 所有音频格式
Object.keys(ms.mediaTypes).forEach(ext => {
  if (ms.mediaTypes[ext].indexOf('audio') === 0) {
    allowKeys.push(ext)
  }
})

// 本地音频服务
startMusicServer(port => {
  // 获取配置
  ipcMain.on('get-config', event => {
    let musicList = JSON.parse(fs.readFileSync(musicUrl, 'utf8'))
    event.returnValue = Object.assign(musicList, {
      port,
      allowKeys
    })
  })
  // 设置新的配置
  ipcMain.on('save-config', (event, {
    key,
    value
  }) => {
    let musicList = JSON.parse(fs.readFileSync(musicUrl, 'utf8'))
    musicList[key] = value
    fs.writeFileSync(musicUrl, JSON.stringify(musicList))
  })
})

function startMusicServer (callback) {
  // 搭建服务
  const server = http.createServer(pipeMusic).listen(9210, () => {
    callback(server.address().port)
  })

  return server
}

function pipeMusic (req, res) {
  // 获取访问地址，验证合法性
  const musicUrl = decodeURIComponent(req.url)
    .substring(5, req.url.lengh)

  const extname = path.extname(musicUrl)
  if (allowKeys.indexOf(extname) < 0) {
    return notFound(res)
  }
  // 是否在用户清单中
  let isExit = false
  let addressList = config.address
  addressList.forEach(item => {
    if (item === musicUrl) {
      isExit = true
    }
  })

  if (!isExit) {
    return notFound(res)
  }

  if (!fs.existsSync(musicUrl)) {
    return notFound(res)
  }

  ms.pipe(req, res, musicUrl)
}

function notFound (res) {
  res.writeHead(404)
  res.end('not found')
}

// 桌面通知
ipcMain.on('notification', (e) => {
  let notification = new Notification({
    title: 'ceshi',
    body: '正文',
    icon
  })
  console.log(Notification.isSupported())
  notification.show()
  e.returnValue = 200
})

// /**
//  * Auto Updater
//  *
//  * Uncomment the following code below and install `electron-updater` to
//  * support auto updating. Code Signing with a valid certificate is required.
//  * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
//  */

const { autoUpdater } = require('electron-updater')

const server = 'https://update.electronjs.org'
const feed = `${server}/Hufe921/hufe-music/${process.platform}/${app.getVersion()}`
autoUpdater.setFeedURL(feed)
autoUpdater.updateConfigPath = path.join(__static, '/dev-app-update.yml')
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('checking-for-update', () => {
  console.log('开始检测更新')
})

autoUpdater.on('error', (error) => {
  dialog.showMessageBox({ title: '提示', message: error, buttons: ['确定'] })
})

// 发现可用更新
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({ title: '提示', message: '发现可用更新，是否立刻下载安装？', buttons: ['取消', '确定'] }, (res) => {
    console.log(res)
    if (res) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({ title: '提示', message: '暂时没有可用更新', buttons: ['确定'] })
})

// 下载完成
autoUpdater.on('update-downloaded', (data) => {
  console.log(data)
  dialog.showMessageBox({ title: '提示', message: '是否下载完成，立刻重启安装？', buttons: ['取消', '确定'] }, (res) => {
    if (res) {
      // autoUpdater.quitAndInstall()
      app.quit()
    }
  })
})

// 监控用户发起更新请求
ipcMain.on('autoupdate', (e) => {
  console.log('hufe')
  autoUpdater.checkForUpdates()
  e.returnValue = 200
})
