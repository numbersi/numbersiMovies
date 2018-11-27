const sha1 = require('sha1')
const getRawBody = require('raw-body')
const util = require('./util')
module.exports = (config, reply) => {

  
  return async (ctx, next) => {
    console.log(ctx.query);
    const {
      signature,
      timestamp,
      nonce,
      echostr
    } = ctx.query
    if (signature) {
      // 微信 操作

      console.log('signature');

      const token = config.token
      let str = [token, timestamp, nonce].sort().join('')
      const sha = sha1(str)

      if (ctx.method === 'GET') {
        if (sha === signature) {
          ctx.body = echostr
        } else {
          console.log('netx');
            await next()
        }
      } else if (ctx.method === 'POST') {
        if (sha !== signature) {
          return (ctx.body = 'Failed111')
        }
        const data = await getRawBody(ctx.req, {
          length: ctx.length,
          limit: '1mb',
          encoding: ctx.charset
        })

        // console.log(data)
        const content = await util.parseXML(data)
        console.log('content')
        console.log(content)
        const message = util.formatMessage(content.xml)
        console.log('message')
        console.log(message)

        // const xml  = `<xml>
        // <ToUserName>
        //  <![CDATA[${message.FromUserName}]]>
        // </ToUserName> 
        // <FromUserName>
        //   <![CDATA[${message.ToUserName}]]>
        // </FromUserName>
        //  <CreateTime>
        //    ${parseInt(new Date().getTime()/1000 ,0)}
        //  </CreateTime>
        //   <MsgType>
        //      <![CDATA[text]]>
        //   </MsgType>
        //     <Content>
        //       <![CDATA[${message.Content}]]>
        //     </Content> 
        //    </xml>`

        ctx.weixin = message

        await reply.apply(ctx, [ctx, next])

        const replyBody = ctx.body
        console.error(replyBody)
        const msg = ctx.weixin

        let music = {
          type: 'music',
          title: 'asd',
          description: "这是description",
          musicUrl: 'http://music.163.com/song/media/outer/url?id=569200213.mp3',
          hqMusicUrl: 'http://music.163.com/song/media/outer/url?id=569200213.mp3',
          thumbMediaId: ''
        }
        const xml = util.tpl(replyBody, msg)

        console.log(xml)
        ctx.status = 200
        ctx.type = 'application/xml'
        ctx.body = xml
      }
    }else{
      console.log(ctx.request.header['user-agent']);
      if(ctx.request.header['user-agent'].match(/MicroMessenger|Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) == 'micromessenger'){
        console.log('微信');
        await next()
      }else{
          ctx.body ="请关注 微信公众号 ，回复你所想要看的视频 ， 腾讯视频，爱奇艺视频，优酷视频，芒果视频"
      }
      

    }
    console.log('end middleware')
  }
}
