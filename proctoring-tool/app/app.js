// app.js
import { app, BrowserWindow, ipcMain, dialog, Menu, desktopCapturer, session } from "electron";
import path from "path";
import fs from "fs";

let electronWindow = null;
let startTimestamp = null;
let cameraShotPath = null;

// Feature: Screen Preview Capture + Camera Snap — output folders
const CAMERA_SNAP_DIR = path.join(import.meta.dirname, "user-camera-snap");
const SCREEN_SNAP_DIR = path.join(import.meta.dirname, "user-screen-snap");

for (const dir of [CAMERA_SNAP_DIR, SCREEN_SNAP_DIR]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function createWindow() {
    electronWindow = new BrowserWindow({
        height: 1000,
        width: 1000,

        webPreferences: {
            devTools: true,
            preload: path.join(import.meta.dirname, "preload.js")
        }
    });

    session.defaultSession.setDisplayMediaRequestHandler(
        (request, callback) => {
            desktopCapturer.getSources({ types: ['window'] }).then((sources) => {
                // Grant access to the first screen found.
                callback({ video: sources[0], audio: 'loopback' })
            })
            // If true, use the system picker if available.
            // Note: this is currently experimental. If the system picker
            // is available, it will be used and the media request handler
            // will not be invoked.
        },
        { useSystemPicker: true }
    )

    // electronWindow.loadFile(path.join(import.meta.dirname, "../dist/index.html"));
    electronWindow.loadURL("http://localhost:5173")


    electronWindow.webContents.openDevTools();

    // Feature: Disable Ctrl/Cmd + C
    electronWindow.webContents.on("before-input-event", (event, input) => {
        if (input.type !== "keyDown") return;

        const isCtrlOrCmd = input.control || input.meta;
        const isCKey = input.key.toLowerCase() === "c";

        if (isCtrlOrCmd && isCKey) {
            event.preventDefault();

            dialog.showMessageBox(electronWindow, {
                type: "warning",
                title: "Action Blocked",
                message: "Copying is disabled during the exam.",
                detail: "Attempting to copy exam content is not permitted and may be flagged."
            });
        }
    });
}

// Feature: Application Menu (top menu bar — File / Edit / View / Window / Help)
function createApplicationMenu() {
    const isMac = process.platform === "darwin";

    const template = [
        ...(isMac ? [{ label: app.name, submenu: [{ role: "about" }, { role: "quit" }] }] : []),

        {
            label: "File",
            submenu: [{ label: "Exit Exam", click: () => app.quit() }]
        },
        {
            label: "Edit",
            submenu: [{ role: "copy" }, { role: "paste" }]
        },
        {
            label: "View",
            submenu: [{ role: "reload" }, { role: "togglefullscreen" }]
        },
        {
            label: "Window",
            submenu: [{ role: "minimize" }]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Show Exam Rules",
                    click: () => {
                        dialog.showMessageBox(electronWindow, {
                            type: "info",
                            title: "Athena Exam Rules",
                            message: "Exam Rules",
                            detail:
                                "1. Stay on the exam screen.\n" +
                                "2. Camera must remain enabled.\n" +
                                "3. Do not leave the exam.\n" +
                                "4. Do not use external assistance.\n" +
                                "5. Click Exit Exam when finished."
                        });
                    }
                }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}


// Feature: Screen Preview Capture
async function takeScreenShot() {
    try {
        const sources = await desktopCapturer.getSources({
            types: ["screen"],
            thumbnailSize: { width: 1280, height: 720 }
        });

        if (!sources.length) return;

        const primaryScreen = sources[0];
        const pngBuffer = primaryScreen.thumbnail.toPNG();

        const filePath = path.join(SCREEN_SNAP_DIR, `screen-${Date.now()}.png`);
        fs.writeFileSync(filePath, pngBuffer);
    } catch (error) {
        console.error("Failed to capture screen preview:", error);
    }
}

ipcMain.handle("start-timer", (event) => {
    startTimestamp = Date.now();

    setInterval(() => {
        electronWindow.webContents.send("timer", (Date.now() - startTimestamp) / 1000);
    }, 1000);

    // Feature: Parallel Save (camera photo + screen preview together)
    setInterval(() => {
        Promise.all([
            Promise.resolve(electronWindow.webContents.send("camera-shot")),
            // takeScreenShot()
        ]).catch((error) => {
            console.error("Parallel save failed:", error);
        });
    }, 5000);
});

ipcMain.handle("store-camera-snap-image-on-disk", (_event, data) => {
    let filePath = path.join(CAMERA_SNAP_DIR, `${Date.now()}.jpg`);

    if (cameraShotPath) {
        filePath = cameraShotPath;
    }
    fs.writeFileSync(filePath, Buffer.from(data));
});

ipcMain.on("show-rules", () => {
    dialog.showMessageBox(electronWindow, {
        type: "info",
        title: "Athena Exam Rules",
        message: "Exam Rules",
        detail:
            "1. Stay on the exam screen.\n" +
            "2. Camera must remain enabled.\n" +
            "3. Do not leave the exam.\n" +
            "4. Do not use external assistance.\n" +
            "5. Click Exit Exam when finished."
    });
});

app.whenReady().then(() => {
    // Feature: Application Menu
    createApplicationMenu();


    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

async function showMessageBox() {
    const data = await dialog.showMessageBox({
        type: "info",
        title: "GuideLines for the exam",
        message:
            "We store your data \n We take your capture shots after every 5 seconds \n If you caught cheating your marks will be zero",
        buttons: ["What Next", "Go previous"],
        checkboxChecked: true,
        checkboxLabel: "Your are Ok with above guidelines"
    });

    const { response, checkboxChecked } = data;
    console.log(data);
    // response -> contains the index of the button
    // checkboxChecked -> contains user clicks the button
}

ipcMain.handle("showMessageBox", async () => {
    await showMessageBox();
});

// showOpenDialog box api can do lot of things can select files and folders
async function selectFile() {
    const response = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "ALl files",
                extensions: ["*"]
            }
        ]
    });

    // check what does response have
    const { filePaths, canceled } = response;
    console.log(response);
}

async function selectFolder() {
    const response = await dialog.showOpenDialog({
        title: "Select the folder",
        buttonLabel: "OK",
        properties: ["openDirectory"],
        defaultPath: "/"
    });

    console.log(response);
}

ipcMain.handle("selectFile", async () => {
    await selectFile();
});

ipcMain.handle("selectFolder", async () => {
    await selectFolder();
});

async function showSaveDialogBox() {
    const response = await dialog.showSaveDialog({
        title: "Where to save file",
        message: "Select the folder to save the file",
        buttonLabel: "Save as",
        defaultPath: "/"
    });

    console.log(response);
}

ipcMain.handle("showSaveDialogBox", async () => {
    await showSaveDialogBox();
});
