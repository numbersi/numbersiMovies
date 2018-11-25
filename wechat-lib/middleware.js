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

        let news = [{
          title: '这是TiTle',
          description: "这是description",
          picUrl: 'http://imgwx5.2345.com/dypcimg/top/images/focusTailor/video/20181120/0050e9dbd253922a2923954bbaa6fa7e.jpg',
          url: 'http://kan.2345.com/m/'
        }, {
          title: '这是TiTle',
          description: "这是description",
          picUrl: 'http://imgwx5.2345.com/dypcimg/top/images/focusTailor/video/20181120/0050e9dbd253922a2923954bbaa6fa7e.jpg',
          url: 'http://kan.2345.com/m/'
        }, {
          title: '这是TiTle',
          description: "这是description",
          picUrl: 'http://imgwx5.2345.com/dypcimg/top/images/focusTailor/video/20181120/0050e9dbd253922a2923954bbaa6fa7e.jpg',
          url: 'http://kan.2345.com/m/'
        }, {
          title: '这是TiTle',
          description: "这是description",
          picUrl: 'http://imgwx5.2345.com/dypcimg/top/images/focusTailor/video/20181120/0050e9dbd253922a2923954bbaa6fa7e.jpg',
          url: 'http://kan.2345.com/m/'
        }]
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
      await next()

    }
    console.log('end middleware')
  }
}
