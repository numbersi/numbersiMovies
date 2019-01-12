const Koa = require('koa')
const config = require('./config/config')
const puppeteer = require('puppeteer')
const views = require('koa-views')
const wechat = require('./wechat-lib/middleware')

const {
    connect,
    initSchemas
} = require('./app/database/init')

;
(async () => {
    await connect(config.db)
    initSchemas()
    const page = await newPage()
    const app = new Koa()

    app.use(require('koa-static')(__dirname + '/public'))

    app.use(views(__dirname + '/views', {
        extension: 'pug'
    }))
    app.use(async (ctx, next) => {
        ctx.browserpage = page
        await next()
    })

    const reply  = require('./wechat/reply')
app.use(wechat(config.wechat,reply.reply))
    require('./config/router')(app)
    app.listen(config.port)
    console.log('Listening: ' + config.port)
})()

async function newPage() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })
    const page = await browser.newPage()
    let userAgent = 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    await page.setUserAgent(userAgent);
    return page
}