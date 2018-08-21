'use strict'
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage
} = require('electron')
const ms = require('mediaserver')
const fs = require('fs')
const path = require('path')
const http = require('http')
const icon = path.join(__dirname, '../../build/icons/32.ico')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
let contextMenu = null
let tray = null
app.on('ready', () => {
  tray = new Tray(icon)
  // 点击托盘区显示应用
  tray.on('click', function () {
    mainWindow.isMinimized() ? mainWindow.show() : mainWindow.minimize()
  })
  // 托盘区餐单功能
  contextMenu = Menu.buildFromTemplate([
    {
      label: 'hufe-music'
    },
    {
      type: 'separator'
    },
    {label: '暂停',
      icon: formatImg('pause.png'),
      click () {
        menuClick(1)
      }},
    {label: '上一首',
      icon: formatImg('before.png'),
      click () {
        menuClick(2)
      }},
    {label: '下一首',
      icon: formatImg('after.png'),
      click () {
        menuClick(3)
      }},
    {type: 'separator'},
    {label: '退出程序', role: 'quit', icon: formatImg('logout.png')}])
  tray.setToolTip('hufe-music')
  tray.setContextMenu(contextMenu)
})

// 向渲染程序发送控制播放器命令
function menuClick (arg) {
  mainWindow.webContents.send('play_shell', {status: arg})
}

// 接收渲染进程有关播放器的信息
ipcMain.on('change_menu', (event, arg) => {
  console.log(contextMenu.items[2])
  if (arg.is_play) {
    console.log('dede')
    contextMenu.items[2].label = '暂停2'
    // contextMenu.items[2].icon = formatImg('pause.png')
    tray.setContextMenu(contextMenu)
    console.log(contextMenu.items[2])
  }
  if (arg.song.id) {
    contextMenu.items[0].label = arg.song.name.length > 10 ? arg.song.name.substring(0, 10) + '...' : arg.song.name
  }
  event.returnValue = 200
})

// 格式化图片
function formatImg (name) {
  let url = path.join(__dirname, '../../build/icons/' + name)
  let result = nativeImage.createFromPath(url)
  return result.resize({width: 18, height: 18})
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
          import { autoUpdater } from 'electron-updater'

          autoUpdater.on('update-downloaded', () => {
            autoUpdater.quitAndInstall()
          })

          app.on('ready', () => {
            if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
          })
           */
