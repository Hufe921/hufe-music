'use strict'
const {
  app,
  BrowserWindow,
  ipcMain
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
    center: true
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
