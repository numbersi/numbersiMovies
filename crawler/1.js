const puppeteer = require('puppeteer')
const url = process.argv[2]
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    console.log('進入子進程');
    process.on('message', async function (data) {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })
        const page = await browser.newPage()
        let userAgent = 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        await page.setUserAgent(userAgent);
        // 获取  浏览器 对象
        console.log('子线程');
        console.log('紫禁城 開始工作'); 
        console.log(data);
        const {
            url
        } = data
       let play_url = await openPage(page,url)
       if (play_url ){
           process.send(play_url)
       }
    })
})()


async function openPage(page,url,jiekouIndex = 0) {
    console.log(url);
    let jiekou
    let video
    const jiekouArr = [
        'http://api.ataoju.com/play/?url=',
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
    await page.goto(jiekou+url, {
    })
    console.log(jiekou+url);
    const play_url =  await getApiRequest(page)
    console.log(play_url);
    return play_url

}


async function getApiRequest(page) {
    return new Promise((resolve, reject) => {
        page.on('requestfinished', async function (request) {
            if (request.method() == "POST") {

                const response = request.response()
                console.log(response.status());
                const data = await response.json()
                const host = request.url().split('//')[1].split('/')[0]
                console.log(host);
                let url = data.url
                if (!url.startsWith('http')) {
                    url = 'http://' + host + '/' + data.url
                }
                resolve(url)
            }
        })
    })
}
