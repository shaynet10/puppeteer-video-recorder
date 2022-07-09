const { FsHandler } = require('./handlers');
const { exec } = require('child_process');
const { promisify } = require('util');
const PuppeteerMassScreenshots = require('puppeteer-mass-screenshots');

class PuppeteerVideoRecorder {
    constructor(){
        this.screenshots = new PuppeteerMassScreenshots();
        this.fsHandler = new FsHandler();
    }

    async init(page, outputFolder){
        this.page = page;
        this.outputFolder = outputFolder;
        await this.fsHandler.init(outputFolder);
        const { imagesPath,imagesFilename, appendToFile } = this.fsHandler;
        await this.screenshots.init(page, imagesPath, {
            afterWritingImageFile: (filename) => appendToFile(imagesFilename, `file '${filename}'\n`)
        });
    }

    start(options = {}) {
        return this.screenshots.start(options);
    }

    async stop () {
    	await this.screenshots.stop();
    	await this.createVideo();
    }

    get defaultFFMpegCommand() {
        const { imagesFilename, videoFilename } = this.fsHandler;
        return [
            'ffmpeg',
            '-f concat',
            '-safe 0',
            `-i ${imagesFilename}`,
            '-framerate 60',
            videoFilename
        ].join(' ');
    }

    async createVideo(ffmpegCommand = '') {
        const _ffmpegCommand = ffmpegCommand || this.defaultFFMpegCommand;
        return await promisify(exec)(_ffmpegCommand);
    }
}

module.exports = PuppeteerVideoRecorder;
