const puppeteer = require('puppeteer')
const url = process.argv[2]
const sleep = time => new Promise(resolve =>{
    setTimeout(resolve,time)
})
;(async ()=>{
    // 获取  浏览器 对象
const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
})
// 获取  网页  对象
const page = await browser.newPage()
let userAgent='Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
await page.setUserAgent(userAgent)

//  打开 网页   waitUntil: 'networkidle2' 确实网络空闲
await page.goto(url, {
    waitUntil: 'networkidle2'
})
await sleep(1000)

const a = await page.frames()

try {
    
    if (a.length>1) {
        playUrl = await a[a.length - 1].$eval('video', v => v.src)
    }else{
        playUrl = await page.$eval('video', v => v.src)
    }
    console.log(playUrl);
} catch (error) {
    console.log('notFind');
}finally{
    browser.close()
}

})()
