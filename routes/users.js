const router = require('koa-router')()
const Kan360 =require('../lib/crawler360kan')
const {getDwz} =require('../lib/util')
const mongoose =require('mongoose')
const Crawler2345 = require('../lib/crawler2345')

router.prefix('/')
router.get('/', async function (ctx, next) {
  // const {wd} = ctx.query
  // const kan360 =  new Kan360({wd})
  
  // ctx.body = await kan360.searchApi()
  console.log(ctx.browserPage)
})
router.get('/search2345', async function(ctx,next){
  const {wd} = ctx.query
  const c2345  = new Crawler2345()


  ctx.body =await c2345.searchByKey(wd)

})
// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })

router.get('/tv',async function (ctx,next) {
  const TvModel = mongoose.model('TV')
  const TvUrlModel = mongoose.model('TVUrl')
  category_id='5c03c93b679c153084e071bc'
  // const TvUrl  = new TvUrlModel({title:'湖南卫视Ulllll',TV:category_id})

  // ctx.body = await //TvUrl.save()
  const a  =await TvUrlModel.find({title:/湖南/i}).populate('TV')
  console.log(',,,,',a);
  
    TvModel.find({
    _id: category_id
  }).populate('tvUrl').exec(function (err, story) {
   
    console.log('The err is %s', err);
    console.log('The creator is %s', story);
    // prints "The creator is Aaron"
  })
})

module.exports = router
