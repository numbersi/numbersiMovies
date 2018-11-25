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
  }

  await next()

}
