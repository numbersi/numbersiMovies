const router = require('koa-router')()
var request = require('request-promise');
var cheerio = require('cheerio');
// var {getPlayUrl} = require('../lib/lib-getPlayUrl');
var {resolve} = require('path')
const { exec } = require('child_process');
var iconv = require('iconv-lite');  

// var Buffer = require('buffer')
router.prefix('/play')


router.get('/', async (ctx, next) => {
  url=ctx.query.url
  //  获取 qurey 2345 地址
  const res = request(url)
  
  // request 获取 html
  // 解析 html 得到 主要数据
    const data = await getDataBy2345Url(url)
  //  返回 模版
  // ctx.body = data
  await ctx.render(data.template,data.data)
})

async function getDataBy2345Url(url){
  const urlType = url.split('//')[1].split('.')[0]
  const  id = url.split('_').pop()  
  const html  =  await request({url, encoding: null})
  let data
  let template 
  
  switch (urlType) {
    
    case 'dianying':
      if(url.includes('mingxing')){
        template='mingxing'
        break
      }
      data =  await jxDianying(html)
      template='dianying'
      break;
    case 'tv':
    data = await jxTv(html)
    template='tv'
      break;
    case 'kan':
    data = await jxZongyi(html,id)
    template='zongyi'
    console.log(data);
    
      break;
    default:
     template='no'
      break;
  }
  return {template,data}
}
async function jxTv(html){
  const playSources = ['mgtv_con','qq_con','youku_con','qiyi_con','pptv_con']
  var $ = cheerio.load(iconv.decode(html, 'gb2312'))
  const img = $('.pic img').attr('src')
  const title = $('.tit a').attr('title')
  const emNum = $('.emNum').text().trim()
  let playNumList=[]
  for (let index = 0; index < playSources.length; index++) {
    const itemSource = playSources[index];
    playNumList_element = $(`#${itemSource}`)
    if (playNumList_element.text()){
      $(playNumList_element).find('a').each((index,a)=>{
            const  num = $(a).find('.num').text().trim()
            const  playLink = $(a).attr('href').split('?')[0]
            const  playLinkTitle = $(a).attr('title')
          if (num&& !playLinkTitle.includes('预告片')){
            playNumList.push({num,playLink , playLinkTitle})
          }
      })
      break
    }
  }
  const allData = {
    img,
    title,
    emNum,
    playNumList: playNumList . reverse() ,
  }
  return allData
}

async function jxDianying(html){
  const playSources = ['mgtv_0','youku_0','qq_0','mgtv_0','qiyi_0','pptv_0']
  var $ = cheerio.load(iconv.decode(html, 'gb2312'))
  let playSourceUrl  =''
  const img = $('.pic img').attr('src')
  const title = $('.tit h1').text()
  const emScore = $('.emScore').text().trim()

  for (let index = 0; index < playSources.length; index++) {
    // 优先获取 顺序，
    let playSource = playSources[index];
    console.log(playSource);
    const element_a = $(`a[data="${playSource}"]`)
    console.log(element_a.text());
    if(element_a.text()){
       playSourceUrl = element_a.attr('href')
      break;
    }
  }
  return {
    img,
    title,emScore,
    playLink:playSourceUrl
  }
}
async function jxZongyi(html,id){

  var $ = cheerio.load(iconv.decode(html, 'gb2312'))
  const img = $('.pic img').attr('src')
  const title = $('.tit h1').text()
  return {
    img,
    title,
    getPlayLinksApi:`https://kan.2345.com/moviecore/server/variety/?ctl=newDetail&act=ajaxList&id=${id}&year=2018&api=mgtv&month=0&isNew=0`
  }

}
module.exports = router
