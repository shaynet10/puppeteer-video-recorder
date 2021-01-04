const PuppeteerVideoRecorder = require('../index');
const puppeteer = require('puppeteer');

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
