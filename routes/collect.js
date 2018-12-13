const router = require('koa-router')()
const mongoose = require('mongoose')
const CollectLib = require('../lib/lib-collect')
router.prefix('/collect')
router.get('/', async function (ctx, next) {
  const {wd,ids,source} = ctx.query
  const collectlib = new CollectLib({source:source})
  if(wd){
    await searchFromDB(ctx,(ctx,next))
    data = await collectlib.searchBuWd(wd)
    data['title']=wd
    data['movies']=ctx.movie
    
    await ctx.render('collect',data)
  }
  // await ctx.render('collect',data)

})
router.get('/video',async function (ctx,next){
  const {ids ,source} = ctx.query
  const collectlib = new CollectLib({source:source})
  if(ids){
    data = await collectlib.getPlayLinkById(ids)
    // ctx.body= data
    await ctx.render('collect_video',data)
  }

  
})
//采集入库
router.get('/:source/:ids/:title',async function (ctx,next){
  const movieModel = mongoose.model('Movie')
  // await PlayUrlModel.findOne 
  console.log(ctx.params);
  ctx.params
  const  movie = new movieModel(ctx.params) 


  const res = await movie.save()
  ctx.body =res
})
router.get('/find',searchFromDB)

async function searchFromDB(ctx,next) {
  const movieModel = mongoose.model('Movie')

  const  {wd} = ctx.query
  const data = await movieModel.find({
    title: new RegExp(wd + '.*', 'i')
  })
  ctx.movie = data

  await next()
}

module.exports = router
