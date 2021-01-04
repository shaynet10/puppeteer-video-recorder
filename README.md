# puppeteer-video-recorder
[Prerequisites](#Prerequisites "Prerequisites") | [Installation](#Installation "Installation") | [Manual](#Manual "Manual") | [InitOptions](InitOptions.md "InitOptions") | [StartOptions](StartOptions.md "StartOptions") | [FAQ](#FAQ "FAQ")

<p>
Puppeteer video recorder is a simple Puppeteer's plugin to create automatic videos for every new frame appears in the browser.
<p>

<h2> Why </h2>
<p>
It's based on <a href="https://www.npmjs.com/package/puppeteer-mass-screenshots">Puppeteer mass screenshots plugin</a> 
and therefore doesn't affect Puppeteer's run time.
</p>
<p>So basically, it's fast, and it won't slow your run time </p> 

<a name="Prerequisites"></a>
<h2> Prerequisites </h2>
<p>In order to use this plugin:</p>
<p>
    <ul>
        <li>Puppeteer must be installed.</li>
        <li>Pupepteer's page object must be created.</li>
        <li><b>FFMpeg must be installed</b> and set in PATH (or change the ffmpeg command to where it's accessible from)</li>
    </ul>
</p>

<a name="Installation"></a>
<h2>Installation</h2>
<p>To install the plugin to your project please use:</p>

```javascript
npm install puppeteer-video-recorder
```
<p>
You'll probably prefer to add it to your package.json file so you can use:</p>

```
npm install --save-prod puppeteer-video-recorder
```

<a name="Manual"></a>
<h2>Manual</h2>
<p>
Once Puppeteer video recorder is installed, you can require it in your project:

```javascript
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');
```
</p>
<p>
In your constructor create:

```javascript
const recorder = new PuppeteerVideoRecorder();
```
</p> 

<p>
After you have page object

```javascript
await recorder.init(page, videosPath);
```
<ul> 
<li><b>page</b> - Puppeteer page object (related to the browser).</li>
<li><b>videosPath</b> - where to save the created videos, images file and temporary images</li>
</ul>
</p>
<p>
To start the automatic video recording:

```javascript
await recorder.start();
```
</p>

<p>
To stop the automatic video recording:

```javascript
await recorder.stop();
```
<p>
    <b>Important</b> - call recorder.stop before browser is closed.
</p>

<a name="FAQ"></a>
<h2> FAQ </h2>

<h3> Does it support Chrome in headless mode?</h3>
<p>
Yes, it does.
</p>
<p>
it supports Chrome in headless / headful mode.
</p>
<p>
It records full length video, of every Chrome browser's frame, even though Chrome is in headless mode. 
</p>
<br/>
<h3> Does it support redirections in pages? </h3>
<p>Yes, it does.</p>
<p>This plugin is based on  <a href="https://www.npmjs.com/package/puppeteer-mass-screenshots">Puppeteer mass screenshots plugin</a> which supports redirection.
</p>
<br/>
<h3> Does it use the window object? </h3>
<p>No, it doesn't use the window object.</p>
<br/>

<h3> Can I run this plugin with my own page/browser objects? </h3>
<p>
Yes.
</p>
<br/>

<h3> Will it change my browser/page/window objects? </h3>
<p>No, it won't.</p>
<p>Feel free to set browser/page/window as you like, it won't be affected by this plugin.</p>
<br/>

<h3> Does it record videos in headless Chrome? </h3>
<p>Yes it does.</p>
<br/>

<h3>Creating videos is slow why?</h3>
<p>It is because current FFMPEG command is slow.</p>
<p>We should in the future upload a solution for faster conversion of FFMPEG</p>
<p>Feel free to send us one if you've found something faster and better, we always love to improve.</p>

<h3>I get errors related to FFMPEG, why?</h3>
<p>Please ensure that you have FFMPEG installed on your PC</p>
<p>run from your cmd / terminal (in linux) the command: ffmpeg --help</p>
<p>If you see results, and don't see "command not found" errors, this plugin should work with your FFMPEG</p>