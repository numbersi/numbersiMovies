const router = require('koa-router')()
router.prefix('/api')
const Kan360 =require('../lib/crawler360kan')
const TV6 =require('../lib/crawlerTv6')
const tv6 =new TV6()
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


router.get('/tv6/getHome',async function(ctx,next){
 ctx.body = await tv6.getHomeData()
})

router.get('/checkMd5Html',async function(ctx,next){
  const {category,md5_html}  = ctx.query
  ctx.body = await kan360.checkMd5Html(category,md5_html)
})
router.get('/sdk',async function(ctx,next){
  await ctx.render('sdk')
})

module.exports = router
