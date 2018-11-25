

const Wechat = require('../app/controllers/wechatController')

module.exports = router => {

    // 进入微信消息中间件
    router.get('/wx-hear', Wechat.hear)
    router.post('/wx-hear', Wechat.hear)
    router.get('/',async (ctx,next)=>{
        ctx.body = 'ss'
    })
}
