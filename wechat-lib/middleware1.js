const sha1 = require('sha1')
const getRawBody = require('raw-body')
const util = require('./util')

module.exports = (config, reply) => {
  return async (ctx, next) => {
    const { signature, timestamp, nonce, echostr } = ctx.query
    const token = config.token
    let str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'Failed'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        return (ctx.body = 'Failed')
      }

      const data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })

      console.log(data)
      const content = await util.parseXML(data)
      console.log('content')
      console.log(content)
      const message = util.formatMessage(content.xml)
      console.log('message')
      console.log(message)

      ctx.weixin = message

      await reply.apply(ctx, [ctx, next])

      const replyBody = ctx.body
      const msg = ctx.weixin
      const xml = util.tpl(replyBody, msg)

      console.log(xml)
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = xml
    }
  }
}
