const { appendFile, mkdir, rmdir, unlink } = require('fs').promises;
const { openSync, closeSync, existsSync } = require('fs');
const { join } = require('path');

class FsHandler {
    async init(outputFolder, testName) {
        const now = new Date();
        this.outputFolder = outputFolder;

        const hours = this.addZeroBefore(now.getHours());
        const minutes = this.addZeroBefore(now.getMinutes());
        const seconds = this.addZeroBefore(now.getSeconds());
        const videofilename = `${testName.replace(/ /gi, '_').toLowerCase()}-${hours}:${minutes}:${seconds}.webm`;
        
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

    async clear() {
        if (await existsSync(this.imagesPath)) {
            await rmdir(this.imagesPath, { recursive: true });
        }
        if (await existsSync(this.imagesFilename)) {
            await unlink(this.imagesFilename);
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
