const { FsHandler } = require('./handlers');
const { exec } = require('child_process');
const PuppeteerMassScreenshots = require('puppeteer-mass-screenshots');

class PuppeteerVideoRecorder {
    constructor(){
        this.screenshots = new PuppeteerMassScreenshots();
        this.fsHandler = new FsHandler();
    }

    async init(page, outputFolder, testName){
        this.page = page;
        this.outputFolder = outputFolder;
        await this.fsHandler.init(outputFolder, testName);
        const { imagesPath, imagesFilename, appendToFile } = this.fsHandler;
        await this.screenshots.init(page, imagesPath, {
            afterWritingImageFile: (filename) => appendToFile(imagesFilename, `file '${filename.replace(outputFolder,'')}'\n`)
        });
    }

    start(options = {}) { 
        return this.screenshots.start(options);
    }
    
    async stop () {
    	await this.screenshots.stop();
    	await this.createVideo();
        await this.fsHandler.clear();
    }

    async cancel () {
    	await this.screenshots.stop();
        await this.fsHandler.clear();
    }

    get defaultFFMpegCommand() {
        const { imagesFilename, videoFilename } = this.fsHandler;
        return [
            'ffmpeg',
            '-f concat',
            '-safe 0',
            `-i ${imagesFilename}`,
            '-framerate 60',
            `"${videoFilename}"`
        ].join(' ');
    }

    createVideo(ffmpegCommand = '') {
        const _ffmpegCommand = ffmpegCommand || this.defaultFFMpegCommand;

        return new Promise((resolve, reject) => {
            exec(_ffmpegCommand, (error) => {
                if (error) reject(error);

                resolve();
            });
        });       
    }
}

module.exports = PuppeteerVideoRecorder;
