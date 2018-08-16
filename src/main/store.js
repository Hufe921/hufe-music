import path from 'path'
import fs from 'fs'
const electron = require('electron')

class Store {
  constructor () {
    const dataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(dataPath, 'music.json')
    this.config = parseConfig(this.path)
  }

  get (key) {
    console.log(this.path)
    return this.config[key]
  }

  set (key, value) {
    this.config[key] = value
    clearTimeout(this.saveTimeout)
    this.saveTimeout = setTimeout(() => {
      try {
        fs.writeFileSync(this.path, JSON.stringify(this.config))
      } catch (e) {
        console.error(e)
      }
    }, 500)
  }
}

function parseConfig (file) {
  if (!fs.existsSync(file)) {
    return {}
  }

  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    return {}
  }
}

export default new Store()
