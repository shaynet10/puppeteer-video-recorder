const { FsHandler } = require('./handlers');
const { exec } = require('child_process');
const { promisify } = require('util');
const PuppeteerMassScreenshots = require('puppeteer-mass-screenshots');

const FRAME_RATE = 25;
const SIZE = '1080:1920';
class PuppeteerVideoRecorder {
    constructor(){
        this.screenshots = new PuppeteerMassScreenshots();
        this.fsHandler = new FsHandler();
        this.startTime = 0;
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
        this.startTime = performance.now();
        return this.screenshots.start(options);
    }

    /**
     * Stops creating screenshots
     * @returns - the createVideo handler
     */
    async stop() {
        const videoRealLength = performance.now() - this.startTime;
        await this.screenshots.stop();
        return this.createVideo(videoRealLength);
    }

    /**
     * Gets the default `ffmpeg` command
     * @param {*} frameRate - frameRate for the video generation
     * @returns - the string representation of the `ffmpeg` command with all parameters
     */
    defaultFFMpegCommand(frameRate) {
        const { imagesFilename, videoFilename } = this.fsHandler;
        // it's important to pass `-r` option twice to set the frame rate of the input and output stream
        return [
            'ffmpeg',
            '-f concat',
            '-safe 0',
            `-r ${frameRate}`,
            `-i ${imagesFilename}`,
            `-r ${frameRate}`,
            '-pix_fmt yuv420p',
            `-vf scale="${SIZE}"`,
            videoFilename
        ].join(' ');
    }

    /**
     * Creates video out of the screenshots
     * @param {*} ms - time period during which the screenshots were created
     * @param {*} ffmpegCommand - custom `ffmpeg` command to be used instead of the default one
     * @returns - Video file name
     */
    async createVideo(ms, ffmpegCommand = '') {
        const { videoFilename } = this.fsHandler;
        const frameRate = await this.getFrameRate(ms) ?? FRAME_RATE;
        const command = ffmpegCommand || this.defaultFFMpegCommand(frameRate);
        console.log('ffmpeg command', command);
        await promisify(exec)(command);
        return videoFilename;
    }

    /**
     * Gets the number of created screenshots
     * @returns - Number of screenshots generated between the `start` and `stop` commands
     */
    async getFilesNumber() {
        return await this.fsHandler.getFilesNumber();
    }

    /**
     * Gets the frame rate for the video (number_of_screenshots / record_time_in_s)
     * @param {*} ms - time period during which the screenshots were created
     * @returns - the frequency of the last screenshot generation (fps)
     */
    async getFrameRate(ms) {
        const filesNumber = await this.getFilesNumber();
        console.log('Files created: ', filesNumber);
        console.log('Video length: ', ms);
        const frameRate = Math.round(filesNumber / ms * 1000 * 10) / 10;
        console.log('Frame rate: ', frameRate);
        return frameRate;
    }
}

module.exports = PuppeteerVideoRecorder;
