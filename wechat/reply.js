const Crawler2345 = require('../lib/crawler2345')
exports.reply = async (ctx, next)=>{
  const  message = ctx.weixin
  console.log("&&&&&&&&",ctx.weixin );

  if(message.MsgType==='text'){
    
    let content = message.Content
    let reply  ='这是文本回复:'+content
    let crawler2345  = new Crawler2345()
    let searchData=  await crawler2345.searchByKey(content)
    console.log('searchData',searchData);
    
    ctx.body =searchData
  }else if (message.MsgType === 'event') {
    let reply = ''
    if (message.Event === 'subscribe') {
      reply = '欢迎订阅,回复电视电影综艺节目的名字,就可以获得播放地址，免费收看' + ' ！'
      // if (message.EventKey && message.ticket) {
      //   reply += '扫码参数是：' + message.EventKey + '_' + message.ticket
      // } else {
      //   reply = help
      // }
    
      ctx.body =reply
    }
  }

  await next()

}
