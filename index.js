const { FsHandler } = require('./handlers');
const { exec } = require('child_process');
const { promisify } = require('util');
const PuppeteerMassScreenshots = require('puppeteer-mass-screenshots');

const FRAME_RATE = 36;
const SIZE = '1080:1920';
class PuppeteerVideoRecorder {
    constructor(frameRate){
        this.screenshots = new PuppeteerMassScreenshots();
        this.fsHandler = new FsHandler();
        this.frameRate = frameRate;
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
        return await this.createVideo();
    }

    get defaultFFMpegCommand() {
        const { imagesFilename, videoFilename } = this.fsHandler;
        return [
            'ffmpeg',
            '-f concat',
            '-safe 0',
            `-i ${imagesFilename}`,
            '-bsf:v setts=TS/3',
            `-r ${this.frameRate ?? FRAME_RATE}`,
            '-pix_fmt yuv420p',
            `-vf scale="${SIZE}"`,
            videoFilename
        ].join(' ');
    }

    async createVideo(ffmpegCommand = '') {
        const { videoFilename } = this.fsHandler;
        const _ffmpegCommand = ffmpegCommand || this.defaultFFMpegCommand;
        await promisify(exec)(_ffmpegCommand);
        return videoFilename
    }
}

module.exports = PuppeteerVideoRecorder;
