// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// Note: Screen Preview Capture, Application Menu, Menu Tray, and Disable
// Ctrl/Cmd+C all run entirely in app.js (main process) — no bridge
// functions needed here for them.

contextBridge.exposeInMainWorld("athena", {
    registerListenerForTimerTickFromMain: (callback) => {
        // callback is setTimer
        const fn = (event, message) => {
            callback(message);
        };

        ipcRenderer.on("timer", fn);

        return () => {
            ipcRenderer.removeListener("timer", fn);
        };
    },
    startTimerOnMain: () => {
        try {
            return ipcRenderer.invoke("start-timer");
        } catch (error) {
            throw "error";
        }
    },

    // Feature: Parallel Save — fired every 5s from main alongside its own
    // screen preview capture.
    registerListenerForCameraSnapFromMain: (callback) => {
        ipcRenderer.on("camera-shot", callback);

        return () => {
            ipcRenderer.removeListener("camera-shot", callback);
        };
    },

    storeCameraSnapImageOnDisk: (data) => {
        ipcRenderer.invoke("store-camera-snap-image-on-disk", data);
    },

    // Functions related to showing Contest Rules in a new Dialog.
    showRules: () => {
        ipcRenderer.send("show-rules");
    },
    showMessageBox: () => {
        ipcRenderer.invoke("showMessageBox");
    },
    selectFile: () => {
        ipcRenderer.invoke("selectFile");
    },
    selectFolder() {
        ipcRenderer.invoke("selectFolder");
    },
    showSaveDialogBox() {
        ipcRenderer.invoke("showSaveDialogBox");
    }
});
