const { appendFile, mkdir } = require('fs').promises;
const { openSync, closeSync, existsSync } = require('fs');
const { join } = require('path');

class FsHandler {
    async init(outputFolder) {
        this.outputFolder = outputFolder;
        this.videoFilename = join(this.outputFolder, Date.now() + '.webm');
        this.imagesPath = join(this.outputFolder, 'images');
        this.imagesFilename = join(this.outputFolder, 'images.txt');
        await this.verifyPathExists(this.outputFolder);
        await this.verifyPathExists(this.imagesPath);   
        await this.verifyPathExists(this.imagesFilename, 'file');
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
