const router = require('koa-router')()
const Kan360 =require('../lib/crawler360kan')
router.prefix('/')
router.get('/', async function (ctx, next) {
  const {wd} =   url=ctx.query
  const kan360 =  new Kan360({wd})
  ctx.body = await kan360.searchApi()
})

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })

module.exports = router
