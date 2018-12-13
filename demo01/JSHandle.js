const puppeteer = require('puppeteer')
const url = process.argv[2]
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    console.log('進入子進程');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })
    const page = await browser.newPage()
    let userAgent = 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    await page.setUserAgent(userAgent);
    //  打开 网页   waitUntil: 'networkidle2' 确实网络空闲
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
  
    const windowHandle = await page.evaluateHandle(() => window);
    console.log(windowHandle.executionContext());
    
  
  }
    
    
    
    )()
