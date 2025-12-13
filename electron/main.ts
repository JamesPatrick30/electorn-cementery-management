import { app, BrowserWindow } from 'electron'
import * as path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  win.loadURL('http://localhost:5173')
  win.setFullScreen(true)
}

app.whenReady().then(createWindow)
