const { FsHandler } = require('./handlers');
const { exec } = require('child_process');
const { promisify } = require('util');
const PuppeteerMassScreenshots = require('puppeteer-mass-screenshots');

const FRAME_RATE = 25;
const SIZE = '1080:1920';

/**
 * Gets the default `ffmpeg` command
 * @param {*} frameRate - frameRate for the video generation
 * @param {*} imagesFilename - images list file name
 * @param {*} videoFilename - resulting video file name
 * @returns - the string representation of the `ffmpeg` command with all parameters
 */
const getFFMpegCommand = (imagesFilename, videoFilename, frameRate) =>
  [
    // it's important to pass `-r` option twice to set the frame rate of the input and output stream
    'ffmpeg',
    '-f concat',
    '-safe 0',
    `-r ${frameRate}`,
    `-i ${imagesFilename}`,
    `-r ${frameRate}`,
    '-pix_fmt yuv420p',
    `-vf scale='${SIZE}'`,
    videoFilename,
  ].join(' ');

/**
 * Splits the array of image file names by the steps
 * @param {string[]} files - image filenames list
 * @param {number[]} durations - step durations list
 * @returns Objects of steps with a list of files for each step
 */

const duplicateGetStepData = (file, duration, step) => ({
    images: file,
    // totalVideoTime may be longer than the sum of durations
    // all extra time goes to the last step
    duration,
    frameRate: Math.round((file.length / duration) * 1000 * 10) / 10,
    step
  });


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
   * Creates step videos by out of the screenshots split by the given number of steps with provided durations
   * @param {number[]} durations - array with the story screens with their durations in ms
   * @param {number} step - step numbering
   * @returns
   */
  async createStepVideo (duration, step) {
    const files = await this.fsHandler.getFiles();
    console.log('Total files created: ', files.length);
    console.log('Total video length: ', duration);
    return this.createSingleVideo(duplicateGetStepData(files, duration, step), new Date())
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
