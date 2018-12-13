const puppeteer = require('puppeteer')
const url = process.argv[2]
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
});
(async () => {

    const start = new Date()

    // 获取  浏览器 对象
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })
    // 获取  网页  对象
    const page = await browser.newPage()
    let userAgent = 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    await page.setUserAgent(userAgent)

    //  打开 网页   waitUntil: 'networkidle2' 确实网络空闲
    await page.goto(url, {
        // waitUntil: 'networkidle2'
    })

    const play_url = await getApiRequest(page)

    console.log(play_url);


    const ms = new Date() - start
    browser.close()
    console.log(`${ms}ms`)
    process.exit()
})()
async function getApiRequest(page) {
    return new Promise((resolve, reject) => {
        page.on('requestfinished', async function (request) {
            if (request.method() == "POST") {

                const response = request.response()
                console.log(response.status());
                const data = await response.json()
                const host = request.url().split('//')[1].split('/')[0]
                console.log(host);
                console.log(data);
                let url = data.url
                if (!url.startsWith('http')) {
                    url = 'http://' + host + '/' + url
                }
                resolve(url)
            }
        })
    })
}
