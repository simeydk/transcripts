const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')

// runs a line on the command line
async function run(command) {
    const { stdout } = await exec(command)
    return stdout
}

async function getStagedFilenames() {
    const stdout = await run('git diff --name-only --cached')
    filenames = stdout.split('\n').filter(x => x)
    return filenames
}

function createCommitMessage(filenames, maxListLen = 50) {
    if (!filenames.length) return 'No changes'
    const firstName = path.basename(filenames[0])
    const numFiles = filenames.length
    const others = numFiles > 1 ? ` and ${numFiles -1} other files` : ''
    const list = filenames.slice(0,maxListLen).join('\n')
    const after = numFiles > maxListLen ? `and ${numFiles - maxListLen} more` : ''
    const message = `Apply standardised formatter to ${firstName}${others}

Files changed:
${list}
${after}`
    return message

}

async function main() {
    const filenames = await getStagedFilenames()
    const message = createCommitMessage(filenames)
    console.log(message)
}



if (require.main === module) {
    main();
}