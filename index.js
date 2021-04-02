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
        // if no testName was provided use a timestamp
        this.testName = testName ? testName : Date.now();
        // append sub-folder name to output folder to form the full output folder name
        this.fullOutputFolder = `${this.outputFolder.replace(/\/$/, "")}/${this.testName.replace(/ /gi, '_').toLowerCase()}/`;
        await this.fsHandler.init(this.fullOutputFolder, this.testName);
        const { imagesPath, imagesFilename, appendToFile } = this.fsHandler;
        // strip the full output foldername from the filename to prevent FFMPEG throwing errors
        await this.screenshots.init(page, imagesPath, {
            afterWritingImageFile: (filename) => appendToFile(imagesFilename, `file '${filename.replace(this.fullOutputFolder,'')}'\n`)
        });
    }

    // start recording images
    start(options = {}) { 
        return this.screenshots.start(options);
    }

    // stop recording and save images as videofile
    async stop () {
    	await this.screenshots.stop();
    	await this.createVideo();
    }

    // clear the subfolder with images
    async clear () {
        await this.fsHandler.clearOutputSubFolder();
    }

    // stop recording, do not save a video
    async cancel () {
    	await this.screenshots.stop();
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
