const puppeteer =  require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhone =devices['Nexus 7']
let url = process.argv.splice(2)[0]
const sleep = time => new Promise(resolve =>{
    setTimeout(resolve,time)
})
// url = 'https://www.baidu.com'

puppeteer.launch()
    .then(
        async browser => {
            const page = await browser.newPage()

            let userAgent='Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
            await page.setUserAgent(userAgent)
            await page.goto(
                url
                ,{waitUntil:'networkidle2'}
                );
                await sleep(1000)
                const frame = page.mainFrame();
                const bodyHandle = await frame.$('body');
                playUrl = await page.$eval('video', v => v.src)
                console.log(playUrl);
                
            browser.close()
        }
        
    )
