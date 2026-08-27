const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const songDir = path.join(__dirname, 'songs');
let allSongs = null;
let cursor = 0;
let isPaused = true;
let vlcPlayProcess = undefined;

let totalDuration = undefined;
let timeElapsed = undefined;

async function getSongDuration(songFilePath) {
    return new Promise((resolve, reject) => {
        const afinfoCP = spawn("afinfo", [songFilePath])

        afinfoCP.stdout.on('data', (data) => {
            resolve(Number(data.toString().split("estimated duration: ")[1].split(".")[0]) + 1)
        })
    })
}

function startElapsedTracking() {
    timeElapsed = 0;
    setInterval(() => {
        if (vlcPlayProcess !== undefined && !isPaused) {
            timeElapsed += 0.1
        }

        listSongs(songDir)
    }, 100)
}


function renderBar(percentagePlayed) {
    const PROGRESS_BAR_WIDTH = 50;

    const playedCharC = Math.round(50 * (percentagePlayed) / 100)

    const progressBar = "X".repeat(playedCharC) + ".".repeat(50 - playedCharC)
    return progressBar
}

function listSongs(songDirPath) {
    allSongs = fs.readdirSync(songDirPath);

    process.stdout.write("\x1B[3;1H");

    const menuText = allSongs.map((songName, index) => {
        return ("\r\x1B[0K" + (index === cursor ? '>' : '') + songName)
    }).join("\n")

    process.stdout.write(menuText + "\n")


    if (timeElapsed !== undefined && totalDuration !== undefined) {
        const percentagePlayed = Math.min(100, ((timeElapsed / totalDuration) * 100).toFixed(2))
        process.stdout.write(`\r\x1B[0K${Math.ceil(timeElapsed)} / ${totalDuration} || ${percentagePlayed} %`)
        const bar = renderBar(percentagePlayed)
        process.stdout.write(`\n\x1B[0K${bar}`)
    }
}


async function playSong(cursor) {
    if (vlcPlayProcess !== undefined) {
        vlcPlayProcess.kill(15)
        vlcPlayProcess = undefined
    }

    isPaused = false;
    const songFinalPath = path.join(songDir, allSongs[cursor]);
    totalDuration = await getSongDuration(songFinalPath)
    startElapsedTracking()
    vlcPlayProcess = spawn('vlc', ["--intf", "rc", songFinalPath]);
}

process.stdout.write('\x1b[2J');
listSongs(songDir);

process.stdin.setRawMode(true);
process.stdin.on('data', (data) => {
    if (data[0] === 0x1b) {
        if (data[1] === 0x5b) {
            if (data[2] === 0x41) {
                // up arrow key
                cursor = ((cursor - 1) % allSongs.length); // should be in the loop of songs i.e use module operator
                if (cursor < 0) {
                    cursor += allSongs.length
                }
            } else if (data[2] === 0x42) {
                cursor = (cursor + 1) % allSongs.length; // should be in the loop of songs i.e use module operator
                // down arrow key
            } else if (data[2] === 0x43) {
                // right arrow key

            } else if (data[2] === 0x44) {

                // left arrow key
            }
        }

        listSongs(songDir)
        return
    }

    // next and back in raw mode
    if (data[0] === 110) { // Play Next
        cursor = (cursor + 1) % allSongs.length; // should be in the loop of songs i.e use module operator
        listSongs(songDir)
        playSong(cursor)
    }

    if (data[0] === 98) { // Play Previous
        cursor = ((cursor - 1) % allSongs.length); // should be in the loop of songs i.e use module operator
        if (cursor < 0) {
            cursor += allSongs.length
        } listSongs(songDir)
        playSong(cursor)
    }

    // enter in raw mode
    if (data[0] === 0x0d) {
        playSong(cursor);
        return;
    }

    // when in raw mode, the process get 0x03, does not provide SIGINT signal ( this gets in default mode )
    if (data[0] === 0x03) {
        process.exit(); // generates SIGINT and exit the nodejs process
    }

    // play pause
    if (data[0] === 112) {
        isPaused = !isPaused
        // to stop the process we will use SIGSTOP command
        if (vlcPlayProcess !== undefined) {
            vlcPlayProcess.stdin.write('pause\n');
        }
    }
})
