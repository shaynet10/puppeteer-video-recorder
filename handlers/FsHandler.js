const { appendFile, mkdir, readdir, unlink } = require('fs').promises;
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
        await this.createEmptyFile(this.imagesFilename, 'file');
        await this.clearImagesInPath(this.imagesPath);
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

    async clearImagesInPath(imagesPath) {
        const files = await readdir(imagesPath);
        console.log(`Removing files in ${imagesPath}`);
        for (const file of files) {
            const filename = join(imagesPath, file);
            console.log(`Removing file ${filename}`);
            await unlink(filename);
        }
    }
}

module.exports = FsHandler;
