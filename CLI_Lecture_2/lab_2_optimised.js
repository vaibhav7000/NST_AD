#!/Users/vaibhavchawla/.nvm/versions/node/v22.22.2/bin/node
// shebang
const { spawn } = require('child_process');
const { join } = require('path');
const { readdirSync } = require('fs');

const songs = join(__dirname, 'songs');
let output = '';

// 1. using spawn with ls replaced with fs
function listSongs(songDir) {
    output = readdirSync(songDir, 'utf8');
    output.forEach((data,index) => {
        console.log(`${index}. ${data}`)
    })
}

listSongs(songs)

// 2. using spawn with afplay
function playSong(songPath) {
    const afplayProcess = spawn('afplay', [songPath]);
}

// 3. take input from user
process.stdin.on('data', (d) => {
    const input = Number(d.toString());
    const selectedSong = output[input];
    let finalSongPath = join(__dirname, 'songs', selectedSong)

    playSong(finalSongPath)

})

