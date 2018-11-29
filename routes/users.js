const router = require('koa-router')()
const Kan360 =require('../lib/crawler360kan')
const {getDwz} =require('../lib/util')

const Crawler2345 = require('../lib/crawler2345')

router.prefix('/')
router.get('/', async function (ctx, next) {
  const {wd} = ctx.query
  const kan360 =  new Kan360({wd})
  
  ctx.body = await kan360.searchApi()
})
router.get('/search2345', async function(ctx,next){
  const {wd} = ctx.query
  const c2345  = new Crawler2345()


  ctx.body =await c2345.searchByKey(wd)

})
// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })

module.exports = router
