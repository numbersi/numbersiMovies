const router = require('koa-router')()
router.prefix('/api')
const Kan360 =require('../lib/crawler360kan')
const kan360 =  new Kan360()
router.get('/getListData',async function (ctx,next) 
{
   const {pageno,category} = ctx.query
    const  homeData  =  await kan360.getListData(pageno,category)
    ctx.body = homeData
})

router.get('/getDetialData',async function (ctx,next) {
  const {href}  = ctx.query
  const  detialData  =  await kan360.getDetialData(href)
  ctx.body = detialData
})
router.get('/ls')
module.exports = router
