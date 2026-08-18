const { spawn } = require('child_process')

const SONGS_DIR = "./songs"

let songs = undefined

// List Available Songs to User2
function listSongs(songDirectoryPath) {
    const lsProcess = spawn(
        "ls",
        [songDirectoryPath]
    )

    lsProcess.stdout.on('data', (data) => {
        const rawOutput = data.toString().trim()
        songs = rawOutput.trim().split("\n")

        songs.forEach((song, ind) => {
            console.log(`${ind} : ${song}`)
        })
    })
}

// Play Song
function playSong(songFilePath) {
    const play = spawn(
        'afplay',
        [songFilePath]
    )

}

listSongs(SONGS_DIR)

// Take User Song Selection
process.stdin.on('data', (data) => {
    const userChoice = Number(data.toString())
    console.log(`User chose ${userChoice}`)
    console.log(songs)
    console.log(SONGS_DIR + "/" + songs[userChoice])
    playSong(SONGS_DIR + "/" + songs[userChoice])

})