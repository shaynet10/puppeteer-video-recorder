const PuppeteerVideoRecorder = require('../index');

const verifyFolderExists = async (path) => {
  await access(path).catch(async () => mkdir(path));
};

const testGoogle = async () => {
  const VIDEOS_PATH = `${process.cwd()}/videos`;
  const IMAGES_PATH = `${process.cwd()}/videos/images`;
  const pageKey = 'testGoogle';
  await verifyFolderExists(VIDEOS_PATH);
  await verifyFolderExists(IMAGES_PATH);
  const browser = await puppeteer.launch({ headless: true });
  const page = (await browser.pages())[0];
  const recorder = new PuppeteerVideoRecorder();
  await recorder.init(page, VIDEOS_PATH, IMAGES_PATH, pageKey);
  await page.goto('https://google.com');
  await recorder.startScreenshots();
  // await page.waitForNavigation({ waitUntil: 'domcontentloaded'});
  const input = await page.$('input[name=q]');
  await input.type('puppeteer-mass-screenshots', { delay: 250 });
  await input.press('Enter');
  // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  await recorder.stopScreenshots();
  await recorder.createVideos();

  await browser.close();
};

const testPageWithDuration = async () => {
  const VIDEOS_PATH = `${process.cwd()}/videos`;
  const IMAGES_PATH = `${process.cwd()}/videos/images`;
  const pageKey = 'fourSteps';
  await verifyFolderExists(VIDEOS_PATH);
  await verifyFolderExists(IMAGES_PATH);
  const durations = [3000, 3000, 4000, 8800];
  const videoLength = durations.reduce((acc, curr) => acc + curr, 0);
  const browser = await puppeteer.launch({ headless: true });
  const page = (await browser.pages())[0];
  const recorder = new PuppeteerVideoRecorder(pageKey);
  await recorder.init(page, VIDEOS_PATH, IMAGES_PATH, pageKey);
  await page.goto(
    'https://tocking.zirra.com/stories/c231dead-129a-40e6-8c66-05c5df9232b3?subtype=image-and-text&step=1',
  );
  // await page.waitForTimeout(100);
  await recorder.startScreenshots();
  await page.waitForTimeout(videoLength);
  await recorder.stopScreenshots();
  await recorder.createVideos(durations);
  await browser.close();
};

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = (await browser.pages())[0];
    const recorder = new PuppeteerVideoRecorder();
    await recorder.init(page, __dirname);
    await page.goto('https://google.com');
    await recorder.start();
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded'});
    const input = await page.$('input[name=q]');
    await input.type('puppetter-mass-screenshots', { delay: 250 });
    await input.press('Enter');
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await recorder.stop();
    await browser.close();
  })();
