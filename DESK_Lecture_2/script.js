const { app, BrowserWindow } = require('electron');


function createWindow() {
    const window = new BrowserWindow({
        height: 600,
        width: 600,
    })

    window.loadFile('index.html')

    window.webContents.openDevTools();
}


app.whenReady().then(createWindow);



// Unable to find Electron app at /Users/vaibhavchawla/Desktop/AD/Desk-lecture-2/desk-2

// Cannot find module '/Users/vaibhavchawla/Desktop/AD/Desk-lecture-2/desk-2'