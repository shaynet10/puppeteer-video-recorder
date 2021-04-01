const { appendFile, mkdir, rmdir } = require('fs').promises;
const { openSync, closeSync, existsSync } = require('fs');
const { join } = require('path');

class FsHandler {
    async init(outputFolder, videoName) {
        const now = new Date();
        this.outputFolder = outputFolder;

        // get the time to construct a more human readable timestamp in the filename
        const hours = this.addZeroBefore(now.getHours());
        const minutes = this.addZeroBefore(now.getMinutes());
        const seconds = this.addZeroBefore(now.getSeconds());

        // do not put the video in the test subfolder, but in the root recording folder
        const videofilename = `../${videoName}-${hours}:${minutes}:${seconds}.webm`;
        
        this.videoFilename = join(this.outputFolder, videofilename);
        this.imagesPath = join(this.outputFolder, 'images');
        this.imagesFilename = join(this.outputFolder, 'images.txt');
        await this.verifyPathExists(this.outputFolder);
        await this.verifyPathExists(this.imagesPath);   
        await this.verifyPathExists(this.imagesFilename, 'file');
    }

    addZeroBefore(n) {
        return (n < 10 ? '0' : '') + n;
    }

    async clearOutputSubFolder() {
        if (await existsSync(this.outputFolder)) {
            await rmdir(this.outputFolder, { recursive: true });
        }
    }

    createEmptyFile(filename) {
        return closeSync(openSync(filename, 'w'));
    }

    createPath(pathToCreate, type = 'folder') {
        if (type === 'folder') return mkdir(pathToCreate);
        return this.createEmptyFile(pathToCreate);
    }

    verifyPathExists(pathToVerify, type = 'folder') {
    	return existsSync(pathToVerify) || this.createPath(pathToVerify, type);
    }

    appendToFile(filename, data) {
        return appendFile(filename, data);
    }
}

module.exports = FsHandler;
