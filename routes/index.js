const router = require('koa-router')()
var request = require('request-promise');

router.prefix('/wechat')
router.get('/', async (ctx, next) => {
  let b = await getMovies()
  // ctx.body = b
await ctx.render('index',{
    title:'Numbersi',
    data:b.data.data
  })
})

async function getMovies(){
  const url ='http://android.api.360kan.com/tj/?method=tj.datas&tid=1&ss=4&ver=159&ch=360sjzs'
  const a =  await request(url)
  return JSON.parse(a.substr(32))
}



router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
