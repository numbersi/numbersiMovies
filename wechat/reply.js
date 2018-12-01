const { getDwz } = require('../lib/util')
exports.reply = async (ctx, next)=>{
  const  message = ctx.weixin
  console.log("&&&&&&&&",ctx.weixin );
  let reply = ''
  if(message.MsgType==='text'){
    
    let content = message.Content
    reply  ='这是文本回复:'+content
    // let searchData=  await crawler2345.searchByKey(content)
    // console.log('searchData',searchData);
    const url_long = require('../config/config').host + '/collect?wd='+content
    const url_short = await getDwz(url_long)
    reply =url_short
  }else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      reply = '欢迎订阅,回复电视电影综艺节目的名字,就可以获得播放地址，免费收看' + ' ！'
      // if (message.EventKey && message.ticket) {
      //   reply += '扫码参数是：' + message.EventKey + '_' + message.ticket
      // } else {
      //   reply = help
      // }
    
    }
  }
  ctx.body =reply

  await next()

}
