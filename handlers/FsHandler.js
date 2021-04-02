const { appendFile, mkdir, rmdir } = require('fs').promises;
const { openSync, closeSync, existsSync } = require('fs');
const { join } = require('path');

class FsHandler {
    async init(outputFolder, name = Date.now()) {
        const now = new Date();
        this.outputFolder = outputFolder;

        // do not put the video in the test subfolder, but in the root recording folder
        const videofilename = `../${name}.webm`;
        
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
