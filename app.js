const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const search = require('./routes/search')
const play = require('./routes/play')

const Router = require('koa-router')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
// error handler
onerror(app)
const router = new Router()

//数据库 
const { connect } = require('./app/database/init')
;(async function () {
 await  connect(config.db)
})()


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const reply  = require('./wechat/reply')
app.use(wechat(config.wechat,reply.reply))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(search.routes(), search.allowedMethods())
app.use(play.routes(), play.allowedMethods())

// require('./config/router')(router)

// app.use(router.routes()).use(router.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
