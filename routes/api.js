const router = require('koa-router')()
router.prefix('/api')
const Kan360 = require('../lib/crawler360kan')
const TV6 = require('../lib/crawlerTv6')
const { getSignatureAsync } = require('../app/api/wechat')
const {sign} =require('../wechat-lib/util')
const tv6 = new TV6()
const {getPlayUrl} = require('../lib/lib-getPlayUrl')

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

module.exports = router
async function openPage(page,url,jiekouIndex = 0) {
  console.log(url);
  let jiekou
  const jiekouArr = config.jiekou
  if (url.startsWith('27pan')) {
      jiekou = 'https://api2.my230.com/?vid='
  } else {
      jiekou = jiekouArr[jiekouIndex]
      jiekouIndex += 1
  }
  if (!jiekou) {
      return []
  }
  console.log(jiekou);
  
   page.goto(jiekou+url)
  const play_url =  await getApiRequest(page)
  if(!play_url){
     console.log(jiekou+'沒有資源');
     return await openPage(page,url,jiekouIndex)
  }else{
      const resResponse  = await getApiResponse(play_url)
      console.log(resResponse.statusCode,play_url);
      if(resResponse.statusCode== 200||resResponse.statusCode == 405){
          return play_url
      }
      return  await openPage(page,url,jiekouIndex)
  }
}
async function getApiRequest(page) {
  return new Promise((resolve, reject) => {
      page.on('requestfinished', async function (request) {
          const url = request.url().split('?')[0]
          if (request.method() == "POST") {
              console.log( request.url());
              const response = request.response()
              const data = await response.json()
              const host = request.url().split('//')[1].split('/')[0]
              console.log(host);
              let url = data.url
              console.log( data.url);
              if(url){
                  if (!url.startsWith('http')) {
                      url = 'http://' + host + '/' + data.url
                  }
              }
           
              
              if(url&&url.indexOf("?url=") == -1){
                  resolve(url)
              }
          }
      })
  })
}
