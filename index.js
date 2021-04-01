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
        // replace spaces with underscores and form a name for a sub-folder for each test
        this.testSubFolder = testName.replace(/ /gi, '_').toLowerCase();
        // append sub-folder name to output folder to form the full output folder name
        this.fullOutputFolder = `${this.outputFolder.replace(/\/$/, "")}/${this.testSubFolder}/`;
        await this.fsHandler.init(this.fullOutputFolder, testName);
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

    // stop recording, save video and clear the subfolder with images
    async stopAndClear () {
    	await this.screenshots.stop();
    	await this.createVideo();
        await this.fsHandler.clearOutputSubFolder();
    }

    // stop recording, do not save a video and clear all images
    async cancel () {
    	await this.screenshots.stop();
        await this.fsHandler.clearOutputSubFolder();
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
