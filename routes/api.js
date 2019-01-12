const router = require('koa-router')()
router.prefix('/api')
const Kan360 = require('../lib/crawler360kan')
const TV6 = require('../lib/crawlerTv6')
const { getSignatureAsync } = require('../app/api/wechat')
const {sign} =require('../wechat-lib/util')
const tv6 = new TV6()
const {getPlayUrl} = require('../lib/lib-getPlayUrl')
const CollectLib = require('../lib/lib-collect')

const kan360 = new Kan360()
const config = require('../config/config')
router.get('/getListData', async function (ctx, next) {
  const { pageno, category } = ctx.query
  const homeData = await kan360.getListData(pageno, category)
  ctx.body = homeData
})

router.get('/getDetialData', async function (ctx, next) {
  const { href } = ctx.query
  const detialData = await kan360.getDetialData(href)
  ctx.body = detialData
})


router.get('/tv6/getHome', async function (ctx, next) {
  ctx.body = await tv6.getHomeData()
})

router.get('/checkMd5Html', async function (ctx, next) {
  const { category, md5_html } = ctx.query
  ctx.body = await kan360.checkMd5Html(category, md5_html)
})
router.get('/checkUpdate', async function(ctx,next){
  const { href, md5_html } = ctx.query
  ctx.body = await kan360.checkUpdate(href, md5_html)

})
router.get('/sdk', async function (ctx, next) {
  
  const signStr = await getSignatureAsync(ctx.href)

  signStr['share']={
    title: '这是一个标题', 
    desc: '这是一个非常详细的描述',
    link: 'http://h26n83.natappfree.cc/api/sdk',
    imgUrl: "https://p.ssl.qhimg.com/t01214fbe191f4ad2ba.jpg",
  }
    await ctx.render('sdk',signStr)
})

router.get('/getPlayUrl',async (ctx, next)=>{
  const query = Object.assign(ctx.query,{page:ctx.browserpage})
  const playUrl=  await getPlayUrl(query)
  ctx.body =playUrl
})

router.get('/search',async (ctx, next)=>{
  const { wd, source } = ctx.query
  const collectlib = new CollectLib({source:source})
  if(wd){
    data = await collectlib.searchBuWd(wd)
  }
  ctx.body = data
})
router.get('/video',async function (ctx,next){
  const {ids ,source} = ctx.query
  const collectlib = new CollectLib({source:source})
  if(ids){
    data = await collectlib.getPlayLinkById(ids)
    console.log(data);
    
    data  = {
      name :data.name[0],
      pic:fromatPic(data.pic[0]),
      actor:(data.actor[0]?data.actor[0].split(','):''),
      director:data.director[0],
      des:data.des.join('/').replace(/<[^>]+>/g,""),
      video_list:data.dl[0].dd
    }
    ctx.body = data
  } 
})
function fromatVideoList(data){
  return data.dd
}
function fromatPic(data){
   if(data.startsWith('tu.php?tu=')){
    return 'https://www.tv6.com/'+data
   }
   if(!data.startsWith('http')){
    return  'http://'+data
   }
   return data
}
module.exports = router
