const router = require('koa-router')()
// const Kan360 =require('../lib/crawler360kan')
// const {getDwz} =require('../lib/util')
const CollectLib = require('../lib/lib-collect')
router.prefix('/collect')
// 获取采集资源列表
router.get('/', async function (ctx, next) {
  const {wd,ids} = ctx.query
  const collectlib = new CollectLib()

  if(wd){
    ctx.body = await collectlib.searchBuWd(wd)
  }
  if(ids){
    ctx.body = await collectlib.getPlayLinkById(ids)

  }

})
//采集入库
module.exports = router
