

const index = require('../routes/index')
const users = require('../routes/users')
const search = require('../routes/search')
const play = require('../routes/play')
const collect = require('../routes/collect')
const api = require('../routes/api')
module.exports = app => {
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(search.routes(), search.allowedMethods())
app.use(play.routes(), play.allowedMethods())
app.use(collect.routes(), collect.allowedMethods())
app.use(api.routes(), api.allowedMethods())


    // // 进入微信消息中间件
    // router.get('/wx-hear', Wechat.hear)
    // router.post('/wx-hear', Wechat.hear)
    // router.get('/',async (ctx,next)=>{
    //     ctx.body = 'ss'
    // })
}
