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
    // 获取  浏览器 对象
    console.log('子线程');
    process.on('message', async function (data) {
        
        console.log('進入子進程1');
        
        const {
            url
        } = data
        console.log(data);
        // const video =await  openPage(page,url)
        const video =await  openPage1()
        // if(!video){
        //     process.send('notFind')
        // }else{
        //     process.send(video.src)
        // }
    })

})()

async function openPage1(){
    console.log('openPage1');

}
async function openPage(page,url, jiekouIndex = 0) {
    //  打开 网页   waitUntil: 'networkidle2' 确实网络空闲
    console.log(url);

    let jiekou
    let video
    const jiekouArr = [
        'http://app.baiyug.cn:2019/vip/index.php?url=',
    ]
    if (url.startsWith('27pan')) {
        jiekou = 'https://api2.my230.com/?vid='
    } else {
        jiekou = jiekouArr[jiekouIndex]
        jiekouIndex += 1
    }

    if (!jiekou) {
        return []
    }
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
    const a = await page.frames()
    if (a.length > 1) {
        console.log(a.length);
        let indenx = a.length - 1
        console.log(indenx);
        video = await a[indenx].$$('video')
        console.log(playUrl);
    } else {
        video = await page.$$('video')
    }
    if (!video) {
        jiekouIndex += 1
        console.log(jiekouIndex);
        
        return await openPage(page,url, jiekouIndex)
    }
    return video


}
